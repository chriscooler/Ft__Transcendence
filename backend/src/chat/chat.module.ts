import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatRoom } from './chat_room.entity';
import { ChatMessage } from './chat_message.entity';
import { ChatRoomMember } from './chat_room_member.entity';
import { UserModule } from 'src/users/user.module';
import { UserEntity } from 'src/users/orm/user.entity'

@Module({
	imports: [TypeOrmModule.forFeature([ChatMessage, ChatRoom, ChatRoomMember, UserEntity]), UserModule],
	providers: [ChatService, ChatGateway, ChatController],
	exports: [ChatService, ChatController],
	controllers: [ChatController]
})
export class ChatModule {
	constructor(private readonly chatService: ChatService,
		private readonly chatController: ChatController) { }
}