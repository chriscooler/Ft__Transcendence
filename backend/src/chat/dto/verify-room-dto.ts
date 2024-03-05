import { IsString, Length, IsNotEmpty } from 'class-validator';

export class VerifyRoomDto {
	@IsNotEmpty()
	@IsString()
	roomId: string;

	@IsNotEmpty()
	@IsString()
	@Length(4, 20)  // Assuming the password should be between 4 to 20 characters
	password: string;
}