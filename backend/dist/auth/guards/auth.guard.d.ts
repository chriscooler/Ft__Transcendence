import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { JwtAuthService } from '../jwt/jwt.service';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private userService;
    private jwtAuthService;
    constructor(jwtService: JwtService, userService: UserService, jwtAuthService: JwtAuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
