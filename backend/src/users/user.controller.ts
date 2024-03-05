import { Controller, Query, Get, HttpCode, HttpStatus, Request, Response, UseGuards, UnauthorizedException, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './orm/user.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) { }

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Get('profile')
	async profile(@Request() req, @Response() res) {
		try {
			const headers = req.headers;
			const Token = req.headers.authorization;
			const [, jwtToken] = Token.split(' '); // Divise la chaîne en fonction de l'espace et ignore la première partie (Bearer)
			// console.log(" -[ Profile UserCtrl ]- jwtToken: ", jwtToken);
			const jwt = this.jwtService.decode(jwtToken) as { [key: string]: any };
			// console.log(" -[ Profile UserCtrl ]- decode jwt: ", jwt);
			// console.log(" -[ Profile UserCtrl ]- jwt id: ", jwt.id);
			const user = await this.userService.find_user_by_id(jwt.id);
			// console.log(" -[ Profile UserCtrl ]- User: ", user);
			res.json(user);
		}
		catch (e) {
			// console.log("-->  -{ Catch }-  -  [ Profile UserCtrl ] (e): ", e);
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Get('profileOther')
	async profileOther(@Query('username') username: string, @Request() req, @Response() res) {
		// console.log(" -[ ProfileOther User.Ctrl ]- QueryParam: ", username);
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				const requesterProfile = await this.userService.find_user_by_login(decoded.login);
				const userProfile = await this.userService.find_user_by_login(username);
				const user = {
					login: userProfile.login,
					id: userProfile.id,
					username: userProfile.userName,
					avatar: userProfile.avatar,
					rank: userProfile.rank,
					title: userProfile.title,
					win: userProfile.wonGameNbr,
					loose: userProfile.lostGameNbr,

					isMyFriend: requesterProfile.friends.includes(userProfile.login),
					isInPending: requesterProfile.pendindFriendRequests.includes(userProfile.login),
					isInSentRequest: requesterProfile.friendRequestsSent.includes(userProfile.login),
					isInBlockList: requesterProfile.blockedUser.includes(userProfile.login),
					isInBlockedByList: requesterProfile.blockedBy.includes(userProfile.login)
				}
				// console.log(" -[ ProfileOther ]-  User-json(): ", user);
				res.json(user);
			}
		}
		catch (e) {
			// console.log("-->  -{ Catch }-  -  [ Profile UserCtrl ] (e): ", e);
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Post('sendFriendRequest')
	async sendFriendRequest(@Request() req) {
		// console.log(" -[ requestFriends  / UsrCtrl ]- ");
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				const friendUsername: string = req.body.data.username;

				await this.userService.sendFriendRequest(decoded.login, friendUsername);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Post('refuseFriendRequest')
	async refuseFriendRequest(@Request() req) {
		// console.log(" -[ refuse Friends  / UsrCtrl ]- ");
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				// const friendUsername: string = req.body.data.username;
				const friendId: number = req.body.data.idToRefuse;

				const user2login = await this.userService.find_user_by_id(friendId);
				const user1username = await this.userService.find_user_by_login(decoded.login);
				// clear pending and request List of User
				await this.userService.clearUpdatePendingAndRequestList(user1username.userName, user2login.login);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Post('addFriend')
	async addNewFriendship(@Request() req) {
		// console.log(" -[ addFriends  / UsrCtrl ]- ");
		try {
			const token = await req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				//console.log('New Jwt encode: ', decoded);

				// const friendUsername: string = req.body.data.username;
				const friendId: number = await req.body.data.idToAccept;
				// console.log(" -[ addFriends  / UsrCtrl ]-  req.body.data [", req.body.data);


				//console.log(" -[ addFriends  / UsrCtrl ]-  req.body.data [", req.body.data);
				//console.log(" -[ addFriends  / UsrCtrl ]-  friend Username: [", friendUsername, '] et decoded.login [', decoded.login, "]");

				await this.userService.addFriend(decoded.login, friendId);

				const user2login = await this.userService.find_user_by_id(friendId);
				const user1username = await this.userService.find_user_by_login(decoded.login);
				//this.userService.addFriend(user2login.login, user1username.userName);
				// clear pending and request List of User
				await this.userService.clearUpdatePendingAndRequestList(user1username.userName, user2login.login);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Post('removeFriend')
	async removeFriendship(@Request() req) {
		// console.log(" -[ RemoveFriends  / UsrCtrl ]- ");
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };

				// const friendUsername: string = req.body.data.username;
				const friendId: number = req.body.data.idToRemove;

				const friend = await this.userService.find_user_by_id(friendId);
				const friendUsername: string = friend.userName;
				await this.userService.removeFriend(decoded.login, friendUsername);
				const user2login = await this.userService.find_user_by_userName(friendUsername)
				const user1username = await this.userService.find_user_by_login(decoded.login)
				await this.userService.removeFriend(user2login.login, user1username.userName);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}


	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Get('pendingList')
	async getPendingList(@Request() req, @Response() res) {
		// console.log(" -[ PendingList  / UsrCtrl ]- ");
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				const pendingList: any[] = await this.userService.getPendingList(decoded.id);
				res.json(pendingList);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}


	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Get('friendsList')
	async getfriendList(@Request() req, @Response() res) {
		// console.log(" -[ FriendList  / UsrCtrl ]- ");
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				const friendsList: any[] = await this.userService.getFriendsList(decoded.id);
				res.json(friendsList);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Get('sentRequestsList')
	async getRequestsList(@Request() req, @Response() res) {
		// console.log(" -[ sentRequestsList  / UsrCtrl ]- ");
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				const sentRequestsList: any[] = await this.userService.getSentRequestsList(decoded.id);
				res.json(sentRequestsList);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	///////////////////////  G A M E ///////////////////////////////////////////////

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Post('increment')
	async incrementWinner(@Request() req) {
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				await this.userService.incrementRankAndTitle(decoded.id);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Post('incrementLooser')
	async incrementLooser(@Request() req) {
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				await this.userService.incrementLost(decoded.id);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Post('enterGame')
	async enterGame(@Request() req) {
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				await this.userService.add_inGameUser(decoded.id);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Post('leaveGame')
	async leaveGame(@Request() req) {
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				await this.userService.remove_inGameUser(decoded.id);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Get('inGameUsers')
	async getInGameUsersList(@Request() req, @Response() res) {
		try {
			// console.log(" -[ get InGameList  / UsrCtrl ]- ");
			const inGameList: any[] = await this.userService.getInGameUsers();
			res.json(inGameList);
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Post('matchHistory')
	async matchHistory(@Request() req) {
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				const history = req.body.data;
				// console.log('-[ Match History / Ctrl ]- : ', history);
				await this.userService.register_MatchHistory(history);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Get('getMatchHistory')
	async getMatchHistoryList(@Request() req, @Response() res) {
		try {
			// console.log(" -[ Match History List  / UsrCtrl ]- ");
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };

				const user = await this.userService.find_user_by_id(decoded.id);
				const matchHistoryList = await this.userService.getMatchHistory(user);
				// console.log(" -[ Match History List  / UsrCtrl ]- Match History: ", matchHistoryList);
				res.json(matchHistoryList);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}


	/////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////  Block User System /////////////////////////////
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Post('blockUser')
	async blockAUser(@Request() req) {
		// console.log(" -[ BlockUser  / UsrCtrl ]- ");
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				const usernameToBlock: string = req.body.data.username;

				this.userService.blockUser(decoded.login, usernameToBlock);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Post('unblockUser')
	async unblockUser(@Request() req) {
		// console.log(" -[ UnblockUser  / UsrCtrl ]- ");
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				const usernameToUnblock: string = req.body.data.username;

				this.userService.unblockUser(decoded.login, usernameToUnblock);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Get('blockUserList')
	async getBlockUserList(@Request() req, @Response() res) {
		// console.log(" -[ getBlockUser  / UsrCtrl ]- ");
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				const blockUserList: any[] = await this.userService.getUsersIBlockList(decoded.id);
				res.json(blockUserList);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Get('blockedByList')
	async getBlockedByUserList(@Request() req, @Response() res) {
		// console.log(" -[ getBlockedBy  / UsrCtrl ]- ");
		try {
			const token = req.headers.authorization;
			if (token) {
				const jwt = token.replace('Bearer', '').trim();
				const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
				const blockedByList: any[] = await this.userService.getUsersWhoBlockedMeList(decoded.id);
				res.json(blockedByList);
			}
		} catch (e) {
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Get('/all')
	find_all_users(): Promise<UserEntity[]> {
		try {
			return this.userService.find_all_users();
		} catch (e) {
			throw new UnauthorizedException;
		}
	}
}