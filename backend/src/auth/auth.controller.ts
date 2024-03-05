
import { Controller, Get, HttpCode, HttpStatus, Post, Request, Response, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from './guards/auth.guard';
import { UserService } from "src/users/user.service";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthService } from './jwt/jwt.service';
import { ConfigService } from "@nestjs/config";
import * as dotenv from 'dotenv';
dotenv.config();

// const frontUrl = 'http://localhost:5173';
// const host = this.configService.get<string>('HOST');
// const front_port = this.configService.get<string>('FRONTEND_PORT');
// const back_port = this.configService.get<string>('BACKEND_PORT');

@Controller('auth')
export class AuthController {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
        private userService: UserService,
        private jwtAuthService: JwtAuthService,
        private jwtService: JwtService,
    ) { }

    /////////////////////////////////   [ 4 2   A u t h ]        //////////////////////////////////
    // --> [ ** Etape 1 **   -> Rediriger le User vers l'Api de 42 afin d'avoir un GET 'code' ] <--
    @Get('42')
    @HttpCode(302)
    redirect(@Response() res) {
        try {
            const host = this.configService.get<string>('HOST');
            const back_port = this.configService.get<string>('BACKEND_PORT');
            const redirect_uri = encodeURIComponent(`http://${host}:${back_port}/auth/42api-return`);
            const api_uid: string = this.configService.get<string>('UID');
            const url_42: string = `https://api.intra.42.fr/oauth/authorize?client_id=${api_uid}&redirect_uri=${redirect_uri}&response_type=code`;
            res.redirect(url_42);
        } catch (e) { }
    }

    //--> [ ** Etape 2 **  -> Get le retour de 42Api pour extraire le 'code', verif Auth make requests a 42Api ] <--
    @Get('42api-return')
    async authentificate_42_User(@Request() req, @Response() res) {
        try {
            const jwt = await this.authService.authentification_42(req);
            //  console.log("le jwt Controller:", jwt);
            if (!jwt) {
                throw new UnauthorizedException();
            }
            const jwtdecoded = await this.jwtService.decode(jwt) as { login: string };;
            //console.log("le jwtdecoded :", jwtdecoded);
            const user = await this.userService.find_user_by_login(jwtdecoded.login);
            const host = this.configService.get<string>('HOST');
            const front_port = this.configService.get<string>('FRONTEND_PORT');
            if (user.fa2 === true) {
                // console.log("-[ Auth 42 ]- 2fa user [ ", user.login, " ] { True }");

                const login: string = user.login;
                // const frontUrl = `http://${host}:${front_port}/?login=${login}`;
                const frontUrl = `http://${host}:${front_port}/?login=${login}&jwt=${jwt}`;
                res.redirect(frontUrl);
            }
            else {
                // console.log("-[ Auth 42 ]- 2fa user [ ", user.login, " ] { False }");
                // redirection vers le front avec le Jwt en Url
                const frontendUrl = `http://${host}:${front_port}/?jwt=${jwt}`;
                res.redirect(frontendUrl);
            }
        }
        catch {
            throw new UnauthorizedException();
        }
    }

    //--> [ ** Etape 3 **  -> Verifie si le Jwt est valide  (everything via AuthGuard :) ! )] <--
    @UseGuards(AuthGuard)
    @Post('verifier_jwt')
    checkJwt() {
        return true
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////



    // /////////////////////////////////   [ User Modifications ]      //////////////////////////////////
    @HttpCode(HttpStatus.OK)
    // @UseGuards(AuthGuard) //
    @Get('verify_2fa')
    async verify_2fa(@Request() req, @Response() res) {
        try {
            // console.log("-[ verify_2fa ]-");
            const tokenJwt = await this.authService.verify_2fa(req);
            res.json({ jwt: tokenJwt });
        } catch (e) {
            throw (e);
        }
    }

    @HttpCode(HttpStatus.OK)
    // @UseGuards(AuthGuard) //
    @Get('get_google_2fa')
    async get_google_2fa(@Request() req, @Response() res) {
        try {
            const host = this.configService.get<string>('HOST');
            const front_port = this.configService.get<string>('FRONTEND_PORT');
            // const adress: string = `http://${host}:${front_port}`;
            const url = new URL(req.url, `http://${host}:${front_port}`);
            // Vérifiez si le paramètre "code" est présent dans l'URL
            if (url.searchParams.has('login')) {
                const login = url.searchParams.get('login');
                // console.log("-[ get_google-2fa ]- login: ", login);
                if (!login) {
                    //console.log("Pb retour de \'Code\' ");
                    throw new UnauthorizedException();
                }
                const QrImg = await this.userService.get_QRCode(login);
                //    console.log("QrImg Envoye au front:  ", QrImg)
                res.json({ url: QrImg });
            }
            else {
                throw new UnauthorizedException();
            }
        } catch (e) { }
    }

    @HttpCode(HttpStatus.OK)
    // @UseGuards(AuthGuard) //
    @Get('enable_2fa')
    async preview2fa(@Request() req, @Response() res) {
        try {
            let login: string;
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
                //  console.log('-[Enable 2Fa ]- Jwt decoded from Header (Get): ', decoded);


                if (decoded && decoded.login) {
                    login = decoded.login;
                    // console.log('-[Enable 2Fa ]- Jwt login', login);
                }
                //return le bon Url a afficher 
                const QrImg = await this.userService.enable_2fa(login);
                //console.log("QrImg Envoye au front:  ", QrImg)
                res.json({ url: QrImg });

            }
        } catch (e) { }
    }

    @HttpCode(HttpStatus.OK)
    // @UseGuards(AuthGuard) //
    @Post('enable_2fa')
    async enable_2fa(@Request() req, @Response() res) {
        // console.log("-[ 2fa ]- Enable ");
        try {
            const login = req.body.data.login;
            // console.log("-[ 2fa ]- login Value:  ", login);
            const QrUrl = await this.userService.enable_2fa(login);
            const data = { urlcode: QrUrl };
            res.json(data);
        } catch (e) { }
    }


    @HttpCode(HttpStatus.OK)
    // @UseGuards(AuthGuard) //
    @Post('disable_2fa')
    async disable_2fa(@Request() req) {
        try {
            // console.log("-[ 2fa ]- Disable ");
            const login = req.body.data.login;
            // console.log("-[ 2fa ]- login Value:  ", login);
            await this.userService.remove_2fa(login);
        } catch (e) { }
    }

    //@UseGuards(AuthGuard) // BUGGG Compilation ou Import Module a FIX
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard) //
    @Post('changeName')
    async changeUserName(@Request() req, @Response() res) {
        try {
            // console.log(" -[ ChangeName Controller ]- ");
            const data = req.body.data;
            // console.log("-[ ChangeName Controller ]- data: ", data);
            if (!data) {
                // console.log("[ error ] -[ ChangeName ]- data inexistantes");
                throw new UnauthorizedException()
            }
            let login: string = data.login;
            let newUsername: string = data.newUsername;
            if (!newUsername.length || newUsername.length > 20) {
                throw new UnauthorizedException();
            }

            const newUser = await this.authService.change_userName(login, newUsername);
            // si Changement bien effectue, issue a new Jwt avec new Payload
            if (newUser) {
                const payload = {
                    "id": newUser.id,
                    "login": newUser.login,
                    "username": newUser.userName
                }
                //const newJwt = await this.authService.asign_jtw_token(payload);;
                const newJwt = await this.jwtAuthService.createToken(payload);
                res.header('Authorization', `Bearer ${newJwt}`);
                const host = this.configService.get<string>('HOST');
                const front_port = this.configService.get<string>('FRONTEND_PORT');
                const frontendUrl = `http://${host}:${front_port}/?jwt=${newJwt}`;
                res.redirect(frontendUrl);

            }
        } catch (e) {
            throw e;
        }
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard) //
    @Post('changeImage')
    async changeImage(@Request() req, @Response() res) {
        try {
            const img: string = req.body.data.img;
            if (!img.length || img.length > 200) {
                throw new UnauthorizedException();
            }
            const login = req.body.data.login;
            const user = await this.userService.find_user_by_login(login);
            // console.log("-[ Img ]-  old Avatar: ", user.avatar);
            if (!user || !img || img === "" || img.length < 5 || img.length > 500) {
                // console.log("-[ IMG change ]- { ERROR }");
                throw new UnauthorizedException();
            }
            const updatedUser = await this.userService.change_avatar(login, img);
            // console.log("-[ Img ]-  new Avatar: ", updatedUser.avatar);
            const host = this.configService.get<string>('HOST');
            const front_port = this.configService.get<string>('FRONTEND_PORT');
            const frontendUrl = `http://${host}:${front_port}`;
            res.redirect(frontendUrl);
            // res.redirect(frontUrl);
        } catch (e) { }
    }

}