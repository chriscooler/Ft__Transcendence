import { DirectMessage } from './direct_message.entity';
import { UserEntity } from 'src/users/orm/user.entity';
export declare class DirectMessageRoom {
    id: number;
    updatedAt: Date;
    userOne: UserEntity;
    userTwo: UserEntity;
    messages: DirectMessage[];
}
