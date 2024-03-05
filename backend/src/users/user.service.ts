import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './orm/user.entity';
import { GameEntity } from './orm/game.entity';
import * as otplib from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class UserService {
	static inGameUsersSet = new Set<number>();
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(GameEntity)
		private gameRepository: Repository<GameEntity>
	) { }

	async find_all_users(): Promise<UserEntity[]> {
		try {
			return await this.userRepository.find();
		} catch (e) { }
	}

	async find_user_by_id(id: number): Promise<UserEntity> {
		try {
			return await this.userRepository.findOne({ where: { id: id } })
		} catch (e) { }
	}

	async find_user_by_login(login: string): Promise<UserEntity> {
		try {
			return await this.userRepository.findOne({ where: { login: login } })
		} catch (e) { }
	}

	async find_user_by_userName(userName: string): Promise<UserEntity> {
		try {
			return await this.userRepository.findOne({ where: { userName: userName } })
		} catch (e) { }
	}

	async find_user_ID_by_userName(userName: string): Promise<number> {
		try {
			const user = await this.userRepository.findOne({ where: { userName: userName } });
			return user.id;
		} catch (e) { }
	}

	async find_user_ID_by_login(login: string): Promise<number> {
		try {
			const user = await this.userRepository.findOne({ where: { login: login } });
			return user.id;
		} catch (e) { }
	}

	async add_new_user(payload: any) {
		try {
			let user = new UserEntity();
			user.login = payload.login;
			user.userName = payload.userName;
			user.email = payload.email;

			// 42 [ Users ]
			if (payload.is42) {
				user.is42 = payload.is42;
				user.id42 = payload.id42;
				user.lastName = payload.lastName;
				user.firstName = payload.firstName;
				user.avatar = payload.avatar;
				user.resetAvatar = payload.resetAvatar;
			}
			// Non 42 [ Users ]
			else if (payload.password) {
				user.hash = payload.password;
				user.hasPassword = true;
			}
			if (payload.refreshToken) {
				user.refreshToken = payload.refreshToken;
			}
			await this.userRepository.save(user);
			const bob = await this.find_user_by_userName(user.userName);
			// console.log(" -[ User Service ]- {new_user_added_in DB} :  ", bob.userName);
		} catch (e) { }
	}

	async change_username(login: string, newUserName: string) {
		try {
			await this.userRepository.update({ login }, { userName: newUserName });
			return await this.find_user_by_userName(newUserName);
		} catch (e) { }
	}

	async change_avatar(login: string, newAvatar: string) {
		try {
			await this.userRepository.update({ login }, { avatar: newAvatar });
			return await this.find_user_by_login(login);
		} catch (e) { }
	}

	async reset_avatar(id: number) {
		try {
			const user = await this.find_user_by_id(id);
			// console.log('resetAvatar', user.resetAvatar);
			return await this.userRepository.update({ id }, { avatar: user.resetAvatar });
		} catch (e) { }
	}


	// -[ 2fa Google Authentificator ]- ///////////////////////////////////

	async enable_2fa(login: string) {
		try {
			// Genere Secret pour QrCode
			const secret = otplib.authenticator.generateSecret();
			// Genere QRCode
			const user = await this.find_user_by_login(login);
			const email = user.email;
			const otpauthUrl = otplib.authenticator.keyuri(email, 'PacPac-Pong_Transcendence', secret);
			const url = await qrcode.toDataURL(otpauthUrl)
			//console.log("-[Usr Enable 2Fa]- code:  ", url);

			await this.userRepository.update({ login }, { fa2Secret: secret });
			await this.userRepository.update({ login }, { fa2QRCode: url });
			return url;
		} catch (e) { }
	}

	async turn_2fa_on(login: string) {
		try {
			await this.userRepository.update({ login }, { fa2: true });
		} catch (e) { }
	}

	async clear2fa(login: string) {
		try {
			await this.userRepository.update({ login }, { fa2Secret: null });
			await this.userRepository.update({ login }, { fa2QRCode: null });
		} catch (e) { }
	}

	async get_QRCode(login: string) {
		try {
			const user = await this.find_user_by_login(login);
			const url = user.fa2QRCode;
			return url;
		} catch (e) { }
	}

	async remove_2fa(login: string) {
		try {
			await this.userRepository.update({ login }, { fa2: false });
			await this.userRepository.update({ login }, { fa2Secret: null });
			await this.userRepository.update({ login }, { fa2QRCode: null });
		} catch (e) { }
	}

	//////////////////////////////////////////////////
	//		 ********************				   //
	// 		*** [ Friendship ] ***				  //
	//		 ********************				 //
	//////////////////////////////////////////////
	async sendFriendRequest(login: string, friendLogin: string) {
		try {
			let requester = await this.find_user_by_login(login);
			let receiver = await this.find_user_by_login(friendLogin);
			if (!requester || !receiver) {
				throw new BadRequestException('User not found');
			}

			if (!requester.friendRequestsSent.includes(receiver.login)) {
				requester.friendRequestsSent.push(receiver.login);
				// console.log("4  -[ RequestFriend ]- Ajout de [", receiver.login, "] a la friendRequestSent list de [", requester.login, "]");
				await this.userRepository.save(requester);
			}

			if (!receiver.pendindFriendRequests.includes(requester.login)) {
				receiver.pendindFriendRequests.push(requester.login);
				// console.log("4  -[ RequestFriend ]- Ajout de [", requester.login, "] a la pending list de [", receiver.login, "]");
				await this.userRepository.save(receiver);
			}

			//////// console.log Debug
			// const user1test = await this.find_user_by_login(requester.login);
			// const user2test = await this.find_user_by_login(receiver.login);
			// console.log("7  -[ RequestFriend ]- ", user1test.login, "  friendRequestSent list: ", user1test.friendRequestsSent);
			// console.log("8  -[ RequestFriend ]- ", user2test.login, "  Pending list: ", user2test.pendindFriendRequests);
			/////////////////////
		} catch (e) { }
	}


	async addFriend(login: string, friendId: number) {
		try {
			// console.log("1  -[ addFriends ]- login: [", login, "]    friendUsername [", friendUsername, "]");
			let user1 = await this.find_user_by_login(login);
			let user2 = await this.find_user_by_id(friendId);
			//console.log("2  -[ Friends ]- user1.login [", user1.login, "] user2.login [", user2.login, "]");
			if (!user1 || !user2) {
				throw new BadRequestException('User not found');
			}

			//console.log("3  -[ Friends ]- User 1... > 4 ?");
			if (!user1.friends.includes(user2.login)) {
				user1.friends.push(user2.login);
				// console.log("4  -[ addFriends ]- Ajout de [", user2.login, "] a la friend list de [", user1.login, "]");
				await this.userRepository
					.createQueryBuilder()
					.update()
					.set({ friends: user1.friends }) // Met à jour le champ friends avec la nouvelle liste d'amis
					.where("id = :id", { id: user1.id })
					.execute();
			}

			user1 = await this.find_user_by_login(login);
			user2 = await this.find_user_by_id(friendId);
			if (!user2.friends.includes(user1.login)) {
				user2.friends.push(user1.login);
				await this.userRepository
					.createQueryBuilder()
					.update()
					.set({ friends: user2.friends }) // Met à jour le champ friends avec la nouvelle liste d'amis
					.where("id = :id", { id: user2.id })
					.execute();
			}

			//////// console.log / Debug
			// const user1test = await this.find_user_by_login(user1.login);
			// const user2test = await this.find_user_by_login(user2.login);
			// console.log("7  -[ addFriends ]- ", user1test.login, "  friendList: ", user1test.friends);
			// console.log("8  -[ addFriends ]- ", user2test.login, "  friendList: ", user2test.friends);
			/////////////////////
		} catch (e) { }
	}


	async clearUpdatePendingAndRequestList(receiver: string, sender: string) {
		try {
			let accepter = await this.find_user_by_userName(receiver);
			let requester = await this.find_user_by_login(sender);
			// console.log("1  -[ clear Friend ]- ", accepter.login, "  pendindFriendRequests: ", accepter.pendindFriendRequests);
			// console.log("1  -[ clear Friend ]- ", requester.login, "  friendRequestsSent: ", requester.friendRequestsSent);
			if (!requester || !accepter) {
				throw new BadRequestException('User not found');
			}
			// clear la pending list de celui qui receive/accepte
			const pendingFriendIndex = accepter.pendindFriendRequests.indexOf(requester.login);
			if (pendingFriendIndex !== -1) {
				accepter.pendindFriendRequests.splice(pendingFriendIndex, 1);
				// console.log("2  -[ clear Friend ]- *accepter* PendingList: ", accepter.pendindFriendRequests)
				await this.userRepository.save(accepter);
			}

			// clear la SendRequest list de celui qui send/request
			const senderFriendIndex = requester.friendRequestsSent.indexOf(accepter.login);
			if (senderFriendIndex !== -1) {
				requester.friendRequestsSent.splice(senderFriendIndex, 1);
				// console.log("2  -[ clear Friend ]- *requester* SentRequestsList: ", requester.friendRequestsSent)
				await this.userRepository.save(requester);
			}

			// debug
			// const user1test = await this.find_user_by_login(accepter.login);
			// const user2test = await this.find_user_by_login(requester.login);
			// console.log("2  -[ clear Friend ]- ", user1test.login, "  pendindFriendRequests: ", user1test.pendindFriendRequests);
			// console.log("2  -[ clear Friend ]- ", user2test.login, "  friendRequestsSent: ", user2test.friendRequestsSent);
			/////////////////////
		} catch (e) { }
	}

	async removeFriend(login: string, friendUsername: string) {
		try {
			let user1 = await this.find_user_by_login(login);
			let user2 = await this.find_user_by_userName(friendUsername);
			if (!user1 || !user2) {
				throw new BadRequestException('User not found');
			}

			const friendIndex = user1.friends.indexOf(user2.login);
			if (friendIndex !== -1) {
				user1.friends.splice(friendIndex, 1);
				await this.userRepository.save(user1);
			}

			// debug
			// const user1test = await this.find_user_by_login(user1.login);
			// console.log("7  -[ removeFriends ]- ", user1test.login, "  friendList: ", user1test.friends);
			/////////////////////
		} catch (e) { }
	}


	async getPendingList(id: number) {
		try {
			const user = await this.find_user_by_id(id);
			// console.log(" -[ UsrServ - Get Pending ]- le user: [", user.userName, "] -> sa PendingList: ", user.pendindFriendRequests);
			const loginPendingList: string[] = user.pendindFriendRequests;
			// tranformation des login en user Obj
			let usersPendingList: any[] = [];
			for (const login of loginPendingList) {
				const user = await this.find_user_by_login(login);
				usersPendingList.push({ id: user.id, login: user.login, username: user.userName, avatar: user.avatar });
			}
			return usersPendingList;
		} catch (e) { }
	}

	async getFriendsList(id: number) {
		try {
			const user = await this.find_user_by_id(id);
			// console.log(" -[ Get Friends ]- userRecup: [", user.userName, "] -> friendsList: ", user.friends);
			const loginFriendsList: string[] = user.friends;
			// tranformation des login en objet user
			let userFriendsList: any[] = [];
			for (const login of loginFriendsList) {
				const user = await this.find_user_by_login(login);
				userFriendsList.push({ id: user.id, login: user.login, username: user.userName, avatar: user.avatar });
			}
			return userFriendsList;
		} catch (e) { }
	}

	async getSentRequestsList(id: number) {
		try {
			const user = await this.find_user_by_id(id);
			// console.log(" -[ UsrServ - Get SendRequests ]- Le user: [", user.userName, "] -> sa RequestsList: ", user.friendRequestsSent);
			const loginSentRequestsList: string[] = user.friendRequestsSent;
			// tranformation des login en user Obj
			let usersSentRequestsList: any[] = [];
			for (const login of loginSentRequestsList) {
				const user = await this.find_user_by_login(login);
				usersSentRequestsList.push({ id: user.id, login: user.login, username: user.userName, avatar: user.avatar });
			}
			return usersSentRequestsList;
		} catch (e) { }
	}

	//////////////////  BLOCK USER SYSTEM ////////////////

	async blockUser(login: string, usernameToBlock: string) {
		try {
			let requester = await this.find_user_by_login(login);
			let receiver = await this.find_user_by_userName(usernameToBlock);
			if (!requester || !receiver) {
				throw new BadRequestException('User not found');
			}

			if (!requester.blockedUser.includes(receiver.login)) {
				requester.blockedUser.push(receiver.login);
				// console.log("4  -[ BlockUser ]- Ajout de [", receiver.login, "] a la BlockedUser list de [", requester.login, "]");
				await this.userRepository.save(requester);
			}

			if (!receiver.blockedBy.includes(requester.login)) {
				receiver.blockedBy.push(requester.login);
				// console.log("4  -[ BlockeUser ]- Ajout de [", requester.login, "] a la BlockedBy list de [", receiver.login, "]");
				await this.userRepository.save(receiver);
			}

			//////// console.log Debug
			// const user1test = await this.find_user_by_login(requester.login);
			// const user2test = await this.find_user_by_login(receiver.login);
			// console.log("7  -[ BlockeUser ]- ", user1test.login, "  BlockedUser list: ", user1test.blockedUser);
			// console.log("8  -[ BlockeUser ]- ", user2test.login, "  BlockedBy list: ", user2test.blockedBy);
			/////////////////////
		} catch (e) { }
	}

	async unblockUser(login: string, usernameToUnblock: string) {
		try {
			let requester = await this.find_user_by_login(login);
			let receiver = await this.find_user_by_userName(usernameToUnblock);
			if (!requester || !receiver) {
				throw new BadRequestException('User not found');
			}

			const friendIndex = requester.blockedUser.indexOf(receiver.login);
			if (friendIndex !== -1) {
				requester.blockedUser.splice(friendIndex, 1);
				await this.userRepository.save(requester);
			}

			const friendIndex2 = receiver.blockedBy.indexOf(requester.login);
			if (friendIndex2 !== -1) {
				receiver.blockedBy.splice(friendIndex2, 1);
				await this.userRepository.save(receiver);
			}

			//////// console.log Debug
			// const user1test = await this.find_user_by_login(requester.login);
			// const user2test = await this.find_user_by_login(receiver.login);
			// console.log("7  -[ UnblockUser ]- ", user1test.login, "  BlockedUser list: ", user1test.blockedUser);
			// console.log("8  -[ UnblockUser ]- ", user2test.login, "  BlockedBy list: ", user2test.blockedBy);
			/////////////////////
		} catch (e) { }
	}

	async getUsersIBlockList(id: number) {
		try {
			const user = await this.find_user_by_id(id);
			// console.log(" -[ Get User I Block ]- user: [", user.userName, "] -> BlockList: ", user.blockedUser);
			const loginUserBlockedList: string[] = user.blockedUser;
			// tranformation des login User Obj
			let userBlockList: any[] = [];
			for (const login of loginUserBlockedList) {
				const user = await this.find_user_by_login(login);
				userBlockList.push({ id: user.id, login: user.login, username: user.userName, avatar: user.avatar });
			}
			return userBlockList;
		} catch (e) { }
	}

	async getUsersWhoBlockedMeList(id: number) {
		try {
			const user = await this.find_user_by_id(id);
			// console.log(" -[ Get UsersWhoBlockedMe ]- user: [", user.userName, "] -> BlockByList: ", user.blockedBy);
			const loginUserBlockedByList: string[] = user.blockedBy;
			// tranformation des login User Obj
			let userBlockedByList: any[] = [];
			for (const login of loginUserBlockedByList) {
				const user = await this.find_user_by_login(login);
				userBlockedByList.push({ id: user.id, login: user.login, username: user.userName, avatar: user.avatar });
			}
			return userBlockedByList;
		} catch (e) { }
	}

	//////////////////////////////////////////////////
	//		 ********************				   //
	// 		***    [ GAME ]    ***				  //
	//		 ********************				 //
	//////////////////////////////////////////////
	async incrementRankAndTitle(id: number) {
		try {
			let rank: number;
			let user = await this.find_user_by_id(id);
			// console.log(" -[ Game Ranking ]- user: [", user.userName, "] -> formerRank: (", user.rank, ") -> Title: { ", user.title, " }");
			rank = user.rank;
			user.wonGameNbr += 1;
			if (rank < 100) {
				rank += 1;
				user.rank = rank;
			}
			if (rank === 2) {
				user.title = "Confirmed";
			}
			else if (rank > 2) {
				user.title = "God of War";
			}
			await this.userRepository.save(user);
		} catch (e) { }
	}

	async incrementLost(id: number) {
		try {
			const user = await this.find_user_by_id(id);
			if (user) {
				user.lostGameNbr += 1;
				await this.userRepository.save(user);
			}
		} catch (error) { }
	}

	async add_inGameUser(id: number) {
		try {
			UserService.inGameUsersSet.add(id);
		} catch (e) { }
	}

	async remove_inGameUser(id: number) {
		try {
			UserService.inGameUsersSet.delete(id);
		} catch (e) { }
	}

	async getInGameUsers() {
		try {
			const inGameIdList: number[] = Array.from(UserService.inGameUsersSet);
			// transforme id en objet user 
			let usersInGameDatas: any[] = [];
			// console.log(' [ getInGameUsers ] inGameIdList.length: ', inGameIdList.length);
			// console.log(' [ getInGameUsers ] inGameIdList[]: ', inGameIdList);
			const idListLength: number = inGameIdList.length;
			if (idListLength != 0)
				for (const idUser of inGameIdList) {
					// console.log('test [ ID ] : ', idUser)
					if (idUser != 0) {
						const user = await this.find_user_by_id(idUser);
						usersInGameDatas.push({ id: user.id, login: user.login, username: user.userName, avatar: user.avatar });
					}
				}
			// console.log(' -[ UserService - getInGameUsers ]-  UsersList : ', usersInGameDatas);
			return usersInGameDatas;
		} catch (e) { }
	}

	//		[ Match History]		//
	async register_MatchHistory(data: any) {
		try {
			const player1: UserEntity = await this.find_user_by_id(data.lpUserId);
			const player1Score: number = data.lpScore;
			const player2: UserEntity = await this.find_user_by_id(data.rpUserId);
			const player2Score: number = data.rpScore;

			if (player1Score > player2Score) {
				this.incrementRankAndTitle(data.lpUserId);
				this.incrementLost(data.rpUserId);
			}
			else {
				this.incrementRankAndTitle(data.rpUserId);
				this.incrementLost(data.lpUserId);
			}

			const game = new GameEntity();
			game.player1 = player1;
			game.player2 = player2;
			game.player1Score = player1Score;
			game.player2Score = player2Score;
			// console.log(' -[ Register MatchHistory ]- ');
			await this.gameRepository.save(game);
		} catch (e) { }
	}


	async getMatchHistory(user: UserEntity): Promise<any[]> {
		try {
			const games: GameEntity[] = await this.gameRepository
				.createQueryBuilder('game')
				.leftJoinAndSelect('game.player1', 'player1')
				.leftJoinAndSelect('game.player2', 'player2')
				.where('player1.id = :userId OR player2.id = :userId', { userId: user.id })
				.getMany();

			const matchHistory = games.map(game => {
				return {
					player1: game.player1.userName,
					player2: game.player2.userName,
					scorePlayer1: game.player1Score,
					scorePlayer2: game.player2Score,
				};
			});

			return matchHistory;
		} catch (e) { }
	}

	async getLeaderBoard() {
		try {
			// Récupérez tous les utilisateurs triés par wonGameNbr de manière décroissante
			const users = await this.userRepository.find({ order: { wonGameNbr: 'DESC' } });
			const leaderTab: any[] = users
				.slice(0, 3) // seul les 3 meilleurs !
				.map(user => ({
					id: user.id,
					login: user.login,
					username: user.userName,
					avatar: user.avatar,
					wonGames: user.wonGameNbr,
				}));
			// console.log(' -[ getLeaderBoard ]- leaderTab: ', leaderTab);
			return leaderTab;
		} catch (e) { }
	}

}