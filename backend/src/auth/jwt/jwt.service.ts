import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
	constructor(private jwtService: JwtService) { }

	async createToken(payload: any): Promise<string> {
		try {
			return this.jwtService.signAsync(payload);
		} catch (e) {
			throw new UnauthorizedException();
		}
	}

	async verifyToken(token: string) {
		try {
			return this.jwtService.verifyAsync(token);
		} catch (error) {
			throw new UnauthorizedException();
		}
	}
}