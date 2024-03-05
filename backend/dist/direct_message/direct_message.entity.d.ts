import { DirectMessageRoom } from './direct_message_room.entity';
export declare class DirectMessage {
    id: number;
    date: Date;
    message: string;
    senderLogin: string;
    recieverLogin: string;
    sendBy: number;
    sendTo: number;
    roomId: number;
    room: DirectMessageRoom;
}
