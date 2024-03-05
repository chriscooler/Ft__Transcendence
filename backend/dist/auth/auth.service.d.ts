import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { JwtAuthService } from './jwt/jwt.service';
import { UserService } from 'src/users/user.service';
export declare class AuthService {
    private httpService;
    private userService;
    private configService;
    private jwtAuthService;
    constructor(httpService: HttpService, userService: UserService, configService: ConfigService, jwtAuthService: JwtAuthService);
    authentification_42(req: Request): Promise<string>;
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, fa2Secret: string): boolean;
    generateQrCodeDataURL(otpAuthUrl: string): Promise<string>;
    verify_2fa(req: Request): Promise<string>;
    change_userName(login: string, newUsername: string): Promise<import("../users/orm/user.entity").UserEntity>;
}
