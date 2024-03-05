import { AuthService } from "./auth.service";
import { UserService } from "src/users/user.service";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthService } from './jwt/jwt.service';
import { ConfigService } from "@nestjs/config";
export declare class AuthController {
    private configService;
    private authService;
    private userService;
    private jwtAuthService;
    private jwtService;
    constructor(configService: ConfigService, authService: AuthService, userService: UserService, jwtAuthService: JwtAuthService, jwtService: JwtService);
    redirect(res: any): void;
    authentificate_42_User(req: any, res: any): Promise<void>;
    checkJwt(): boolean;
    verify_2fa(req: any, res: any): Promise<void>;
    get_google_2fa(req: any, res: any): Promise<void>;
    preview2fa(req: any, res: any): Promise<void>;
    enable_2fa(req: any, res: any): Promise<void>;
    disable_2fa(req: any): Promise<void>;
    changeUserName(req: any, res: any): Promise<void>;
    changeImage(req: any, res: any): Promise<void>;
}
