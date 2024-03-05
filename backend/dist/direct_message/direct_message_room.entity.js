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
exports.DirectMessageRoom = void 0;
const typeorm_1 = require("typeorm");
const direct_message_entity_1 = require("./direct_message.entity");
const user_entity_1 = require("../users/orm/user.entity");
let DirectMessageRoom = class DirectMessageRoom {
};
exports.DirectMessageRoom = DirectMessageRoom;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DirectMessageRoom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DirectMessageRoom.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.UserEntity)
], DirectMessageRoom.prototype, "userOne", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.UserEntity)
], DirectMessageRoom.prototype, "userTwo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => direct_message_entity_1.DirectMessage, (message) => message.room, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], DirectMessageRoom.prototype, "messages", void 0);
exports.DirectMessageRoom = DirectMessageRoom = __decorate([
    (0, typeorm_1.Entity)('direct_message_room')
], DirectMessageRoom);
//# sourceMappingURL=direct_message_room.entity.js.map