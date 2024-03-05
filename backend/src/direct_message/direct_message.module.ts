import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectMessage } from './direct_message.entity';
import { DirectMessageService } from './direct_message.service';
import { DirectMessageRoom } from './direct_message_room.entity';
import { UserModule } from 'src/users/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([DirectMessage, DirectMessageRoom]), UserModule],
	providers: [DirectMessageService],
	exports: [DirectMessageService]
})
export class DirectMessageModule {
	constructor(private readonly dmService: DirectMessageService) { }

}