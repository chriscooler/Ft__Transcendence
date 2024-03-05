"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_gateway_1 = require("./events.gateway");
const direct_message_module_1 = require("../direct_message/direct_message.module");
const user_service_1 = require("../users/user.service");
const user_module_1 = require("../users/user.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/orm/user.entity");
const direct_message_room_entity_1 = require("../direct_message/direct_message_room.entity");
const direct_message_entity_1 = require("../direct_message/direct_message.entity");
const game_entity_1 = require("../users/orm/game.entity");
const chat_module_1 = require("../chat/chat.module");
const direct_message_service_1 = require("../direct_message/direct_message.service");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        providers: [events_gateway_1.EventsGateway, user_service_1.UserService, direct_message_service_1.DirectMessageService],
        exports: [events_gateway_1.EventsGateway],
        imports: [direct_message_module_1.DirectMessageModule, user_module_1.UserModule, chat_module_1.ChatModule,
            typeorm_1.TypeOrmModule.forFeature([direct_message_entity_1.DirectMessage, direct_message_room_entity_1.DirectMessageRoom, user_entity_1.UserEntity, game_entity_1.GameEntity]),
        ]
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map