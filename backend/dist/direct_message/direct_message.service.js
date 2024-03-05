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
exports.DirectMessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const direct_message_entity_1 = require("./direct_message.entity");
const direct_message_room_entity_1 = require("./direct_message_room.entity");
const user_service_1 = require("../users/user.service");
let DirectMessageService = class DirectMessageService {
    constructor(dmRepository, roomRepository, userService) {
        this.dmRepository = dmRepository;
        this.roomRepository = roomRepository;
        this.userService = userService;
    }
    async sendMessage(sender, receiver, messageText) {
        try {
            const userSender = await this.userService.find_user_by_id(sender);
            const userReceiver = await this.userService.find_user_by_id(receiver);
            let room = await this.roomRepository.createQueryBuilder("room")
                .leftJoinAndSelect("room.userOne", "userOne")
                .leftJoinAndSelect("room.userTwo", "userTwo")
                .where("userOne.id = :senderId AND userTwo.id = :receiverId", { senderId: userSender.id, receiverId: userReceiver.id })
                .orWhere("userOne.id = :receiverId AND userTwo.id = :senderId", { senderId: userSender.id, receiverId: userReceiver.id })
                .getOne();
            if (!room) {
                room = new direct_message_room_entity_1.DirectMessageRoom();
                room.userOne = userSender;
                room.userTwo = userReceiver;
                await this.roomRepository.save(room);
            }
            const message = new direct_message_entity_1.DirectMessage();
            message.room = room;
            message.roomId = room.id;
            message.sendBy = sender;
            message.sendTo = receiver;
            message.message = messageText;
            message.senderLogin = userSender.userName;
            message.recieverLogin = userReceiver.userName;
            const mes = await this.dmRepository.save(message);
            return mes;
        }
        catch (e) { }
    }
    async findAllRoomsForUser(userId) {
        try {
            const rooms = await this.roomRepository.createQueryBuilder("room")
                .leftJoinAndSelect("room.userOne", "userOne")
                .leftJoinAndSelect("room.userTwo", "userTwo")
                .where("userOne.id = :userId", { userId })
                .orWhere("userTwo.id = :userId", { userId })
                .getMany();
            const enhancedRooms = rooms.map(room => (Object.assign(Object.assign({}, room), { userOneDetails: {
                    userName: room.userOne.userName,
                    avatar: room.userOne.avatar,
                }, userTwoDetails: {
                    userName: room.userTwo.userName,
                    avatar: room.userTwo.avatar,
                } })));
            return enhancedRooms;
        }
        catch (e) { }
    }
    async findAllMessagesForRoom(roomId) {
        try {
            const messages = await this.dmRepository.find({
                where: { roomId: roomId },
                order: { date: 'ASC' }
            });
            return messages;
        }
        catch (e) { }
    }
    async clearDatabase() {
        try {
            await this.roomRepository.clear();
            await this.dmRepository.clear();
        }
        catch (e) { }
    }
};
exports.DirectMessageService = DirectMessageService;
exports.DirectMessageService = DirectMessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(direct_message_entity_1.DirectMessage)),
    __param(1, (0, typeorm_1.InjectRepository)(direct_message_room_entity_1.DirectMessageRoom)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService])
], DirectMessageService);
//# sourceMappingURL=direct_message.service.js.map