import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';
import { UserEntity } from 'src/users/orm/user.entity';
import { GameEntity } from 'src/users/orm/game.entity';

@Module({

	imports: [UserModule,
		TypeOrmModule.forFeature([UserEntity, GameEntity]),
	],

	providers: [UserService, GameService,],

	exports: [UserModule],

})
export class GameModule { }
