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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../../users/user.service");
const jwt_service_1 = require("../jwt/jwt.service");
let AuthGuard = class AuthGuard {
    constructor(jwtService, userService, jwtAuthService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.jwtAuthService = jwtAuthService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException();
        }
        try {
            const res = this.jwtService.decode(token);
            if (!res.id) {
                throw new common_1.UnauthorizedException();
            }
            let is_user_in_db = await this.userService.find_user_by_id(res.id);
            if (is_user_in_db) {
            }
            else {
                throw new common_1.UnauthorizedException();
            }
            try {
                const payload = await this.jwtAuthService.verifyToken(token);
            }
            catch (error) {
                throw new common_1.UnauthorizedException();
            }
            return true;
        }
        catch (_a) {
            throw new common_1.UnauthorizedException();
        }
    }
    extractTokenFromHeader(request) {
        var _a, _b;
        const [type, token] = (_b = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => jwt_service_1.JwtAuthService))),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        jwt_service_1.JwtAuthService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map