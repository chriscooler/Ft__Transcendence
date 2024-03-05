
import { Injectable, UnauthorizedException, BadRequestException, ImATeapotException, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as otplib from 'otplib';
import { toDataURL } from 'qrcode';
import { JwtAuthService } from './jwt/jwt.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private configService: ConfigService,
    private jwtAuthService: JwtAuthService,

  ) { }

  // * - - - [  Authentification  { 42 } User  ] - - - *
  async authentification_42(req: Request) {
    const host = this.configService.get<string>('HOST');
    const front_port = this.configService.get<string>('FRONTEND_PORT');
    const back_port = this.configService.get<string>('BACKEND_PORT');
    // Vérifiez si le paramètre "code" est présent dans l'URL
    const url = new URL(req.url, `http://${host}:${front_port}`);
    if (url.searchParams.has('code')) {
      const code = url.searchParams.get('code');
      //console.log("Code: ", code);
      if (!code) {
        //console.log("Pb retour de \'Code\' ");
        return null;
      }

      // Echange 'code' vs a 42 'access_token' to get User's datas.
      try {
        const uid: string = this.configService.get<string>('UID');
        const secret: string = this.configService.get<string>('SECRET');
        //console.log("uid: ", uid);
        //console.log("secret: ", secret);
        const redirect_uri = encodeURIComponent(`http://${host}:${back_port}/auth/42api-return`);

        // console.log("Tentative recuperation { Access ( 42 ) Token } .. .");
        const url = 'https://api.intra.42.fr/oauth/token';
        const param = `grant_type=authorization_code&code=${code}&client_id=${uid}&client_secret=${secret}&redirect_uri=${redirect_uri}`;
        const response$ = this.httpService.post(url, param);
        const response = await lastValueFrom(response$)

        const accessToken = response.data.access_token;
        // console.log("Tentative recuperation { 'https://api.intra.42.fr/v2/me' }  ...");
        const urlMe = 'https://api.intra.42.fr/v2/me';
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const getMe$ = this.httpService.get(urlMe, { headers });
        const getMe = await lastValueFrom(getMe$);
        //console.log(" -[ 42 ]- /v2/me: ", getMe.data)
        const data = getMe.data;

        // Verifier si le login existe deja dans la dataBase sinon create !
        let user_in_db = await this.userService.find_user_by_login(data.login);
        if (!user_in_db) {
          // console.log("User: [ ", data.login, " ] doesnt exist in DB, So lets create it ! *");
          const user = {
            is42: true,
            login: data.login,
            userName: data.login,
            email: data.email,
            avatar: data.image.link,
            resetAvatar: data.image.link,
            id42: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
          }
          // console.log("user Me: ", user);
          await this.userService.add_new_user(user);
        }
        else {
          // console.log("User:  [ ", user_in_db.login, ' ] => Already exist in the Db');
        }
        const newCreatedUser = await this.userService.find_user_by_login(data.login);
        let jwt_payload = {
          "id": newCreatedUser.id,
          "login": newCreatedUser.login,
          "username": newCreatedUser.userName,
        }
        const jwt = await this.jwtAuthService.createToken(jwt_payload);
        // this.add_Online_User_inMap(await jwt, newCreatedUser);
        return jwt;
      }

      catch (error) {
        // console.log(" *{ Erreur }* -[ Auth42 ]-   -> error: ", error);
        // return new UnauthorizedException;
        return null;
      }
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////


  // * - -[  GOOGLE  AUTHentificator  ]- - *
  isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, fa2Secret: string) {
    try {
      return otplib.authenticator.verify({
        token: twoFactorAuthenticationCode,
        secret: fa2Secret,
      });
    } catch (e) { }
  }
  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  //  -[ VERIFY  2 FA - Google Auth ]-
  async verify_2fa(req: Request) {
    try {
      let login: string;
      let code: string;
      const host = this.configService.get<string>('HOST');
      const front_port = this.configService.get<string>('FRONTEND_PORT');
      const url = new URL(req.url, `http://${host}:${front_port}`);

      if (url.searchParams.has('code')) {
        code = url.searchParams.get('code');
        // console.log("-[ Verify_2Fa ]-Code: ", code);
        if (!code) {
          // console.log("-[ Verify_2Fa ]- no (code) in Url ");
          throw new UnauthorizedException();
        }
      } else {
        // console.log("-[ Verify_2Fa ]-no code in Param URL");
      }

      if (url.searchParams.has('login')) {
        login = url.searchParams.get('login');
        // console.log("-[ Verify_2Fa ]-login: ", login);
        if (!login) {
          // console.log("-[ Verify_2Fa ]- no (login) in URL");
          throw new UnauthorizedException();
        }
      } else {
        // console.log("-[ Verify_2Fa ]-no login in Param URL");
      }
      if (code && login) {
        // console.log("-[ Verify_2Fa ]-login & code bien Presents");
        const newAuthUser = await this.userService.find_user_by_login(login);
        const secret = newAuthUser.fa2Secret;
        if (this.isTwoFactorAuthenticationCodeValid(code, secret)) {
          await this.userService.turn_2fa_on(login);
          // console.log("-[ Verify_2Fa ]- Code Valide");

          // Create and return Jwt
          let jwt_payload = {
            "id": newAuthUser.id,
            "login": newAuthUser.login,
            "username": newAuthUser.userName,
          }
          // console.log("Creation du Token avec payload ... payload: ", jwt_payload);
          const jwt = await this.jwtAuthService.createToken(jwt_payload);
          return jwt;
        }
      }
      // console.log("-[ Verify_2Fa ]- Code INVALIDE");
      return null;
    } catch (e) {
      throw (e)
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////


  // * - - - [  Change UserName  ] - - - *
  async change_userName(login: string, newUsername: string) {
    try {
      // console.log('-[ Change_UserName ]- login: ', login, ' .  newUsername: ', newUsername);
      if (newUsername === '') {
        // console.log('empty username');
        return null;
      }
      // check if user exists
      const user = await this.userService.find_user_by_login(login);
      if (!user) {
        // console.log('User does not exist in db -> ', login);
        throw new BadRequestException('User does not exist');;
      }
      //check if new userName already in use
      // console.log("-[AuthService]- {Change Name} -- ");
      const userNameCheck = await this.userService.find_user_by_userName(newUsername);
      // console.log("userbyUsername: ", userNameCheck);
      const userLoginCheck = await this.userService.find_user_by_login(newUsername);
      // console.log("userbyLogin: ", userLoginCheck);
      if (login === newUsername) {
        if (userNameCheck) {
          // console.log('UserName already in use');
          // throw new BadRequestException('UserName already in use');
          throw new ImATeapotException('UserName already in use');
        }
      }
      else if (userNameCheck || userLoginCheck) {
        // console.log('New UserName already in use');
        // throw new BadRequestException('UserName already in use');
        throw new ImATeapotException('UserName already in use');
      }

      return await this.userService.change_username(login, newUsername);
    }
    catch (error) {
      // Handle errors
      console.error('An error occurred:', error);
      throw error; // Rethrow the caught error to propagate it further if needed
    }
  }

}