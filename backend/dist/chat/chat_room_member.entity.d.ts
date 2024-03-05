import { ChatRoom } from './chat_room.entity';
import { ChatMessage } from './chat_message.entity';
import { UserEntity } from 'src/users/orm/user.entity';
export declare class ChatRoomMember {
    id: number;
    chatRoom: ChatRoom;
    user: UserEntity;
    role: string;
    isBanned: boolean;
    isKicked: boolean;
    isMuted: boolean;
    messages: ChatMessage[];
    kickedTime: Date;
    kickDuration: number;
    mutedTime: Date;
    mutedDuration: number;
}
