import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectMessage } from './direct_message.entity';
import { DirectMessageRoom } from './direct_message_room.entity';
import { UserService } from 'src/users/user.service';

interface EnhancedDirectMessageRoom extends DirectMessageRoom {
	userOneDetails: { userName: string; avatar: string; };
	userTwoDetails: { userName: string; avatar: string; };
}


@Injectable()
export class DirectMessageService {
	constructor(
		@InjectRepository(DirectMessage)
		private readonly dmRepository: Repository<DirectMessage>,
		@InjectRepository(DirectMessageRoom)
		private readonly roomRepository: Repository<DirectMessageRoom>,
		private readonly userService: UserService
	) { }

	async sendMessage(sender: number, receiver: number, messageText: string): Promise<DirectMessage> {
		try{
		const userSender = await this.userService.find_user_by_id(sender);
		const userReceiver = await this.userService.find_user_by_id(receiver);

		let room = await this.roomRepository.createQueryBuilder("room")
			.leftJoinAndSelect("room.userOne", "userOne")
			.leftJoinAndSelect("room.userTwo", "userTwo")
			.where("userOne.id = :senderId AND userTwo.id = :receiverId", { senderId: userSender.id, receiverId: userReceiver.id })
			.orWhere("userOne.id = :receiverId AND userTwo.id = :senderId", { senderId: userSender.id, receiverId: userReceiver.id })
			.getOne();
		if (!room) {
			room = new DirectMessageRoom();
			room.userOne = userSender;
			room.userTwo = userReceiver;
			await this.roomRepository.save(room);
		}

		const message = new DirectMessage();
		message.room = room;
		message.roomId = room.id
		message.sendBy = sender;
		message.sendTo = receiver;
		message.message = messageText;
		message.senderLogin = userSender.userName;
		message.recieverLogin = userReceiver.userName;

		const mes = await this.dmRepository.save(message);

		return mes;
	} catch (e) { }
	}

	async findAllRoomsForUser(userId: number): Promise<EnhancedDirectMessageRoom[]> {
		try{
		const rooms = await this.roomRepository.createQueryBuilder("room")
			.leftJoinAndSelect("room.userOne", "userOne")
			.leftJoinAndSelect("room.userTwo", "userTwo")
			.where("userOne.id = :userId", { userId })
			.orWhere("userTwo.id = :userId", { userId })
			.getMany();

		const enhancedRooms: EnhancedDirectMessageRoom[] = rooms.map(room => ({
			...room,
			userOneDetails: {
				userName: room.userOne.userName,
				avatar: room.userOne.avatar,
			},
			userTwoDetails: {
				userName: room.userTwo.userName,
				avatar: room.userTwo.avatar,
			},
		}));

		return enhancedRooms;
	} catch (e) { }
	}

	async findAllMessagesForRoom(roomId: number): Promise<DirectMessage[]> {
		try {
		const messages = await this.dmRepository.find({
			where: { roomId: roomId },
			order: { date: 'ASC' } // Order by date in ascending order, you can also use 'DESC' for descending
		});
		return messages;
	} catch (e) { }

	}

	async clearDatabase() {
		try{
		await this.roomRepository.clear()
		await this.dmRepository.clear()
	} catch (e) { }
	}
}