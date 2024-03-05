import { Repository } from 'typeorm';
import { DirectMessage } from './direct_message.entity';
import { DirectMessageRoom } from './direct_message_room.entity';
import { UserService } from 'src/users/user.service';
interface EnhancedDirectMessageRoom extends DirectMessageRoom {
    userOneDetails: {
        userName: string;
        avatar: string;
    };
    userTwoDetails: {
        userName: string;
        avatar: string;
    };
}
export declare class DirectMessageService {
    private readonly dmRepository;
    private readonly roomRepository;
    private readonly userService;
    constructor(dmRepository: Repository<DirectMessage>, roomRepository: Repository<DirectMessageRoom>, userService: UserService);
    sendMessage(sender: number, receiver: number, messageText: string): Promise<DirectMessage>;
    findAllRoomsForUser(userId: number): Promise<EnhancedDirectMessageRoom[]>;
    findAllMessagesForRoom(roomId: number): Promise<DirectMessage[]>;
    clearDatabase(): Promise<void>;
}
export {};
