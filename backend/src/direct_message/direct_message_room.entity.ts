import {
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

import { DirectMessage } from './direct_message.entity';
import { UserEntity } from 'src/users/orm/user.entity';


@Entity('direct_message_room')
export class DirectMessageRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    userOne: UserEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    userTwo: UserEntity;


    @OneToMany(() => DirectMessage, (message) => message.room, {
        cascade: true,
    })
    messages: DirectMessage[];

}