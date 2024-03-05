"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const game_service_1 = require("./game.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("../users/user.module");
const user_service_1 = require("../users/user.service");
const user_entity_1 = require("../users/orm/user.entity");
const game_entity_1 = require("../users/orm/game.entity");
let GameModule = class GameModule {
};
exports.GameModule = GameModule;
exports.GameModule = GameModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, game_entity_1.GameEntity]),
        ],
        providers: [user_service_1.UserService, game_service_1.GameService,],
        exports: [user_module_1.UserModule],
    })
], GameModule);
//# sourceMappingURL=game.module.js.map