import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
export declare class ChatModule {
    private readonly chatService;
    private readonly chatController;
    constructor(chatService: ChatService, chatController: ChatController);
}
