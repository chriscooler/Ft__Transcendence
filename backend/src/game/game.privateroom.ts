import { Room, Client } from 'colyseus';
import { PaddleDirection, Physics, PhysicsOptions } from "./game.physics";
import { GameState, GameStatus } from "./game.serverSchema";
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/user.service';

export interface PaddleMoveMessage {
	newDirection: PaddleDirection;
}
export interface UserInfos {
	roomId: string,
	username: string,
	login: string,
	id: number,
	clientId: string,
	client: Client,
	idToInvite: number,
	loginToInvite: string,
	speed: number,
	paddleSize: string,
	scoreToWin: number,
	colorMode: string,
}

@Injectable()
export class privateRoom extends Room<GameState> {

	private static roomPlayerInfosMap = new Map<number, UserInfos>();
	maxClients = 2;

	private client1: Client;
	private client2: Client;

	//private playerInfo: Map<Client, { loginName: string} > = new Map();
	private physics!: Physics;
	public lpId!: string;
	public rpId!: string;
	public lpUserName: string = 'test 1';
	public rpUserName: string = 'test 2';
	public lpUserId: number = 41;
	public rpUserId: number = 42;
	private winningScore: number;

	onCreate(options: any) {
		// console.log(' -[ (Private) - onCreate () ]- -> Options : ', options);

		this.setState(new GameState());
		const physicsOptions: PhysicsOptions = {
			ballSpeed: options.speed || 1, // Default to 1 if not provided
			paddleSpeed: 0.5, // Default value for paddleSpeed
			ballAngle: 0, // Default value for ballAngle
		};
		this.physics = new Physics(this.state.ball, this.state.leftPaddle, this.state.rightPaddle, physicsOptions);
		this.winningScore = options.scoreToWin;
		this.setMetadata({ idToInvite: options.idToInvite });
	}

	async onJoin(client: Client, options: any) {
		// console.log(" -[ OnJoin() ]- mapSize: ", mapSize)
		if (this.clients.length === 1 && options.loginName !== undefined) {

				// console.log(' -[ (Private) - onJoin() ]- Player [1]');
				this.client1 = client;
				this.lpId = client.id;
				this.lpUserName = options.username;
				this.lpUserId = options.id;

				const userInfos: UserInfos = {
					roomId: this.roomId,
					username: options.username,
					login: options.loginName,
					id: options.id,
					clientId: client.sessionId,
					client: client,
					idToInvite: options.idToInvite,
					loginToInvite: options.loginToInvite,
					speed: options.speed,
					paddleSize: options.paddleSize,
					scoreToWin: options.scoreToWin,
					colorMode: options.backgroundColor,
				};
				// Ajout a la liste des InGame Friends
				UserService.inGameUsersSet.add(this.lpUserId);
				privateRoom.roomPlayerInfosMap.set(1, userInfos);

				// // [ Send Invitation to Other player ] // // // // 
				//console.log(' -[ (Private) - onJoin() ]- Player [1] -> Broadcast Send...');
				this.broadcast('invitation', userInfos);

		} else if (this.clients.length === 2 && options.loginName !== undefined) {

					//console.log(' -[ (Private) - onJoin ]- Player [2]');
					this.client2 = client;
					this.rpId = client.id;
					this.rpUserName = options.username;
					this.rpUserId = options.id;

					const userInfos: UserInfos = {
						roomId: this.roomId,
						username: options.username,
						login: options.loginName,
						id: options.id,
						clientId: client.sessionId,
						client: client,
						idToInvite: 0,
						loginToInvite: options.username,
						speed: options.speed,
						paddleSize: options.paddleSize,
						scoreToWin: options.scoreToWin,
						colorMode: options.backgroundColor,
					};

					UserService.inGameUsersSet.add(this.rpUserId);
					privateRoom.roomPlayerInfosMap.set(2, userInfos);
					privateRoom.roomPlayerInfosMap.clear();
					this.state.gameStatus = GameStatus.PLAYING;
					this.setSimulationInterval(deltaTime => this.update(deltaTime, options.loginName));
		}

		this.onMessage('player_disconnected', (client, message) => {
			//console.log('-[ onJoin() - onMessage\'PlayerDisconected\' )]- message: ', message);
			// console.log(' -- Before -- appel onLeave()');
			this.onLeave(client);
			// console.log(' -- After -- appel onLeave()');
			this.onDispose();
			privateRoom.roomPlayerInfosMap.clear();
			client.leave();
		});
	}


	private update(deltaTime: number, loginName: string) {
		if (this.state.gameStatus !== GameStatus.PLAYING && this.state.gameStatus !== GameStatus.INTERRUPTED) return;
		if (this.physics.checkLeftWall()) {
			this.state.scoreboard.right += 1;
			this.state.ball.center();
			this.physics.setAngle(0);
		}
		if (this.physics.checkRightWall()) {
			this.state.scoreboard.left += 1;
			this.state.ball.center();
			this.physics.setAngle(Math.PI);
		}
		if (this.state.gameStatus === GameStatus.INTERRUPTED) {
		}
		else {
			// -[ End of Game ]- 
			if (this.state.scoreboard.left >= this.winningScore || this.state.scoreboard.right >= this.winningScore) {
				this.state.gameStatus = GameStatus.FINISHED;

				let winnerMessage: string = 'Good Job *** You WON *** !';
				let looserMessage: string = ' *** L O O S E R ***';
				// Enregistrement Scores (Match History)
				// console.log(' -[ GameFinisheD ]- LpUsername: ', this.lpUserName, ' - scoreLeft: ', this.state.scoreboard.left, '  RpUsername: ', this.rpUserName, '  scoreRight: ', this.state.scoreboard.right)
				// console.log(' -[ GameFinisheD ]- scoreLeft: ', this.state.scoreboard.left, '  scoreRight: ', this.state.scoreboard.right)
				const gameResults = {
					lpUserId: this.lpUserId,
					lpScore: this.state.scoreboard.left,
					rpUserId: this.rpUserId,
					rpScore: this.state.scoreboard.right,
				}
				//console.log('-------Game Finished:');
				if (this.state.scoreboard.left > this.state.scoreboard.right) // [* Left Player Won *]
				{
					//console.log(' - Game Results:', gameResults);
					//console.log('[ tentative - Increment Rank Left Won ]...')
					this.broadcast('updateWinningScore', { winningScore: this.winningScore });
					this.broadcast('scoreHistory', gameResults, { except: [this.client1] });
					this.broadcast('gameFinished', { message: winnerMessage, winnerLogin: this.lpUserName }, { except: [this.client2] });
					this.broadcast('gameFinished', { message: looserMessage, winnerLogin: this.lpUserName }, { except: [this.client1] });

					// console.log(' - Game Finished:', { message: winnerMessage, winnerLogin: this.lpUserName });
					// console.log(' - Game Finished:', { message: looserMessage, winnerLogin: this.lpUserName });
				}
				else //  [ *Right Player Won* ]
				{
					//console.log('[ tentative - Increment Rank Right Won ]...')
					this.broadcast('updateWinningScore', { winningScore: this.winningScore });
					this.broadcast('scoreHistory', gameResults, { except: [this.client2] });
					this.broadcast('gameFinished', { message: winnerMessage, winnerLogin: this.rpUserName }, { except: [this.client1] });
					this.broadcast('gameFinished', { message: looserMessage, winnerLogin: this.rpUserName }, { except: [this.client2] });

					// console.log(' - Game Finished:', { message: winnerMessage, winnerLogin: this.rpUserName });
					// console.log(' - Game Finished:', { message: looserMessage, winnerLogin: this.rpUserName });
				}
			}
			this.physics.update(deltaTime);
		}
		this.onMessage('paddleMove', (client, message) => {
			if (client.id === this.rpId) {
				this.physics.setRightPaddleDirection(message.newDirection);
			}
			if (client.id === this.lpId) {
				this.physics.setLeftPaddleDirection(message.newDirection);
			}
		});
	}

	async onLeave(client: Client, consented?: boolean) {
		if (client.id === this.lpId) {
			this.lpId = undefined;
		} else if (client.id === this.rpId) {
			this.rpId = undefined;
		}
		if (!this.lpId || !this.rpId) {
			if (this.state.gameStatus !== GameStatus.FINISHED) {
				this.state.gameStatus = GameStatus.FINISHED;
				if (!this.lpId) {
					this.state.scoreboard.left = -1;
					this.state.scoreboard.right = 3;
				}
				else {
					this.state.scoreboard.left = 3;
					this.state.scoreboard.right = -1;
				}
				const gameResults = {
					lpUserId: this.lpUserId,
					lpScore: this.state.scoreboard.left,
					rpUserId: this.rpUserId,
					rpScore: this.state.scoreboard.right,
				}
				if (!this.lpId) {
					this.broadcast('opponentLeft', {}, { except: [this.client1] });
					this.broadcast('scoreHistory', gameResults, { except: [this.client1] });
				}
				else {
					this.broadcast('opponentLeft', {}, { except: [this.client2] });
					this.broadcast('scoreHistory', gameResults, { except: [this.client2] });
				}
			}
		}
		if (!this.lpId && !this.rpId) {
			this.disconnect();
		}
		this.disconnect();
	}

	onDispose() {
		// console.log("-[ (Private) - onDispose() ]- ");
	}

}