"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PongRoom_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PongRoom = void 0;
const colyseus_1 = require("colyseus");
const game_physics_1 = require("./game.physics");
const game_serverSchema_1 = require("./game.serverSchema");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../users/user.service");
let PongRoom = PongRoom_1 = class PongRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 2;
        this.lpUserName = 'test 1';
        this.rpUserName = 'test 2';
        this.lpUserId = 41;
        this.rpUserId = 42;
        this.roomLocked = false;
    }
    onCreate(options) {
        this.setState(new game_serverSchema_1.GameState());
        const physicsOptions = {
            ballSpeed: 1,
            paddleSpeed: 0.5,
            ballAngle: 0,
        };
        this.physics = new game_physics_1.Physics(this.state.ball, this.state.leftPaddle, this.state.rightPaddle, physicsOptions);
        this.winningScore = options.scoreToWin;
    }
    update(deltaTime, loginName) {
        if (this.state.gameStatus !== game_serverSchema_1.GameStatus.PLAYING && this.state.gameStatus !== game_serverSchema_1.GameStatus.INTERRUPTED)
            return;
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
        if (this.state.gameStatus === game_serverSchema_1.GameStatus.INTERRUPTED) {
        }
        else {
            if (this.state.scoreboard.left >= this.winningScore || this.state.scoreboard.right >= this.winningScore) {
                this.state.gameStatus = game_serverSchema_1.GameStatus.FINISHED;
                let winnerMessage = 'Good Job *** You WON *** !';
                let looserMessage = ' *** L O O S E R ***';
                const gameResults = {
                    lpUserId: this.lpUserId,
                    lpScore: this.state.scoreboard.left,
                    rpUserId: this.rpUserId,
                    rpScore: this.state.scoreboard.right,
                };
                if (this.state.scoreboard.left > this.state.scoreboard.right) {
                    this.broadcast('updateWinningScore', { winningScore: this.winningScore });
                    this.broadcast('scoreHistory', gameResults, { except: [this.client1] });
                    this.broadcast('gameFinished', { message: winnerMessage, winnerLogin: this.lpUserName }, { except: [this.client2] });
                    this.broadcast('gameFinished', { message: looserMessage, winnerLogin: this.lpUserName }, { except: [this.client1] });
                }
                else {
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
    async onJoin(client, options) {
        let mapSize = PongRoom_1.roomPlayerInfosMap.size;
        if (this.roomLocked) {
            return;
        }
        if (this.clients.length === 1 && options.loginName !== undefined) {
            this.client1 = client;
            this.lpId = client.id;
            this.lpUserName = options.username;
            this.lpUserId = options.id;
            const userInfos = {
                roomId: this.roomId,
                username: options.username,
                login: options.loginName,
                id: options.id,
                clientId: client.sessionId,
                client: client,
            };
            user_service_1.UserService.inGameUsersSet.add(this.lpUserId);
            PongRoom_1.roomPlayerInfosMap.set(1, userInfos);
        }
        else if (this.clients.length === 2 && options.loginName !== undefined) {
            this.client2 = client;
            this.rpId = client.id;
            this.rpUserName = options.username;
            this.rpUserId = options.id;
            const userInfos = {
                roomId: this.roomId,
                username: options.username,
                login: options.loginName,
                id: options.id,
                clientId: client.sessionId,
                client: client,
            };
            if (userInfos.id != this.lpUserId) {
                user_service_1.UserService.inGameUsersSet.add(this.rpUserId);
                PongRoom_1.roomPlayerInfosMap.set(2, userInfos);
                PongRoom_1.roomPlayerInfosMap.clear();
                this.lockRoomAndStartGame(options.loginName);
            }
            else if (userInfos.id === this.lpUserId) {
                this.state.gameStatus = game_serverSchema_1.GameStatus.STOPSOLO;
            }
        }
        this.handlePlayerDisconnection();
    }
    lockRoomAndStartGame(loginName) {
        this.roomLocked = true;
        this.lock();
        this.state.gameStatus = game_serverSchema_1.GameStatus.PLAYING;
        const intervalFor80FPS = 12.5;
        this.setSimulationInterval(deltaTime => this.update(deltaTime, loginName), intervalFor80FPS);
    }
    handlePlayerDisconnection() {
        this.onMessage('player_disconnected', (client, message) => {
            this.onLeave(client);
            this.onDispose();
            PongRoom_1.roomPlayerInfosMap.clear();
            client.leave();
        });
    }
    async onLeave(client, consented) {
        if (client.id === this.lpId) {
            this.lpId = undefined;
        }
        else if (client.id === this.rpId) {
            this.rpId = undefined;
        }
        if (!this.lpId || !this.rpId) {
            if (this.state.gameStatus !== game_serverSchema_1.GameStatus.FINISHED) {
                this.state.gameStatus = game_serverSchema_1.GameStatus.FINISHED;
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
                };
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
    }
};
exports.PongRoom = PongRoom;
PongRoom.roomPlayerInfosMap = new Map();
exports.PongRoom = PongRoom = PongRoom_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.DEFAULT })
], PongRoom);
//# sourceMappingURL=game.room.js.map