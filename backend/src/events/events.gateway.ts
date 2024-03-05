import { Injectable, BadRequestException } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { DirectMessageService } from 'src/direct_message/direct_message.service';
import { ChatService } from 'src/chat/chat.service';
import { UserService } from 'src/users/user.service';
import { UserEntity } from 'src/users/orm/user.entity';
import { ChatRoom } from 'src/chat/chat_room.entity';
import * as bcrypt from 'bcryptjs';
import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WsException,
} from '@nestjs/websockets';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
@WebSocketGateway(
	3002,
	{
		cors: {
			origin: `http://${process.env.HOST}:5173`,
			methods: ['GET', 'POST'],
			credentials: true
		}
	}
)
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	constructor(
		private userService: UserService,
		private directMessageService: DirectMessageService,
		private chatService: ChatService
	) { }

	private socketsByUserID: Map<any, Socket> = new Map(); // id42_>id -> socket
	private userIdFindHelper: Map<string, any> = new Map(); // socket id -> id42_>id
	private idByClientIdMap: Map<string, number> = new Map(); // <client.id, user.id>
	private onlineUsersMap: Map<number, UserEntity> = new Map();

	afterInit(server: Server) {
		// console.log(' -[ EventsGateway ]- *initialized* afterInit( server io )')
	}

	async handleConnection(client: Socket) {
		try {
			const connected = this.socketsByUserID.get(client.handshake.query.id); // check if user already connected
			if (connected) {
				// console.log(" -[ Handle Connection ]- Deja connected, -> deconnection");
				this.socketsByUserID.delete(connected.id); // remove old connection from helper map
				connected.disconnect(); // disconnect old connection
			}
			this.socketsByUserID.set(client.handshake.query.id, client);
			// console.log('-[ EventsGateway ]- client.handshake.query.id: ', client.handshake.query.id);
			this.userIdFindHelper.set(client.id, client.handshake.query.id);
			const id: number = parseInt(client.handshake.query.id[0], 10);
			this.idByClientIdMap.set(client.id, id);
			// console.log(' -[ EventsGateway ]- client connected :  { ', client.id, ' }');

			if (!this.onlineUsersMap.has(id)) {
				const user = await this.userService.find_user_by_id(id)
				this.onlineUsersMap.set(id, user);
				// Get l'ensemble des onLineUsers et creer la List
				const usersDatas: any[] = [];
				for (const [id, user] of this.onlineUsersMap) {
					const usr = await this.userService.find_user_by_id(user.id);
					usersDatas.push({ id: usr.id, login: usr.login, username: usr.userName, avatar: usr.avatar });
				}
				this.server.emit('onlineUsersUpdate', usersDatas);
				// console.log(' -[ Events - (Connection) - emit ]- usersDatas', usersDatas);
			}
		} catch (e) { }
	}

	async handleDisconnect(client: Socket) {
		try {
			this.socketsByUserID.delete(this.userIdFindHelper.get(client.id));
			this.userIdFindHelper.delete(client.id);

			const id: number = this.idByClientIdMap.get(client.id);
			this.idByClientIdMap.delete(client.id);
			this.onlineUsersMap.delete(id);
			// console.log(' -[ EventsGateway ]- client disconnected : { ', client.id, ' }')
			const usersDatas: any[] = [];
			for (const [id, user] of this.onlineUsersMap) {
				const usr = await this.userService.find_user_by_id(user.id);
				usersDatas.push({ id: usr.id, login: usr.login, username: usr.userName, avatar: usr.avatar });
			}
			this.server.emit('onlineUsersUpdate', usersDatas);
			// console.log(' -[ Events - (Disconnect) - emit ]- usersDatas', usersDatas);
		} catch (e) { }
	}

	@SubscribeMessage('getOnlineUsersDatas')
	async sendOnlineUsersDatas(client: Socket) {
		// console.log(' -[ EventsGateway ]- getOnlineUsersDatas');
		try {
			const usersDatas: any[] = [];
			for (const [id, user] of this.onlineUsersMap) {
				const usr = await this.userService.find_user_by_id(user.id);
				usersDatas.push({ id: usr.id, login: usr.login, username: usr.userName, avatar: usr.avatar });
				// usersDatas.push({ id: user.id, login: user.login, username: user.userName, avatar: user.avatar });
			}
			client.emit('onlineUsersDatas', usersDatas);
		} catch (e) { }
	}

	// // // // // // // // // // // // // // // // // // // // // // 
	// // // // // // // [  Profile  ] // // // // // // // // // // 
	@SubscribeMessage('changeUsername')
	async changeUsername(client: Socket) {
		try {
			const usersDatas: any[] = [];
			for (const [id, user] of this.onlineUsersMap) {
				const usr = await this.userService.find_user_by_id(user.id);
				usersDatas.push({ id: usr.id, login: usr.login, username: usr.userName, avatar: usr.avatar });
			}
			this.server.emit('onlineUsersUpdate', usersDatas);
		} catch (e) { }
	}

	@SubscribeMessage('resetAvatar')
	async resetAvatar(client: Socket, data: any) {
		try {
			// console.log('-[ EventsGt ]- resetAvatar data:  ', data)
			const user = await this.userService.find_user_by_login(data.login);
			await this.userService.reset_avatar(user.id);
			const userUpdate = await this.userService.find_user_by_login(data.login);
			client.emit('updateAvatar', { avatar: userUpdate.avatar });
		} catch (e) { }
	}

	// // // // // // // // // // // // // // // // // // // // // // //
	// // // // // // //  [   Friends  ]  // // // // // // // // // // 
	@SubscribeMessage('SendFriendRequest')
	async sendFriendRequest(client: Socket, data: any) {
		try {
			const moi: UserEntity = await this.userService.find_user_by_id(data.myId)
			await this.userService.sendFriendRequest(moi.login, data.otherLogin);

			// console.log('-[ *Events* Send friend request]- datas : ', data);
			const friend: UserEntity = await this.userService.find_user_by_login(data.otherLogin);
			const friendnewPendingList: any[] = await this.userService.getPendingList(friend.id);
			let friendClient = this.socketsByUserID.get(friend.id.toString());
			// console.log('-[ *Events* Send friend request]- ', data.otherLogin, '  newPendingList : ', friendnewPendingList);
			friendClient.emit('pendingListUpdate', friendnewPendingList);

			const myNewRequestedList: any[] = await this.userService.getSentRequestsList(data.myId)
			// console.log('-[ *Events* Send friend request]- MyRequestList : ', myNewRequestedList);
			client.emit('sentRequestsListUpdate', myNewRequestedList);
		} catch (e) { }
	}

	@SubscribeMessage('acceptOrRefuseFriendRequest')
	async acceptFriendRequest(client: Socket, data: any) {
		try {
			// console.log(' -[ EventsGateway ]- acceptRefuseFriend - data : ', data);
			const mynewPendingList: any[] = await this.userService.getPendingList(data.myId)
			client.emit('pendingListUpdate', mynewPendingList)

			const friend = await this.userService.find_user_by_id(data.idToAccept);
			const friendNewRequestList: any[] = await this.userService.getSentRequestsList(friend.id);
			let friendClient = this.socketsByUserID.get(friend.id.toString());
			friendClient.emit('sentRequestsListUpdate', friendNewRequestList);
		} catch (e) { }
	}

	@SubscribeMessage('updateFriendList')
	async updateFriendList(client: Socket, data: any) {
		try {
			// console.log(' -[ EventsGateway ]- acceptFriend');
			const friend: UserEntity = await this.userService.find_user_by_id(data.idToAccept);
			const friendnewFriendList: any[] = await this.userService.getFriendsList(friend.id);
			let friendClient: any = this.socketsByUserID.get(friend.id.toString());
			friendClient.emit('friendListUpdate', friendnewFriendList);

			const myNewFriendList: any[] = await this.userService.getFriendsList(data.myId);
			client.emit('friendListUpdate', myNewFriendList);
		} catch (e) { }
	}
	// // // // // // // // // // // // // // // // // // // // // // //
	// // // // // // //  [   Game Stats  ]  // // // // // // // // //
	@SubscribeMessage('getLeaderBoard')
	async getLeaderBoard(client: Socket) {
		try {
			const leaderBoard: any[] = await this.userService.getLeaderBoard();
			this.server.emit('updateLeaderBoard', leaderBoard)
		} catch (e) { }
	}

	@SubscribeMessage('getOtherGameHistory')
	async getOtherGameHstory(client: Socket, data: any) {
		try {
			const user = await this.userService.find_user_by_id(data.otherId);
			const gameHistoryData = await this.userService.getMatchHistory(user);
			client.emit('otherGameHistory', gameHistoryData)
		} catch (e) { }
	}

	@SubscribeMessage('inGameUpdate')
	async enterGame(client: Socket, data: any) {
		try {
			const inGameUsersList: any[] = await this.userService.getInGameUsers();
			this.server.emit('inGameFriendUpdate', inGameUsersList)
		} catch (e) { }
	}

	// // // // // // // // // // // // // // // // // // // // // // //
	// // // // // // //  [  Game Invitation  ] // // // // // // // //
	@SubscribeMessage('sendGameInvitation')
	async sendGameInvitation(client: Socket, data: any) {
		try {
			// console.log(' -[ EventsGateway ]- *sendGameInvitation* data: ', data)
			let wsClient: any = this.socketsByUserID.get(data.idToInvite.toString()); // Find le wsServerId du client pour lui emit l'invitation
			// console.log(' -[ EventsGateway ]- *wsClient* : ', wsClient)

			wsClient.emit('receivedGameInvitation', data);
		} catch (e) { }
	}

	@SubscribeMessage('refuseGameInvitation')
	async refuseGameInvitation(client: Socket, data: any) {
		try {
			// console.log(' -[ EventsGateway ]- *refuse Invitation* data: ', data)
			// console.log(' -[ EventsGateway ]- data.id.toString(): ', data.id.toString())
			let wsClient: any = this.socketsByUserID.get(data.id.toString()); // Find le wsServerId du [ client 1 ] pour lui emit le refus et le faire quitter la room !
			// console.log(' -[ EventsGateway ]- wsClient: ', wsClient)
			wsClient.emit("refuseCloseGame", data);
		} catch (e) { }

	}

	@SubscribeMessage('cancelInvitation')
	invitationUpdate(client: Socket, data: any) {
		try {
			// console.log(' -[ Events cancelInvitation ]- data: ', data);
			let friendClient: any = this.socketsByUserID.get(data.idToInvite.toString());
			friendClient.emit('updateInvitation');
		} catch (e) { }

	}
	// // // // // // // // // // // // // // // // // // // // // // //


	// // // // // // // // // // // // // // // // // // // // // // //
	// // // // // // //  [  C H A T  -  D M  ] // // // // // // // //
	// // // // // // // // // // // //  // // // // // // // // // //

	// // // // // // // // // // // // // // // // // // // // // // //
	// // // // // // // //  [  D  M  ]   // // // // // // // // // //	
	@SubscribeMessage('getDmRooms')
	async getDmRooms(client: Socket) {
		try {
			let str = this.userIdFindHelper.get(client.id);
			let num = +str;
			let a = await this.directMessageService.findAllRoomsForUser(num)
			// console.log(a)
			client.emit('repDmRooms', {
				rooms: a
			})
		} catch (e) { }
	}


	@SubscribeMessage('getMessagesInDmRoom')
	async getDmRoomMessages(client: Socket, roomId: any) {
		try {
			let a = await this.directMessageService.findAllMessagesForRoom(roomId)
			// console.log('AAAAAAAAAAAAAAA', a)
			client.emit('repMessagesInDmRooms', {
				messages: a
			})
		} catch (e) { }
	}

	@SubscribeMessage('sendMessage')
	async sendMessage(client: Socket, data: any) {
		try {
			// Check if data is present and has the required properties
			if (!data || typeof data.sendBy === 'undefined' || typeof data.sendTo === 'undefined') {
				console.error('Missing data in sendMessage:', data);
				return;
			}

			// Log the received data for debugging
			// console.log('Data received in sendMessage:', data);


			let a = await this.directMessageService.sendMessage(data.sendBy, data.sendTo, data.message)
			// console.log('a', a)
			const userOne = this.socketsByUserID.get(data.sendBy.toString());
			const userTwo = this.socketsByUserID.get(data.sendTo.toString());
			if (userOne) {
				userOne.emit('newMessagedm', {
					messages: a
				})
			}
			if (userTwo) {
				userTwo.emit('newMessagedm', {
					messages: a,
					alert: true
				})
			}
		} catch (e) { }
	}



	@SubscribeMessage('sendMessageN')
	async sendMessageN(client: Socket, data: any) {
		try {
			//console.log("----------here------------------")

			//console.log("------------data-------------", data.sendTo)
			const sendTo = await this.userService.find_user_by_login(data.sendTo);

			data.sendTo = sendTo.id;
			let a = await this.directMessageService.sendMessage(data.sendBy, data.sendTo, data.message)
			//console.log('a', a)
			const userOne = this.socketsByUserID.get(data.sendBy.toString());
			const userTwo = this.socketsByUserID.get(data.sendTo.toString());
			if (userOne) {
				userOne.emit('newMessagedm', {
					messages: a
				})
			}
			if (userTwo) {
				userTwo.emit('newMessagedm', {
					messages: a
				})
			}
		} catch (e) { }
	}
	//----------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------------
	//--------------------CHAT---------------------------------------------------------------
	@SubscribeMessage('getChatRooms')
	async getChatRooms(client: Socket) {
		try {
			//console.log('test', client.id, this.userIdFindHelper.get(client.id))
			let str = this.userIdFindHelper.get(client.id);
			let num = +str;
			let a = await this.chatService.listAllRooms()
			client.join('1')
			//console.log('a------------------', a[0])
			this.server.to('1').emit('repChatRooms', {
				rooms: a
			})
		} catch (e) { }
	}

	@SubscribeMessage('sendChatRooms')
	async sendChatRooms(client: Socket, data: any) {
		try {
			const tittle = data.title;
			const user = data.usere;
			const title = data.title;
			const isPrivate = data.isPrivate;
			let password = data.password; // Moved outside of destructuring to handle encryption            const userId = data.userId;
			const userId = data.IdduUser;
			let hashedPassword; // To store the hashed password
			// console.log("USERRRRR", data)
			// console.log("TiTLE", tittle)

			// Check if room with the given name exists
			const roomExists = await this.chatService.doesRoomExist(tittle);

			if (roomExists) {
				client.emit("roomCreationError", { error: "Room with this name already exists" });
				return;
			}
			const userOne = this.socketsByUserID.get(this.userIdFindHelper.get(client.id));
			// Encrypt the password if the room is private
			if (isPrivate && password) {
				const saltRounds = 10; // or another number of rounds
				hashedPassword = await bcrypt.hash(password, saltRounds);
			}

			const channel = await this.chatService.createChatRoom({
				title,
				isPrivate,
				hashedPassword,
				userId,
				user
			});

			client.join(channel.id);
			this.server.to('1').emit("chatRoomCreated", { success: true, channel });
		} catch (e) { }
	}


	@SubscribeMessage('getMessagesInChatRoom')
	async getMessagesInChatRoom(client: Socket, id: any) {
		try {
			let str = this.userIdFindHelper.get(client.id);
			// console.log('str-----------------', str)
			let user = await this.userService.find_user_by_id(str);
			const roomMembers = await this.chatService.findMembersByRoomId(id);

			if (await this.chatService.eligibleMember(str, id)) {
				let messages = await this.chatService.listMessages(id);
				// console.log('Extracted contents:', messages);
				const blockedMembersLogins = roomMembers.filter(member =>
					member.user.blockedUser && member.user.blockedUser.includes(user.login)
				).map(member => member.user.login);
				const blockedByMembersLogins = roomMembers.filter(member =>
					member.user.blockedBy && member.user.blockedBy.includes(user.login)
				).map(member => member.user.login);
				//  console.log('blockeeeeeeeeeeeeee',blockedByMembersLogins,blockedMembersLogins)
				client.emit('repMessagesInChatRoom', {
					messages: messages,
					blockedMembers: blockedMembersLogins, // logins of members who have blocked the sender
					blockedByMembers: blockedByMembersLogins
				});
			}
		} catch (error) {
			// console.error("Error fetching messages:", error);
		}
	}


	@SubscribeMessage('sendMessageChannel')
	async sendMessageChannel(client: Socket, payload: { message: string, sendBy: UserEntity, sendBylogin: string, sendTo: string }) {
		try {
			// console.log('Received payload:', payload);

			// Extract variables from payload
			const { message, sendBy, sendBylogin, sendTo } = payload;

			// Retrieve members in the chat room
			const roomMembers = await this.chatService.findMembersByRoomId(sendTo);

			// Identify members who have blocked the sender
			const blockedMembersLogins = roomMembers.filter(member =>
				member.user.blockedUser && member.user.blockedUser.includes(sendBylogin)
			).map(member => member.user.login);
			const blockedByMembersLogins = roomMembers.filter(member =>
				member.user.blockedBy && member.user.blockedBy.includes(sendBylogin)
			).map(member => member.user.login);
			if (this.chatService.eligibleMember(sendBy.id, sendTo)) {

				// Send the message and save it
				const savedMessage = await this.chatService.sendMessage(message, sendBy, sendBylogin, sendTo);
				//console.log('Saved message:', savedMessage);

				// Emit the saved message to the entire room with the list of blocked members
				this.server.to(sendTo).emit('newMessage', {
					savedMessage: savedMessage,  // saved message
					blockedMembers: blockedMembersLogins, // logins of members who have blocked the sender
					blockedByMembers: blockedByMembersLogins
				});
			}
		} catch (error) {
			// console.error('Error sending message:', error);
			client.emit('messageSendError', { message: error.message });
		}
	}



	@SubscribeMessage('joinChatRoom')
	async joinChatRoom(client: Socket, payload: { user: UserEntity, room: ChatRoom, role: string }) {
		// console.log("Received joinChatRoom payload:", payload);
		try {
			const { user, room, role } = payload;
			// console.log('**********************', user)
			const newMember = await this.chatService.joinChatRoom(user, room, role);

			// console.log('newmember*-*---------------------', newMember)
			if (this.chatService.eligibleMember(payload.user.id, payload.room.id)) {
				client.join(payload.room.id);
			}
			if (newMember) {
				this.server.to(payload.room.id).emit('joinedChatRoom', { success: true, room: newMember.chatRoom, user: newMember.user, role: newMember.role });
			}
		} catch (error) {
			client.emit('joinedChatRoomError', { success: false, error: error.message });
		}
	}

	@SubscribeMessage('roomIdChatRoom')
	async getRoomIdChatRoom(client: Socket, roomTitle: string) {
		try {
			let a = await this.chatService.findRoomIdByTitle(roomTitle)
			// console.log('a-----------------', a)
			client.emit('repRoomIdChatRoom', {
				id: a,
			})
		} catch (e) { }
	}


	@SubscribeMessage('getsMembersInRoom')
	async handleGetsMembersInRoom(client: Socket, roomId: string): Promise<void> {
		try {

			const members = await this.chatService.findMembersByRoomId(roomId);
			///-------------------------------
			const memberLogins = members.map(member => ({ user: member.user, role: member.role }));


			///------------------------------

			// console.log("-----------------", members)
			client.emit('membersList', {
				members: memberLogins,
			});
		}
		catch (error) {
			client.emit('membersListError', { message: error.message });
		}
	}
	//////////////////////////////////-----------------------------------------------------
	@SubscribeMessage('muteUser')
	async handleMuteUser(client: Socket, payload: { user: UserEntity, roomId: string, login: string, duration: number }) {
		try {
			const { user, roomId, login, duration } = payload;

			// ... rest of the existing code
			const userToMute = await this.userService.find_user_by_login(login);

			//------------------------------------------------OFFLINE ADDING
			const members = await this.chatService.findMembersByRoomId(roomId);
			const isOwner = members.some(member => (member.role === 'Owner' || member.role === 'Admin') && member.user.id === user.id);
			if (!isOwner) {
				throw new BadRequestException('Only the room owner or admins can mute users');
			} else {
				const member = await this.chatService.findMemberInChatRoom(userToMute.id, roomId);
				member.isMuted = true;

				// Store the time of kick to calculate the duration in the frontend.
				member.mutedTime = new Date();
				member.mutedDuration = duration;

				await this.chatService.updateMember(member);    // userToKick we update in member entity
				//-------------------------------------------------------------------------------
				// Notify the user to be kicked with the duration
				const userSocket = this.socketsByUserID.get(userToMute.id.toString());
				if (userSocket) {
					userSocket.emit('mutedFromRoom', { roomId, duration });
					// userSocket.leave(roomId); // Optional: if you want to force them out of the Socket.IO room.
				}
			}

		} catch (error) {
			client.emit('muteError', { message: error.message });
		}
	}
	///////////////////////////////////-------------------------------------------------------
	@SubscribeMessage('kickUser')
	async handleKickUser(client: Socket, payload: { user: UserEntity, roomId: string, login: string, duration: number }) {
		try {
			const { user, roomId, login, duration } = payload;

			// ... rest of the existing code
			const userToKick = await this.userService.find_user_by_login(login);
			const room = await this.chatService.findChatRoom(roomId);
			if (!room) {
				throw new BadRequestException('Room not found');
			}
			//------------------------------------------------OFFLINE ADDING
			const members = await this.chatService.findMembersByRoomId(roomId);
			// const isOwner = members.some(member => member.role === 'Owner' || 'Admin' && member.user.id === user.id);
			const isOwner = members.some(member => (member.role === 'Owner' || member.role === 'Admin') && member.user.id === user.id);
			if (!isOwner) {
				throw new BadRequestException('Only the room owner or admins can kick users');
			}
			else {
				const member = await this.chatService.findMemberInChatRoom(userToKick.id, roomId);
				member.isKicked = true;

				// Store the time of kick to calculate the duration in the frontend.
				member.kickedTime = new Date();
				member.kickDuration = duration;

				await this.chatService.updateMember(member);    // userToKick we update in member entity
				//-------------------------------------------------------------------------------
				// Notify the user to be kicked with the duration
				const userSocket = this.socketsByUserID.get(userToKick.id.toString());
				if (userSocket) {
					userSocket.emit('kickedFromRoom', { roomId, duration });
					// userSocket.leave(roomId); // Optional: if you want to force them out of the Socket.IO room.
				}
			}

		} catch (error) {
			client.emit('kickError', { message: error.message });
		}
	}

	@SubscribeMessage('banUser')
	async handleBanUser(client: Socket, payload: { user: UserEntity, roomId: string, login: string }) {
		try {
			const { user, roomId, login } = payload;
			const userToBan = await this.userService.find_user_by_login(login)
			const userIdToBan = userToBan.id
			// Check if the user issuing the ban command is the owner
			const room = await this.chatService.findChatRoom(roomId);
			if (!room) {
				throw new BadRequestException('Room not found');
			}

			// Find members of the room
			const members = await this.chatService.findMembersByRoomId(roomId);
			// console.log('members----------', members)

			// Check if the client is the owner
			// console.log('ownerID----------', ownerId)
			const isOwner = members.some(member => (member.role === 'Owner' || member.role === 'Admin') && member.user.id === user.id);
			// console.log('isowner----------', isOwner)

			if (!isOwner) {
				throw new BadRequestException('Only the room owner or admins can ban users');
			}
			// Add ban logic here. This could be saving the ban to a database, or an in-memory list.
			// For simplicity, let's say you have a banService (you'd need to create this) which can add bans:
			// await this.banService.banUserFromRoom(userIdToBan, roomId);
			if (!room.bannedUsers) {
				room.bannedUsers = [];
			}
			room.bannedUsers.push(userToBan);
			const roome = await this.chatService.updateRoome(room);  // Make sure you have an updateRoom method in your chatService
			//------------------------------------------------OFFLINE ADDING
			// console.log('m yroom neew version', roome)
			const member = await this.chatService.findMemberInChatRoom(userToBan.id, roomId);
			member.isBanned = true;
			await this.chatService.updateMember(member);
			// Notify the banned user
			const userSocket = this.socketsByUserID.get(userIdToBan.toString());
			if (userSocket) {
				userSocket.emit('bannedFromRoom', { roomId });
				userSocket.leave(roomId); // Optional: if you want to force them out of the Socket.IO room.
			}
		}
		catch (error) {
			client.emit('banError', { message: error.message });
		}
	}

	@SubscribeMessage('checkUserBan')
	async handleCheckUserBan(client: Socket, payload: { userId: number, roomId: string }) {
		try {
			const { userId, roomId } = payload;
			const isBanned = await this.chatService.isUserBanned(userId, roomId);
			// console.log('isBanned:', isBanned);

			// Respond back to the client with the ban status
			client.emit('userBanStatus', { isBanned });
		} catch (error) {
			client.emit('banCheckError', { message: error.message });
		}
	}
	@SubscribeMessage('CheckUserStatus')
	async handleCheckUserStatus(client: Socket, payload: { userId: number, roomId: string }) {
		try {
			const { userId, roomId } = payload;

			// Get the user's ban status
			const isBanned = await this.chatService.isUserBanned(userId, roomId);

			// Get the user's kick/mute status
			const member = await this.chatService.findMemberInChatRoom(userId, roomId);
			const kickEndTime = member.kickedTime ? member.kickedTime.getTime() + member.kickDuration * 60 * 1000 : 0;
			const muteEndTime = member.mutedTime ? member.mutedTime.getTime() + member.mutedDuration * 60 * 1000 : 0;
			// console.log("-member-", member)
			// console.log('kickandmutetimes', kickEndTime, muteEndTime)
			// Respond back to the client with the combined status
			client.emit('userStatus', { isBanned, kickEndTimes: { [roomId]: kickEndTime }, muteEndTimes: { [roomId]: muteEndTime } });
		} catch (error) {
			client.emit('statusCheckError', { message: error.message });
		}
	}

	//------------------------------OFFLINE ADDINGS----------------------------===============
	@SubscribeMessage('leaveChatRoom')
	async leaveChatRoom(client: Socket, payload: { user: UserEntity, room: ChatRoom }) {
		// console.log("Received leaveChatRoom payload:", payload);
		try {
			const { user, room } = payload;

			// Assuming you have a leaveChatRoom method in chatService
			// which will remove the user from the room's members in the database.
			await this.chatService.leaveeChatRoom(user, room);

			const memberes = await this.chatService.findMembersByRoomId(room.id);

			const isOwner = memberes.some(member => (member.role === 'Owner') && member.user.id === user.id);
			// console.log(isOwner)

			if (isOwner) {
				const second = memberes.some(membr => membr.role === 'Admin');
				if (second) {
					const done = await this.chatService.makeOwner(room);
					// console.log('done**--**-*-*-*-*-', done)
					if (done) {
						// console.log('New owner selected', done)
					}
				}
				else {
					this.server.to('1').emit("chatRoomDeleted", { success: true, room });
					await this.chatService.deleteRoom(room);
					// console.log("[LeaveChatRoom]");
				}
			}
			client.leave(room.id);

			// Notify other members in the room that the user has left.
			this.server.to(room.id).emit('leftChatRoom', { success: true, room: room, user: user });

			// Optionally, notify the leaving user of their successful departure.
			client.emit('leftChatRoomSuccess', { success: true, room: room });
			const membr = await this.chatService.findMemberInChatRoom(user.id, room.id);
			if (membr) {
				await this.chatService.deleteMember(membr); // Assuming deleteMember() is a method that handles the deletion and accepts the member's id.
			}
		} catch (error) {
			client.emit('leftChatRoomError', { success: false, error: error.message });
		}
	}
	//--------------------------------------------
	@SubscribeMessage('makeAdmin')
	async handlemakeAdmin(client: Socket, payload: { user: UserEntity, roomId: string, login: string }) {
		try {
			const { user, roomId, login } = payload;
			const userToAd = await this.userService.find_user_by_login(login)
			const userIdToAd = userToAd.id
			// Check if the user issuing the Admin command is the owner
			const room = await this.chatService.findChatRoom(roomId);
			if (!room) {
				throw new BadRequestException('Room not found');
			}

			// Find members of the room
			const members = await this.chatService.findMembersByRoomId(roomId);
			// console.log('members----------', members)

			// Check if the client is the owner
			// console.log('ownerID----------', ownerId)
			const isOwner = members.some(member => (member.role === 'Owner' || member.role === 'Admin') && member.user.id === user.id);
			// console.log('isowner----------', isOwner)

			if (!isOwner) {
				throw new BadRequestException('Only the room owner or admins can Adminning users');
			}
			else {
				// Add Admin logic here. This could be saving the Admin to a database, or an in-memory list.
				// For simplicity, let's say you have a AdminService (you'd need to create this) which can add Admins:

				//------------------------------------------------OFFLINE ADDING
				const member = await this.chatService.findMemberInChatRoom(userIdToAd, roomId);
				member.role = 'Admin'
				await this.chatService.updateMember(member);
				// Notify the Adminned user
				const userSocket = this.socketsByUserID.get(userIdToAd.toString());
				if (userSocket) {
					userSocket.emit('AdminnedFromRoom', { roomId });
				}
			}
		}
		catch (error) {
			client.emit('AdminningError', { message: error.message });
		}
	}

	@SubscribeMessage('unbanUser')
	async handleUnbanUser(client: Socket, payload: { user: UserEntity, userId: string, roomId: string }) {
		try {
			const { user, roomId, userId } = payload;
			const userToUnBan = await this.userService.find_user_by_login(userId)

			const members = await this.chatService.findMembersByRoomId(roomId);

			const isOwner = members.some(member => (member.role === 'Owner' || member.role === 'Admin') && member.user.id === user.id);
			// console.log('isowner----------', isOwner)

			if (!isOwner) {
				throw new BadRequestException('Only the room owner or admins can unban users');
			}
			const member = await this.chatService.findMemberInChatRoom(userToUnBan.id, roomId);
			member.isBanned = false;
			await this.chatService.updateMember(member);
			await this.chatService.unbanUser(userToUnBan.id, roomId);

			// Respond back to the client confirming the user has been unbanned
			client.emit('userUnbanned', { userId, roomId });
		} catch (error) {
			client.emit('unbanError', { message: error.message });
		}
	}

	@SubscribeMessage('passChatRoom')
	async passChatRoom(client: Socket, payload: { user: UserEntity, room: ChatRoom, newPassword: string }) {
		try {
			const { user, room, newPassword } = payload;

			const members = await this.chatService.findMembersByRoomId(room.id);

			const isOwner = members.some(member => member.role === 'Owner' && member.user.id === user.id);


			if (!isOwner) {
				throw new BadRequestException('Only the room owner can change the password');
			}
			const updatedRoom = await this.chatService.updateRoomPassword(room.id, newPassword);

			this.server.to('1').emit('roomUpdated', updatedRoom);

			// Notify the client of success
			client.emit('passwordChangeSuccess', { message: 'Password updated successfully!' });
		} catch (error) {
			// Handle errors
			throw new WsException(`Error updating password: ${error.message}`);
		}
	}

	@SubscribeMessage('cancelpassChatRoom')
	async cancelpassChatRoom(client: Socket, payload: { user: UserEntity, room: ChatRoom }) {
		try {
			const { user, room } = payload;

			const members = await this.chatService.findMembersByRoomId(room.id);

			const isOwner = members.some(member => member.role === 'Owner' && member.user.id === user.id);


			if (!isOwner) {
				throw new BadRequestException('Only the room owner can change the password');
			}

			const updatedRoom = await this.chatService.cancelRoomPassword(room.id);

			this.server.to('1').emit('roomUpdated', updatedRoom);

			// Notify the client of success
			client.emit('passwordChangeSuccess', { message: 'Password updated successfully!' });
		} catch (error) {
			// Handle errors
			throw new WsException(`Error updating password: ${error.message}`);
		}
	}

	@SubscribeMessage('message')
	async handleMessage(client: Socket, username: string) {
		// console.log('userdataaaaa')

		try {
			// console.log('here', username)

			// Replace the below code with actual logic for fetching user details.
			const userData = await this.userService.find_user_by_userName(username);

			if (!userData) {
				throw new Error('User not found.');
			}

			// Sending back the user data to the client
			// console.log('userdataaaaa', userData)
			client.emit('userResponse', { username: username, user: userData });

		} catch (error) {
			// Handle errors and inform the client
			client.emit('messageError', { message: error.message });
		}
	}
}