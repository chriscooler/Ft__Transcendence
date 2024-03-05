import { Repository, EntityManager } from 'typeorm';
import { ChatRoom } from './chat_room.entity';
import { ChatMessage } from './chat_message.entity';
import { ChatRoomMember } from './chat_room_member.entity';
import { UserEntity } from 'src/users/orm/user.entity';
import { UserService } from 'src/users/user.service';
export declare class ChatService {
    private readonly chatRoomRepository;
    private readonly chatMessageRepository;
    private readonly chatRoomMemberRepository;
    private readonly userRepository;
    private entityManager;
    private readonly UserService;
    constructor(chatRoomRepository: Repository<ChatRoom>, chatMessageRepository: Repository<ChatMessage>, chatRoomMemberRepository: Repository<ChatRoomMember>, userRepository: Repository<UserEntity>, entityManager: EntityManager, UserService: UserService);
    createChatRoom(payload: {
        title: string;
        isPrivate: boolean;
        hashedPassword: string;
        userId: number;
        user: UserEntity;
    }): Promise<ChatRoom>;
    joinChatRoom(usere: UserEntity, room: ChatRoom, role: string): Promise<ChatRoomMember>;
    isUserMemberOfRoom(userId: number, roomId: string): Promise<boolean>;
    leaveChatRoom(memberId: number): Promise<void>;
    sendMessage(content: string, senderUser: UserEntity, login: string, roomId: string): Promise<ChatMessage>;
    listMessages(id: string): Promise<ChatMessage[]>;
    updateRoom(roomId: string, updatedFields: Partial<ChatRoom>): Promise<ChatRoom>;
    listAllRooms(): Promise<ChatRoom[]>;
    findRoomIdByTitle(title: string): Promise<string | null>;
    findByRoomId(roomId: string): Promise<ChatRoomMember>;
    findMembersByRoomId(roomId: string): Promise<ChatRoomMember[]>;
    findMemberByUserId(User: UserEntity): Promise<ChatRoomMember>;
    findMemberInChatRoom(memberId: number, chatRoomId: string): Promise<ChatRoomMember>;
    findChatRoom(roomId: string): Promise<ChatRoom>;
    incrementUtilisateurs(roomId: string): Promise<void>;
    verifyPassword(roomId: string, enteredPassword: string): Promise<boolean>;
    doesRoomExist(roomTitle: string): Promise<boolean>;
    doesOwnerExist(user: UserEntity, roomId: string): Promise<boolean>;
    leaveeChatRoom(usere: UserEntity, room: ChatRoom): Promise<void>;
    updateMember(member: ChatRoomMember): Promise<ChatRoomMember>;
    updateRoome(room: ChatRoom): Promise<ChatRoom>;
    eligibleMember(userId: number, roomId: string): Promise<Boolean>;
    deleteMember(member: ChatRoomMember): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteRoom(room: ChatRoom): Promise<{
        success: boolean;
        message: string;
    }>;
    makeOwner(room: ChatRoom): Promise<{
        success: boolean;
        message: string;
    }>;
    isUserBanned(userId: number, roomId: string): Promise<boolean>;
    unbanUser(userId: number, roomId: string): Promise<void>;
    updateRoomPassword(roomId: string, newPassword: string): Promise<ChatRoom>;
    cancelRoomPassword(roomId: string): Promise<ChatRoom>;
    getRoomHashedPassword(roomId: string): Promise<string | null>;
}
