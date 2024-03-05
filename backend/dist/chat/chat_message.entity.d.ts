import { UserEntity } from '../users/orm/user.entity';
import { ChatRoom } from './chat_room.entity';
export declare class ChatMessage {
    id: string;
    createdAt: Date;
    content: string;
    senderId: number;
    senderLogin: string;
    roomId: string;
    sender: UserEntity;
    room: ChatRoom;
}
