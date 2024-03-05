import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/orm/user.entity';
import { GameEntity } from 'src/users/orm/game.entity';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt/jwt.service';
import { DirectMessageService } from 'src/direct_message/direct_message.service';
import { ChatService } from 'src/chat/chat.service';
import { ChatRoomMember } from 'src/chat/chat_room_member.entity';
import { ChatRoom } from 'src/chat/chat_room.entity';
import { ChatMessage } from 'src/chat/chat_message.entity';
import { DirectMessage } from 'src/direct_message/direct_message.entity';
import { DirectMessageRoom } from 'src/direct_message/direct_message_room.entity';

@Module({

  imports: [
    ConfigModule,
    UserModule,
    HttpModule,
    TypeOrmModule.forFeature([UserEntity, GameEntity, ChatRoomMember, ChatRoom, ChatMessage, DirectMessage, DirectMessageRoom]),

    JwtModule.register({
      global: true,
      secret: process.env.JWTSECRET,
      signOptions: { expiresIn: '8h' },
      // signOptions: { expiresIn: '1m' },
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, UserService, JwtAuthService, DirectMessageService, ChatService],

  exports: [UserService, HttpModule, UserModule, AuthService, JwtAuthService],

})
export class AuthModule { }