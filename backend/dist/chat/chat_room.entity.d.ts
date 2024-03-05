import { UserEntity } from '../users/orm/user.entity';
import { ChatMessage } from './chat_message.entity';
import { ChatRoomMember } from './chat_room_member.entity';
export declare class ChatRoom {
    id: string;
    updatedAt: Date;
    title: string;
    isPrivate: boolean;
    password: string;
    hashedPassword: string;
    members: ChatRoomMember[];
    messages: ChatMessage[];
    bannedUsers: UserEntity[];
}
