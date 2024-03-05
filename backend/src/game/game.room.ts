import { Room, Client } from 'colyseus';
import { PaddleDirection, Physics, PhysicsOptions } from "./game.physics";
import { GameState, GameStatus } from "./game.serverSchema";
import { Injectable, Scope } from '@nestjs/common';
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
}

@Injectable({ scope: Scope.DEFAULT })
export class PongRoom extends Room<GameState> {

	static roomPlayerInfosMap = new Map<number, UserInfos>();
	maxClients = 2;

	private client1: Client;
	private client2: Client;
	private physics!: Physics;
	public lpId!: any; // <<<=== Left player ID
	public rpId!: any; // <<<=== Right player ID
	public lpUserName: string = 'test 1';
	public rpUserName: string = 'test 2';
	public lpUserId: number = 41;
	public rpUserId: number = 42;
	private winningScore: number;
	private roomLocked: boolean = false;

	onCreate(options: any) {
		// console.log(' -[ onCreate () ]- -> Options : ', options);
		this.setState(new GameState());
		const physicsOptions: PhysicsOptions = {
			ballSpeed: 1, // Default to 1 if not provided
			paddleSpeed: 0.5, // Default value for paddleSpeed
			ballAngle: 0, // Default value for ballAngle
		};
		this.physics = new Physics(this.state.ball, this.state.leftPaddle, this.state.rightPaddle, physicsOptions);
		this.winningScore = options.scoreToWin;
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
				if (this.state.scoreboard.left > this.state.scoreboard.right) // [* Left Player Won *]
				{
					// console.log('[ tentative - Increment Rank Left Won ]...')
					this.broadcast('updateWinningScore', { winningScore: this.winningScore });
					this.broadcast('scoreHistory', gameResults, { except: [this.client1] });
					this.broadcast('gameFinished', { message: winnerMessage, winnerLogin: this.lpUserName }, { except: [this.client2] });
					this.broadcast('gameFinished', { message: looserMessage, winnerLogin: this.lpUserName }, { except: [this.client1] });
				}
				else //  [ *Right Player Won* ]
				{
					// console.log('[ tentative - Increment Rank Right Won ]...')
					this.broadcast('updateWinningScore', { winningScore: this.winningScore });
					this.broadcast('scoreHistory', gameResults, { except: [this.client2] });
					this.broadcast('gameFinished', { message: winnerMessage, winnerLogin: this.rpUserName }, { except: [this.client1] });
					this.broadcast('gameFinished', { message: looserMessage, winnerLogin: this.rpUserName }, { except: [this.client2] });
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

	async onJoin(client: Client, options: any) {
		let mapSize = PongRoom.roomPlayerInfosMap.size;
		// console.log(" -[ OnJoin() ]- mapSize: ", mapSize)
			if (this.roomLocked) {
			//   console.log('Matchmaking room is locked!');
			  return;
			}
		
		if (this.clients.length === 1 && options.loginName !== undefined) {

				// console.log(' -[ onJoin() ]- Player [1]');
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
				};
				// Ajout a la liste des InGame Friends
				UserService.inGameUsersSet.add(this.lpUserId);
				PongRoom.roomPlayerInfosMap.set(1, userInfos);

			//}
		} else if (this.clients.length === 2 && options.loginName !== undefined) {
					// console.log(' -[ onJoin ]- Player [2]');
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
					};
					
					// console.log('-[ onJoin() - ]- userInfos.id  ', userInfos.id );
					// console.log('-[ onJoin() - ]- this.lpUserId ', this.lpUserId);
				if (userInfos.id != this.lpUserId) {
					// Ajout a la liste des InGame Friends
					UserService.inGameUsersSet.add(this.rpUserId);
					PongRoom.roomPlayerInfosMap.set(2, userInfos);
					PongRoom.roomPlayerInfosMap.clear();
					this.lockRoomAndStartGame(options.loginName);
				}
				else if (userInfos.id === this.lpUserId)
				{
					this.state.gameStatus = GameStatus.STOPSOLO;
				}
		}
		this.handlePlayerDisconnection();
	}

	private lockRoomAndStartGame(loginName: string) {
		this.roomLocked = true;
		this.lock();
		this.state.gameStatus = GameStatus.PLAYING;
		const intervalFor80FPS = 12.5;
		this.setSimulationInterval(deltaTime => this.update(deltaTime, loginName), intervalFor80FPS);
	}

	private handlePlayerDisconnection() {
		this.onMessage('player_disconnected', (client, message) => {
			// console.log('-[ onJoin() - onMessage \'PlayerDisconnected\' )]- message: ', message);
			// console.log(' -- Before -- call onLeave()');
			this.onLeave(client);
			// console.log(' -- After -- call onLeave()');
			this.onDispose();
			PongRoom.roomPlayerInfosMap.clear();
			//console.log(" -[ OnMessage -disconnect- ]- mapSize (end): ", PongRoom.roomPlayerInfosMap.size);
			client.leave();
		});
	}
	async onLeave(client: Client, consented?: boolean) {
		// console.log('client Onleave ')
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
		// console.log("-[ onDispose() ]- ");
	}
}