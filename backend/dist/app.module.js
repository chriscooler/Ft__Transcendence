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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const app_controller_1 = require("./app.controller");
const user_module_1 = require("./users/user.module");
const auth_module_1 = require("./auth/auth.module");
const game_module_1 = require("./game/game.module");
const direct_message_module_1 = require("./direct_message/direct_message.module");
const events_module_1 = require("./events/events.module");
const user_service_1 = require("./users/user.service");
const user_entity_1 = require("./users/orm/user.entity");
const game_entity_1 = require("./users/orm/game.entity");
let AppModule = class AppModule {
    constructor(appService) {
        this.appService = appService;
    }
    onModuleInit() {
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: parseInt(process.env.POSTGRES_PORT),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
                entities: [user_entity_1.UserEntity, game_entity_1.GameEntity, __dirname + '/**/*.entity{.ts,.js}'],
                autoLoadEntities: true,
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, game_entity_1.GameEntity]),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            game_module_1.GameModule,
            direct_message_module_1.DirectMessageModule,
            events_module_1.EventsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, user_service_1.UserService],
    }),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppModule);
//# sourceMappingURL=app.module.js.map