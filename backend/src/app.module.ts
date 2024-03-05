import { Module, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { DirectMessageModule } from './direct_message/direct_message.module';
import { EventsModule } from './events/events.module';
import { UserService } from './users/user.service';
import { UserEntity } from './users/orm/user.entity';
import { GameEntity } from './users/orm/game.entity';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: 'localhost',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [UserEntity, GameEntity, __dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),

    TypeOrmModule.forFeature([UserEntity, GameEntity]),
    UserModule,
    AuthModule,
    GameModule,
    DirectMessageModule,
    EventsModule,
    // ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly appService: AppService) { }

  onModuleInit() {
    // Code à exécuter au démarrage du module
  }
}






// // * * *  -[ CORS PB ]-  * * * 
// import { CorsModule } from '@nestjs/cors';
// import { ChatModule } from './chat/chat.module';

// @Module({
//   imports: [
//     // Autres modules importés
//     CorsModule.forRoot({
//       origin: '*', // Remplace * par l'URL spécifique de ton frontend en production
//       methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//       allowedHeaders: 'Content-Type,Authorization', // Ajoute 'Authorization' ici
//     }),
//   ],