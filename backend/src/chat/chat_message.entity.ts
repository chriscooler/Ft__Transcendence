import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	Column,
} from 'typeorm';
import { UserEntity } from '../users/orm/user.entity';
import { ChatRoom } from './chat_room.entity';

@Entity('chat_message')
export class ChatMessage {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	@Column()
	content: string;

	@Column()
	senderId: number;

	@Column()
	senderLogin: string;

	@Column()
	roomId: string;

	@ManyToOne(() => UserEntity, user => user.messages)

	sender: UserEntity;

	@ManyToOne(() => ChatRoom, (room) => room.messages, { cascade: true, onDelete: 'CASCADE' })

	room: ChatRoom;
}