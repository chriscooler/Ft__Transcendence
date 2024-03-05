"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv_1 = require("dotenv");
const express = require("express");
(0, dotenv_1.config)();
const colyseus_1 = require("colyseus");
const game_room_1 = require("./game/game.room");
const game_privateroom_1 = require("./game/game.privateroom");
async function gameServer() {
    const gameServer = new colyseus_1.Server();
    gameServer.listen(3001);
    gameServer.define("pong", game_room_1.PongRoom);
    gameServer.define("privateRoom", game_privateroom_1.privateRoom);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const host = process.env.HOST;
    app.use(express.json());
    app.enableCors({
        origin: `http://${host}:5173`,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: 'Content-Type, Authorization, Accept',
    });
    await app.listen(3000);
    console.log(`Backend is running on port 3000.`);
    console.log(`io.listen(3002).`);
}
bootstrap();
gameServer();
//# sourceMappingURL=main.js.map