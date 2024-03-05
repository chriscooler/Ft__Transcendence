import { Socket, Server } from 'socket.io';
import { DirectMessageService } from 'src/direct_message/direct_message.service';
import { ChatService } from 'src/chat/chat.service';
import { UserService } from 'src/users/user.service';
import { UserEntity } from 'src/users/orm/user.entity';
import { ChatRoom } from 'src/chat/chat_room.entity';
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
export declare class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private userService;
    private directMessageService;
    private chatService;
    server: Server;
    constructor(userService: UserService, directMessageService: DirectMessageService, chatService: ChatService);
    private socketsByUserID;
    private userIdFindHelper;
    private idByClientIdMap;
    private onlineUsersMap;
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    sendOnlineUsersDatas(client: Socket): Promise<void>;
    changeUsername(client: Socket): Promise<void>;
    resetAvatar(client: Socket, data: any): Promise<void>;
    sendFriendRequest(client: Socket, data: any): Promise<void>;
    acceptFriendRequest(client: Socket, data: any): Promise<void>;
    updateFriendList(client: Socket, data: any): Promise<void>;
    getLeaderBoard(client: Socket): Promise<void>;
    getOtherGameHstory(client: Socket, data: any): Promise<void>;
    enterGame(client: Socket, data: any): Promise<void>;
    sendGameInvitation(client: Socket, data: any): Promise<void>;
    refuseGameInvitation(client: Socket, data: any): Promise<void>;
    invitationUpdate(client: Socket, data: any): void;
    getDmRooms(client: Socket): Promise<void>;
    getDmRoomMessages(client: Socket, roomId: any): Promise<void>;
    sendMessage(client: Socket, data: any): Promise<void>;
    sendMessageN(client: Socket, data: any): Promise<void>;
    getChatRooms(client: Socket): Promise<void>;
    sendChatRooms(client: Socket, data: any): Promise<void>;
    getMessagesInChatRoom(client: Socket, id: any): Promise<void>;
    sendMessageChannel(client: Socket, payload: {
        message: string;
        sendBy: UserEntity;
        sendBylogin: string;
        sendTo: string;
    }): Promise<void>;
    joinChatRoom(client: Socket, payload: {
        user: UserEntity;
        room: ChatRoom;
        role: string;
    }): Promise<void>;
    getRoomIdChatRoom(client: Socket, roomTitle: string): Promise<void>;
    handleGetsMembersInRoom(client: Socket, roomId: string): Promise<void>;
    handleMuteUser(client: Socket, payload: {
        user: UserEntity;
        roomId: string;
        login: string;
        duration: number;
    }): Promise<void>;
    handleKickUser(client: Socket, payload: {
        user: UserEntity;
        roomId: string;
        login: string;
        duration: number;
    }): Promise<void>;
    handleBanUser(client: Socket, payload: {
        user: UserEntity;
        roomId: string;
        login: string;
    }): Promise<void>;
    handleCheckUserBan(client: Socket, payload: {
        userId: number;
        roomId: string;
    }): Promise<void>;
    handleCheckUserStatus(client: Socket, payload: {
        userId: number;
        roomId: string;
    }): Promise<void>;
    leaveChatRoom(client: Socket, payload: {
        user: UserEntity;
        room: ChatRoom;
    }): Promise<void>;
    handlemakeAdmin(client: Socket, payload: {
        user: UserEntity;
        roomId: string;
        login: string;
    }): Promise<void>;
    handleUnbanUser(client: Socket, payload: {
        user: UserEntity;
        userId: string;
        roomId: string;
    }): Promise<void>;
    passChatRoom(client: Socket, payload: {
        user: UserEntity;
        room: ChatRoom;
        newPassword: string;
    }): Promise<void>;
    cancelpassChatRoom(client: Socket, payload: {
        user: UserEntity;
        room: ChatRoom;
    }): Promise<void>;
    handleMessage(client: Socket, username: string): Promise<void>;
}
