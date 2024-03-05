import { ChatService } from './chat.service';
import { VerifyRoomDto } from './dto/verify-room-dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    verifyRoomPassword(data: VerifyRoomDto): Promise<any>;
}
