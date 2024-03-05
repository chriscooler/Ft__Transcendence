import {
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Column,
	OneToMany
} from 'typeorm';

import { ChatRoom } from './chat_room.entity'
import { ChatMessage } from './chat_message.entity';
import { UserEntity } from 'src/users/orm/user.entity';



@Entity()
export class ChatRoomMember {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.members, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	chatRoom: ChatRoom;
	

	@ManyToOne(() => UserEntity, user => user.chatRoomMembers)
	user: UserEntity;
	

	@Column()
	role: string; // 'Owner', 'Admin', 'Participant'

	@Column({ default: false })
	isBanned: boolean;

	@Column({ default: false })
	isKicked: boolean;

	@Column({ default: false })
	isMuted: boolean

	@OneToMany(() => ChatMessage, (message) => message.sender)
	messages: ChatMessage[]



	
	@Column({ type: 'timestamp', nullable: true })
	kickedTime: Date; // Timestamp when kicked

	@Column({ type: 'int', nullable: true })
	kickDuration: number; // Duration of kick in minutes

	@Column({ type: 'timestamp', nullable: true })
	mutedTime: Date; // Timestamp when muted

	@Column({ type: 'int', nullable: true })
	mutedDuration: number; // Duration of mute in minutes


}