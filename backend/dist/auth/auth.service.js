"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const otplib = require("otplib");
const qrcode_1 = require("qrcode");
const jwt_service_1 = require("./jwt/jwt.service");
const user_service_1 = require("../users/user.service");
let AuthService = class AuthService {
    constructor(httpService, userService, configService, jwtAuthService) {
        this.httpService = httpService;
        this.userService = userService;
        this.configService = configService;
        this.jwtAuthService = jwtAuthService;
    }
    async authentification_42(req) {
        const host = this.configService.get('HOST');
        const front_port = this.configService.get('FRONTEND_PORT');
        const back_port = this.configService.get('BACKEND_PORT');
        const url = new URL(req.url, `http://${host}:${front_port}`);
        if (url.searchParams.has('code')) {
            const code = url.searchParams.get('code');
            if (!code) {
                return null;
            }
            try {
                const uid = this.configService.get('UID');
                const secret = this.configService.get('SECRET');
                const redirect_uri = encodeURIComponent(`http://${host}:${back_port}/auth/42api-return`);
                const url = 'https://api.intra.42.fr/oauth/token';
                const param = `grant_type=authorization_code&code=${code}&client_id=${uid}&client_secret=${secret}&redirect_uri=${redirect_uri}`;
                const response$ = this.httpService.post(url, param);
                const response = await (0, rxjs_1.lastValueFrom)(response$);
                const accessToken = response.data.access_token;
                const urlMe = 'https://api.intra.42.fr/v2/me';
                const headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
                const getMe$ = this.httpService.get(urlMe, { headers });
                const getMe = await (0, rxjs_1.lastValueFrom)(getMe$);
                const data = getMe.data;
                let user_in_db = await this.userService.find_user_by_login(data.login);
                if (!user_in_db) {
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
                    };
                    await this.userService.add_new_user(user);
                }
                else {
                }
                const newCreatedUser = await this.userService.find_user_by_login(data.login);
                let jwt_payload = {
                    "id": newCreatedUser.id,
                    "login": newCreatedUser.login,
                    "username": newCreatedUser.userName,
                };
                const jwt = await this.jwtAuthService.createToken(jwt_payload);
                return jwt;
            }
            catch (error) {
                return null;
            }
        }
    }
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, fa2Secret) {
        try {
            return otplib.authenticator.verify({
                token: twoFactorAuthenticationCode,
                secret: fa2Secret,
            });
        }
        catch (e) { }
    }
    async generateQrCodeDataURL(otpAuthUrl) {
        return (0, qrcode_1.toDataURL)(otpAuthUrl);
    }
    async verify_2fa(req) {
        try {
            let login;
            let code;
            const host = this.configService.get('HOST');
            const front_port = this.configService.get('FRONTEND_PORT');
            const url = new URL(req.url, `http://${host}:${front_port}`);
            if (url.searchParams.has('code')) {
                code = url.searchParams.get('code');
                if (!code) {
                    throw new common_1.UnauthorizedException();
                }
            }
            else {
            }
            if (url.searchParams.has('login')) {
                login = url.searchParams.get('login');
                if (!login) {
                    throw new common_1.UnauthorizedException();
                }
            }
            else {
            }
            if (code && login) {
                const newAuthUser = await this.userService.find_user_by_login(login);
                const secret = newAuthUser.fa2Secret;
                if (this.isTwoFactorAuthenticationCodeValid(code, secret)) {
                    await this.userService.turn_2fa_on(login);
                    let jwt_payload = {
                        "id": newAuthUser.id,
                        "login": newAuthUser.login,
                        "username": newAuthUser.userName,
                    };
                    const jwt = await this.jwtAuthService.createToken(jwt_payload);
                    return jwt;
                }
            }
            return null;
        }
        catch (e) {
            throw (e);
        }
    }
    async change_userName(login, newUsername) {
        try {
            if (newUsername === '') {
                return null;
            }
            const user = await this.userService.find_user_by_login(login);
            if (!user) {
                throw new common_1.BadRequestException('User does not exist');
                ;
            }
            const userNameCheck = await this.userService.find_user_by_userName(newUsername);
            const userLoginCheck = await this.userService.find_user_by_login(newUsername);
            if (login === newUsername) {
                if (userNameCheck) {
                    throw new common_1.ImATeapotException('UserName already in use');
                }
            }
            else if (userNameCheck || userLoginCheck) {
                throw new common_1.ImATeapotException('UserName already in use');
            }
            return await this.userService.change_username(login, newUsername);
        }
        catch (error) {
            console.error('An error occurred:', error);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        user_service_1.UserService,
        config_1.ConfigService,
        jwt_service_1.JwtAuthService])
], AuthService);
//# sourceMappingURL=auth.service.js.map