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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_service_1 = require("./chat.service");
const chat_controller_1 = require("./chat.controller");
const chat_gateway_1 = require("./chat.gateway");
const chat_room_entity_1 = require("./chat_room.entity");
const chat_message_entity_1 = require("./chat_message.entity");
const chat_room_member_entity_1 = require("./chat_room_member.entity");
const user_module_1 = require("../users/user.module");
const user_entity_1 = require("../users/orm/user.entity");
let ChatModule = class ChatModule {
    constructor(chatService, chatController) {
        this.chatService = chatService;
        this.chatController = chatController;
    }
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([chat_message_entity_1.ChatMessage, chat_room_entity_1.ChatRoom, chat_room_member_entity_1.ChatRoomMember, user_entity_1.UserEntity]), user_module_1.UserModule],
        providers: [chat_service_1.ChatService, chat_gateway_1.ChatGateway, chat_controller_1.ChatController],
        exports: [chat_service_1.ChatService, chat_controller_1.ChatController],
        controllers: [chat_controller_1.ChatController]
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        chat_controller_1.ChatController])
], ChatModule);
//# sourceMappingURL=chat.module.js.map