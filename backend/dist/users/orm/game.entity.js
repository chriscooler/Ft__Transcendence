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
exports.GameEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let GameEntity = class GameEntity {
};
exports.GameEntity = GameEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GameEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => user_entity_1.UserEntity, user => user.gamesAsPlayer1),
    __metadata("design:type", user_entity_1.UserEntity)
], GameEntity.prototype, "player1", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => user_entity_1.UserEntity, user => user.gamesAsPlayer2),
    __metadata("design:type", user_entity_1.UserEntity)
], GameEntity.prototype, "player2", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GameEntity.prototype, "player1Score", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GameEntity.prototype, "player2Score", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GameEntity.prototype, "date", void 0);
exports.GameEntity = GameEntity = __decorate([
    (0, typeorm_1.Entity)()
], GameEntity);
//# sourceMappingURL=game.entity.js.map