"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_room_entity_1 = require("./chat_room.entity");
const chat_message_entity_1 = require("./chat_message.entity");
const chat_room_member_entity_1 = require("./chat_room_member.entity");
const user_entity_1 = require("../users/orm/user.entity");
const user_service_1 = require("../users/user.service");
const bcrypt = require("bcryptjs");
let ChatService = class ChatService {
    constructor(chatRoomRepository, chatMessageRepository, chatRoomMemberRepository, userRepository, entityManager, UserService) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomMemberRepository = chatRoomMemberRepository;
        this.userRepository = userRepository;
        this.entityManager = entityManager;
        this.UserService = UserService;
    }
    async createChatRoom(payload) {
        try {
            const newRoom = this.chatRoomRepository.create(payload);
            const savedRoom = await this.chatRoomRepository.save(newRoom);
            const newOwner = this.chatRoomMemberRepository.create({
                user: payload.user,
                chatRoom: savedRoom,
                role: 'Owner',
            });
            await this.chatRoomMemberRepository.save(newOwner);
            return savedRoom;
        }
        catch (e) { }
    }
    async joinChatRoom(usere, room, role) {
        try {
            const roome = await this.findChatRoom(room.id);
            if (!usere) {
                throw new Error('User does not exist');
            }
            if (!roome) {
                throw new Error('Room does not exist');
            }
            const a = await this.isUserMemberOfRoom(usere.id, room.id);
            if (a != false) {
                return;
            }
            else {
                const newMember = this.chatRoomMemberRepository.create({
                    user: usere,
                    chatRoom: room,
                    role: 'Participant',
                });
                return await this.chatRoomMemberRepository.save(newMember);
            }
        }
        catch (e) { }
    }
    async isUserMemberOfRoom(userId, roomId) {
        try {
            const existingMember = await this.chatRoomMemberRepository.find({
                where: { user: { id: userId }, chatRoom: { id: roomId } }
            });
            return existingMember.length > 0;
        }
        catch (error) {
            throw false;
        }
    }
    async leaveChatRoom(memberId) {
        try {
            await this.chatRoomMemberRepository.delete(memberId);
        }
        catch (e) { }
    }
    async sendMessage(content, senderUser, login, roomId) {
        try {
            const room = await this.chatRoomRepository.findOne({ where: { id: roomId } });
            if (!room) {
                throw new Error("Room not found");
            }
            const chatRoomMember = await this.chatRoomMemberRepository.findOne({ where: { user: { id: senderUser.id }, chatRoom: { id: roomId } } });
            if (!chatRoomMember) {
                throw new Error("Sender not found in chat room members.");
            }
            const senderId = senderUser.id;
            const senderLogin = senderUser.userName;
            const newMessage = this.chatMessageRepository.create({ content, senderId, senderLogin, roomId });
            return await this.chatMessageRepository.save(newMessage);
        }
        catch (e) { }
    }
    async listMessages(id) {
        try {
            return await this.chatMessageRepository.find({ where: { roomId: id } });
        }
        catch (e) { }
    }
    async updateRoom(roomId, updatedFields) {
        try {
            await this.chatRoomRepository.update(roomId, updatedFields);
            return await this.chatRoomRepository.findOne({ where: { id: roomId } });
        }
        catch (e) { }
    }
    async listAllRooms() {
        try {
            return await this.chatRoomRepository.find();
        }
        catch (e) { }
    }
    async findRoomIdByTitle(title) {
        try {
            const room = await this.chatRoomRepository.findOne({ where: { title: title } });
            return room ? room.id : null;
        }
        catch (e) { }
    }
    async findByRoomId(roomId) {
        try {
            const room = await this.chatRoomMemberRepository.findOne({
                where: {
                    chatRoom: { id: roomId }
                }
            });
            return room;
        }
        catch (e) { }
    }
    async findMembersByRoomId(roomId) {
        try {
            const room = await this.chatRoomRepository.findOne({
                where: { id: roomId },
                relations: ['members', 'members.user'],
            });
            if (!room) {
                throw new Error(`Room with ID ${roomId} not found`);
            }
            return room.members;
        }
        catch (e) { }
    }
    async findMemberByUserId(User) {
        try {
            const member = await this.chatRoomMemberRepository.findOne({
                where: {
                    user: { id: User.id }
                }
            });
            return member;
        }
        catch (e) { }
    }
    async findMemberInChatRoom(memberId, chatRoomId) {
        try {
            const member = await this.chatRoomMemberRepository.findOne({
                where: {
                    user: { id: memberId },
                    chatRoom: { id: chatRoomId }
                }
            });
            return member;
        }
        catch (e) { }
    }
    async findChatRoom(roomId) {
        try {
            const room = await this.chatRoomRepository.findOne({ where: { id: roomId } });
            if (!room) {
                throw new Error(`Room with ID ${roomId} not found`);
            }
            return room;
        }
        catch (error) {
            throw new Error(`Room with ID ${roomId} not found`);
        }
    }
    async incrementUtilisateurs(roomId) {
        try {
            await this.chatRoomRepository.increment({ id: roomId }, 'utilisateurs', 1);
        }
        catch (error) {
        }
    }
    async verifyPassword(roomId, enteredPassword) {
        try {
            const room = await this.findChatRoom(roomId);
            if (!room) {
                throw new common_1.NotFoundException(`Room with ID ${roomId} not found`);
            }
            return room.password === enteredPassword;
        }
        catch (e) { }
    }
    async doesRoomExist(roomTitle) {
        try {
            const room = await this.chatRoomRepository.findOne({ where: { title: roomTitle } });
            return !!room;
        }
        catch (e) { }
    }
    async doesOwnerExist(user, roomId) {
        try {
            const ownerMember = await this.chatRoomMemberRepository
                .createQueryBuilder('chatRoomMember')
                .innerJoin('chatRoomMember.chatRoom', 'chatRoom')
                .innerJoin('chatRoomMember.user', 'user')
                .where('chatRoom.id = :roomId', { roomId })
                .andWhere('user.id = :userId', { userId: user.id })
                .andWhere('chatRoomMember.role = :role', { role: 'Owner' })
                .getOne();
            return !!ownerMember;
        }
        catch (e) { }
    }
    async leaveeChatRoom(usere, room) {
        try {
            const roome = await this.findChatRoom(room.id);
            if (!usere) {
                throw new Error('User does not exist');
            }
            if (!roome) {
                throw new Error('Room does not exist');
            }
            const isMember = await this.isUserMemberOfRoom(usere.id, room.id);
            if (!isMember) {
                return;
            }
        }
        catch (e) { }
        try {
        }
        catch (error) {
            throw new Error('Unable to remove user from room');
        }
    }
    async updateMember(member) {
        try {
            return await this.chatRoomMemberRepository.save(member);
        }
        catch (e) { }
    }
    async updateRoome(room) {
        try {
            return await this.chatRoomRepository.save(room);
        }
        catch (e) { }
    }
    async eligibleMember(userId, roomId) {
        try {
            const member = await this.findMemberInChatRoom(userId, roomId);
            if (member.isKicked == false && member.isBanned == false || await this.isUserBanned(userId, roomId) == false)
                return true;
            return false;
        }
        catch (e) { }
    }
    async deleteMember(member) {
        try {
            const tri = await this.chatRoomMemberRepository.remove(member);
            if (tri)
                return { success: true, message: "Member deleted successfully" };
            else {
                return { success: false, message: "Member not found" };
            }
        }
        catch (error) {
            throw new Error("There was an error deleting the member");
        }
    }
    async deleteRoom(room) {
        try {
            await this.chatRoomRepository.remove(room);
            return { success: true, message: "Room deleted successfully" };
        }
        catch (error) {
            return { success: false, message: "There was an error deleting the room" };
        }
    }
    async makeOwner(room) {
        try {
            const members = await this.findMembersByRoomId(room.id);
            if (members && members.length > 0) {
                const adminMembers = members.filter(member => member.role === 'Admin');
                if (adminMembers.length > 0) {
                    const nextOwner = adminMembers.reduce((prev, curr) => {
                        return prev.id < curr.id ? prev : curr;
                    });
                    nextOwner.role = 'Owner';
                    await this.chatRoomMemberRepository.save(nextOwner);
                    return { success: true, message: "Ownership transferred successfully" };
                }
                else {
                    return { success: false, message: "No admins found to transfer ownership" };
                }
            }
            else {
                return { success: false, message: "No members found in the room" };
            }
        }
        catch (error) {
            throw new Error("There was an error promoting the member to owner");
        }
    }
    async isUserBanned(userId, roomId) {
        try {
            const room = await this.chatRoomRepository.findOne({
                where: { id: roomId },
                relations: ['bannedUsers']
            });
            if (room && room.bannedUsers) {
                return room.bannedUsers.some(bannedUser => bannedUser.id === userId);
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw new Error(`Error checking ban status: ${error.message}`);
        }
    }
    async unbanUser(userId, roomId) {
        try {
            const room = await this.chatRoomRepository.findOne({
                where: { id: roomId },
                relations: ['bannedUsers']
            });
            if (room && room.bannedUsers) {
                const updatedBannedUsers = room.bannedUsers.filter(user => user.id !== userId);
                room.bannedUsers = updatedBannedUsers;
                await this.chatRoomRepository.save(room);
            }
        }
        catch (error) {
            throw new Error(`Error unbanning user: ${error.message}`);
        }
    }
    async updateRoomPassword(roomId, newPassword) {
        try {
            const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId } });
            if (!chatRoom) {
                throw new Error('Chat room not found.');
            }
            if (!chatRoom.isPrivate)
                chatRoom.isPrivate = true;
            let hashedPassword;
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            chatRoom.hashedPassword = hashedPassword;
            await this.chatRoomRepository.save(chatRoom);
            return chatRoom;
        }
        catch (e) { }
    }
    async cancelRoomPassword(roomId) {
        try {
            const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId } });
            if (!chatRoom) {
                throw new Error('Chat room not found.');
            }
            if (chatRoom.isPrivate) {
                chatRoom.isPrivate = false;
                chatRoom.hashedPassword = "";
                await this.chatRoomRepository.save(chatRoom);
            }
            return chatRoom;
        }
        catch (e) { }
    }
    async getRoomHashedPassword(roomId) {
        try {
            const room = await this.chatRoomRepository.findOne({ where: { id: roomId } });
            return room ? room.hashedPassword : null;
        }
        catch (e) { }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_room_entity_1.ChatRoom)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(chat_room_member_entity_1.ChatRoomMember)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.EntityManager,
        user_service_1.UserService])
], ChatService);
//# sourceMappingURL=chat.service.js.map