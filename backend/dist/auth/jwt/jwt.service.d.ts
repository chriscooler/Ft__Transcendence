import { JwtService } from '@nestjs/jwt';
export declare class JwtAuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    createToken(payload: any): Promise<string>;
    verifyToken(token: string): Promise<any>;
}
