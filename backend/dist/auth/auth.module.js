"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/orm/user.entity");
const game_entity_1 = require("../users/orm/game.entity");
const user_module_1 = require("../users/user.module");
const user_service_1 = require("../users/user.service");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const jwt_service_1 = require("./jwt/jwt.service");
const direct_message_service_1 = require("../direct_message/direct_message.service");
const chat_service_1 = require("../chat/chat.service");
const chat_room_member_entity_1 = require("../chat/chat_room_member.entity");
const chat_room_entity_1 = require("../chat/chat_room.entity");
const chat_message_entity_1 = require("../chat/chat_message.entity");
const direct_message_entity_1 = require("../direct_message/direct_message.entity");
const direct_message_room_entity_1 = require("../direct_message/direct_message_room.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            user_module_1.UserModule,
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, game_entity_1.GameEntity, chat_room_member_entity_1.ChatRoomMember, chat_room_entity_1.ChatRoom, chat_message_entity_1.ChatMessage, direct_message_entity_1.DirectMessage, direct_message_room_entity_1.DirectMessageRoom]),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWTSECRET,
                signOptions: { expiresIn: '8h' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, user_service_1.UserService, jwt_service_1.JwtAuthService, direct_message_service_1.DirectMessageService, chat_service_1.ChatService],
        exports: [user_service_1.UserService, axios_1.HttpModule, user_module_1.UserModule, auth_service_1.AuthService, jwt_service_1.JwtAuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map