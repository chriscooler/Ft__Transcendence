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
exports.DirectMessageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const direct_message_entity_1 = require("./direct_message.entity");
const direct_message_service_1 = require("./direct_message.service");
const direct_message_room_entity_1 = require("./direct_message_room.entity");
const user_module_1 = require("../users/user.module");
let DirectMessageModule = class DirectMessageModule {
    constructor(dmService) {
        this.dmService = dmService;
    }
};
exports.DirectMessageModule = DirectMessageModule;
exports.DirectMessageModule = DirectMessageModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([direct_message_entity_1.DirectMessage, direct_message_room_entity_1.DirectMessageRoom]), user_module_1.UserModule],
        providers: [direct_message_service_1.DirectMessageService],
        exports: [direct_message_service_1.DirectMessageService]
    }),
    __metadata("design:paramtypes", [direct_message_service_1.DirectMessageService])
], DirectMessageModule);
//# sourceMappingURL=direct_message.module.js.map