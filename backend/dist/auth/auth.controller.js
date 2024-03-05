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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_guard_1 = require("./guards/auth.guard");
const user_service_1 = require("../users/user.service");
const jwt_1 = require("@nestjs/jwt");
const jwt_service_1 = require("./jwt/jwt.service");
const config_1 = require("@nestjs/config");
const dotenv = require("dotenv");
dotenv.config();
let AuthController = class AuthController {
    constructor(configService, authService, userService, jwtAuthService, jwtService) {
        this.configService = configService;
        this.authService = authService;
        this.userService = userService;
        this.jwtAuthService = jwtAuthService;
        this.jwtService = jwtService;
    }
    redirect(res) {
        try {
            const host = this.configService.get('HOST');
            const back_port = this.configService.get('BACKEND_PORT');
            const redirect_uri = encodeURIComponent(`http://${host}:${back_port}/auth/42api-return`);
            const api_uid = this.configService.get('UID');
            const url_42 = `https://api.intra.42.fr/oauth/authorize?client_id=${api_uid}&redirect_uri=${redirect_uri}&response_type=code`;
            res.redirect(url_42);
        }
        catch (e) { }
    }
    async authentificate_42_User(req, res) {
        try {
            const jwt = await this.authService.authentification_42(req);
            if (!jwt) {
                throw new common_1.UnauthorizedException();
            }
            const jwtdecoded = await this.jwtService.decode(jwt);
            ;
            const user = await this.userService.find_user_by_login(jwtdecoded.login);
            const host = this.configService.get('HOST');
            const front_port = this.configService.get('FRONTEND_PORT');
            if (user.fa2 === true) {
                const login = user.login;
                const frontUrl = `http://${host}:${front_port}/?login=${login}&jwt=${jwt}`;
                res.redirect(frontUrl);
            }
            else {
                const frontendUrl = `http://${host}:${front_port}/?jwt=${jwt}`;
                res.redirect(frontendUrl);
            }
        }
        catch (_a) {
            throw new common_1.UnauthorizedException();
        }
    }
    checkJwt() {
        return true;
    }
    async verify_2fa(req, res) {
        try {
            const tokenJwt = await this.authService.verify_2fa(req);
            res.json({ jwt: tokenJwt });
        }
        catch (e) {
            throw (e);
        }
    }
    async get_google_2fa(req, res) {
        try {
            const host = this.configService.get('HOST');
            const front_port = this.configService.get('FRONTEND_PORT');
            const url = new URL(req.url, `http://${host}:${front_port}`);
            if (url.searchParams.has('login')) {
                const login = url.searchParams.get('login');
                if (!login) {
                    throw new common_1.UnauthorizedException();
                }
                const QrImg = await this.userService.get_QRCode(login);
                res.json({ url: QrImg });
            }
            else {
                throw new common_1.UnauthorizedException();
            }
        }
        catch (e) { }
    }
    async preview2fa(req, res) {
        try {
            let login;
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                if (decoded && decoded.login) {
                    login = decoded.login;
                }
                const QrImg = await this.userService.enable_2fa(login);
                res.json({ url: QrImg });
            }
        }
        catch (e) { }
    }
    async enable_2fa(req, res) {
        try {
            const login = req.body.data.login;
            const QrUrl = await this.userService.enable_2fa(login);
            const data = { urlcode: QrUrl };
            res.json(data);
        }
        catch (e) { }
    }
    async disable_2fa(req) {
        try {
            const login = req.body.data.login;
            await this.userService.remove_2fa(login);
        }
        catch (e) { }
    }
    async changeUserName(req, res) {
        try {
            const data = req.body.data;
            if (!data) {
                throw new common_1.UnauthorizedException();
            }
            let login = data.login;
            let newUsername = data.newUsername;
            if (!newUsername.length || newUsername.length > 20) {
                throw new common_1.UnauthorizedException();
            }
            const newUser = await this.authService.change_userName(login, newUsername);
            if (newUser) {
                const payload = {
                    "id": newUser.id,
                    "login": newUser.login,
                    "username": newUser.userName
                };
                const newJwt = await this.jwtAuthService.createToken(payload);
                res.header('Authorization', `Bearer ${newJwt}`);
                const host = this.configService.get('HOST');
                const front_port = this.configService.get('FRONTEND_PORT');
                const frontendUrl = `http://${host}:${front_port}/?jwt=${newJwt}`;
                res.redirect(frontendUrl);
            }
        }
        catch (e) {
            throw e;
        }
    }
    async changeImage(req, res) {
        try {
            const img = req.body.data.img;
            if (!img.length || img.length > 200) {
                throw new common_1.UnauthorizedException();
            }
            const login = req.body.data.login;
            const user = await this.userService.find_user_by_login(login);
            if (!user || !img || img === "" || img.length < 5 || img.length > 500) {
                throw new common_1.UnauthorizedException();
            }
            const updatedUser = await this.userService.change_avatar(login, img);
            const host = this.configService.get('HOST');
            const front_port = this.configService.get('FRONTEND_PORT');
            const frontendUrl = `http://${host}:${front_port}`;
            res.redirect(frontendUrl);
        }
        catch (e) { }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('42'),
    (0, common_1.HttpCode)(302),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "redirect", null);
__decorate([
    (0, common_1.Get)('42api-return'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authentificate_42_User", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('verifier_jwt'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "checkJwt", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('verify_2fa'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify_2fa", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('get_google_2fa'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "get_google_2fa", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('enable_2fa'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "preview2fa", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('enable_2fa'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enable_2fa", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('disable_2fa'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disable_2fa", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('changeName'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changeUserName", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('changeImage'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changeImage", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService,
        user_service_1.UserService,
        jwt_service_1.JwtAuthService,
        jwt_1.JwtService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map