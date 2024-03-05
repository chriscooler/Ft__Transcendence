import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as express from 'express';
config();
import { Server } from 'colyseus';
import { PongRoom } from './game/game.room';
import { privateRoom } from './game/game.privateroom';
// import { IoAdapter } from '@nestjs/platform-socket.io';
// import { NestFactory, HttpAdapterHost } from '@nestjs/core';


async function gameServer() {
  const gameServer = new Server();
  gameServer.listen(3001);
  gameServer.define("pong", PongRoom);
  gameServer.define("privateRoom", privateRoom);
}



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const host = process.env.HOST;
  app.use(express.json());
  app.enableCors({
    origin: `http://${host}:5173`,
    // methods: 'GET,POST',
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