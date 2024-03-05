import { Controller, Body, Post } from '@nestjs/common';
import { ChatService } from './chat.service'; // Assuming you have a ChatService
import { VerifyRoomDto } from './dto/verify-room-dto'
// import * as bcrypt from 'bcrypt';
import  * as bcrypt from 'bcryptjs';

@Controller('chat')
export class ChatController {

	constructor(private readonly chatService: ChatService) { }

	@Post('verify-room-password')

	async verifyRoomPassword(@Body() data: VerifyRoomDto): Promise<any> {
		const { roomId, password } = data;

		// Fetch hashed password for the room by roomId from the database
		const hashedPassword = await this.chatService.getRoomHashedPassword(roomId);

		if (!hashedPassword) {
			// Room not found or no password set for room
			return { success: false };
		}
		// Use bcrypt to compare the provided password with the stored hashed password
		const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

		if (isPasswordMatch) {
			return { success: true };
		} else {
			return { success: false };
		}
	}
}