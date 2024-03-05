"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./orm/user.entity");
const game_entity_1 = require("./orm/game.entity");
const otplib = require("otplib");
const qrcode = require("qrcode");
let UserService = UserService_1 = class UserService {
    constructor(userRepository, gameRepository) {
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
    }
    async find_all_users() {
        try {
            return await this.userRepository.find();
        }
        catch (e) { }
    }
    async find_user_by_id(id) {
        try {
            return await this.userRepository.findOne({ where: { id: id } });
        }
        catch (e) { }
    }
    async find_user_by_login(login) {
        try {
            return await this.userRepository.findOne({ where: { login: login } });
        }
        catch (e) { }
    }
    async find_user_by_userName(userName) {
        try {
            return await this.userRepository.findOne({ where: { userName: userName } });
        }
        catch (e) { }
    }
    async find_user_ID_by_userName(userName) {
        try {
            const user = await this.userRepository.findOne({ where: { userName: userName } });
            return user.id;
        }
        catch (e) { }
    }
    async find_user_ID_by_login(login) {
        try {
            const user = await this.userRepository.findOne({ where: { login: login } });
            return user.id;
        }
        catch (e) { }
    }
    async add_new_user(payload) {
        try {
            let user = new user_entity_1.UserEntity();
            user.login = payload.login;
            user.userName = payload.userName;
            user.email = payload.email;
            if (payload.is42) {
                user.is42 = payload.is42;
                user.id42 = payload.id42;
                user.lastName = payload.lastName;
                user.firstName = payload.firstName;
                user.avatar = payload.avatar;
                user.resetAvatar = payload.resetAvatar;
            }
            else if (payload.password) {
                user.hash = payload.password;
                user.hasPassword = true;
            }
            if (payload.refreshToken) {
                user.refreshToken = payload.refreshToken;
            }
            await this.userRepository.save(user);
            const bob = await this.find_user_by_userName(user.userName);
        }
        catch (e) { }
    }
    async change_username(login, newUserName) {
        try {
            await this.userRepository.update({ login }, { userName: newUserName });
            return await this.find_user_by_userName(newUserName);
        }
        catch (e) { }
    }
    async change_avatar(login, newAvatar) {
        try {
            await this.userRepository.update({ login }, { avatar: newAvatar });
            return await this.find_user_by_login(login);
        }
        catch (e) { }
    }
    async reset_avatar(id) {
        try {
            const user = await this.find_user_by_id(id);
            return await this.userRepository.update({ id }, { avatar: user.resetAvatar });
        }
        catch (e) { }
    }
    async enable_2fa(login) {
        try {
            const secret = otplib.authenticator.generateSecret();
            const user = await this.find_user_by_login(login);
            const email = user.email;
            const otpauthUrl = otplib.authenticator.keyuri(email, 'PacPac-Pong_Transcendence', secret);
            const url = await qrcode.toDataURL(otpauthUrl);
            await this.userRepository.update({ login }, { fa2Secret: secret });
            await this.userRepository.update({ login }, { fa2QRCode: url });
            return url;
        }
        catch (e) { }
    }
    async turn_2fa_on(login) {
        try {
            await this.userRepository.update({ login }, { fa2: true });
        }
        catch (e) { }
    }
    async clear2fa(login) {
        try {
            await this.userRepository.update({ login }, { fa2Secret: null });
            await this.userRepository.update({ login }, { fa2QRCode: null });
        }
        catch (e) { }
    }
    async get_QRCode(login) {
        try {
            const user = await this.find_user_by_login(login);
            const url = user.fa2QRCode;
            return url;
        }
        catch (e) { }
    }
    async remove_2fa(login) {
        try {
            await this.userRepository.update({ login }, { fa2: false });
            await this.userRepository.update({ login }, { fa2Secret: null });
            await this.userRepository.update({ login }, { fa2QRCode: null });
        }
        catch (e) { }
    }
    async sendFriendRequest(login, friendLogin) {
        try {
            let requester = await this.find_user_by_login(login);
            let receiver = await this.find_user_by_login(friendLogin);
            if (!requester || !receiver) {
                throw new common_1.BadRequestException('User not found');
            }
            if (!requester.friendRequestsSent.includes(receiver.login)) {
                requester.friendRequestsSent.push(receiver.login);
                await this.userRepository.save(requester);
            }
            if (!receiver.pendindFriendRequests.includes(requester.login)) {
                receiver.pendindFriendRequests.push(requester.login);
                await this.userRepository.save(receiver);
            }
        }
        catch (e) { }
    }
    async addFriend(login, friendId) {
        try {
            let user1 = await this.find_user_by_login(login);
            let user2 = await this.find_user_by_id(friendId);
            if (!user1 || !user2) {
                throw new common_1.BadRequestException('User not found');
            }
            if (!user1.friends.includes(user2.login)) {
                user1.friends.push(user2.login);
                await this.userRepository
                    .createQueryBuilder()
                    .update()
                    .set({ friends: user1.friends })
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
                    .set({ friends: user2.friends })
                    .where("id = :id", { id: user2.id })
                    .execute();
            }
        }
        catch (e) { }
    }
    async clearUpdatePendingAndRequestList(receiver, sender) {
        try {
            let accepter = await this.find_user_by_userName(receiver);
            let requester = await this.find_user_by_login(sender);
            if (!requester || !accepter) {
                throw new common_1.BadRequestException('User not found');
            }
            const pendingFriendIndex = accepter.pendindFriendRequests.indexOf(requester.login);
            if (pendingFriendIndex !== -1) {
                accepter.pendindFriendRequests.splice(pendingFriendIndex, 1);
                await this.userRepository.save(accepter);
            }
            const senderFriendIndex = requester.friendRequestsSent.indexOf(accepter.login);
            if (senderFriendIndex !== -1) {
                requester.friendRequestsSent.splice(senderFriendIndex, 1);
                await this.userRepository.save(requester);
            }
        }
        catch (e) { }
    }
    async removeFriend(login, friendUsername) {
        try {
            let user1 = await this.find_user_by_login(login);
            let user2 = await this.find_user_by_userName(friendUsername);
            if (!user1 || !user2) {
                throw new common_1.BadRequestException('User not found');
            }
            const friendIndex = user1.friends.indexOf(user2.login);
            if (friendIndex !== -1) {
                user1.friends.splice(friendIndex, 1);
                await this.userRepository.save(user1);
            }
        }
        catch (e) { }
    }
    async getPendingList(id) {
        try {
            const user = await this.find_user_by_id(id);
            const loginPendingList = user.pendindFriendRequests;
            let usersPendingList = [];
            for (const login of loginPendingList) {
                const user = await this.find_user_by_login(login);
                usersPendingList.push({ id: user.id, login: user.login, username: user.userName, avatar: user.avatar });
            }
            return usersPendingList;
        }
        catch (e) { }
    }
    async getFriendsList(id) {
        try {
            const user = await this.find_user_by_id(id);
            const loginFriendsList = user.friends;
            let userFriendsList = [];
            for (const login of loginFriendsList) {
                const user = await this.find_user_by_login(login);
                userFriendsList.push({ id: user.id, login: user.login, username: user.userName, avatar: user.avatar });
            }
            return userFriendsList;
        }
        catch (e) { }
    }
    async getSentRequestsList(id) {
        try {
            const user = await this.find_user_by_id(id);
            const loginSentRequestsList = user.friendRequestsSent;
            let usersSentRequestsList = [];
            for (const login of loginSentRequestsList) {
                const user = await this.find_user_by_login(login);
                usersSentRequestsList.push({ id: user.id, login: user.login, username: user.userName, avatar: user.avatar });
            }
            return usersSentRequestsList;
        }
        catch (e) { }
    }
    async blockUser(login, usernameToBlock) {
        try {
            let requester = await this.find_user_by_login(login);
            let receiver = await this.find_user_by_userName(usernameToBlock);
            if (!requester || !receiver) {
                throw new common_1.BadRequestException('User not found');
            }
            if (!requester.blockedUser.includes(receiver.login)) {
                requester.blockedUser.push(receiver.login);
                await this.userRepository.save(requester);
            }
            if (!receiver.blockedBy.includes(requester.login)) {
                receiver.blockedBy.push(requester.login);
                await this.userRepository.save(receiver);
            }
        }
        catch (e) { }
    }
    async unblockUser(login, usernameToUnblock) {
        try {
            let requester = await this.find_user_by_login(login);
            let receiver = await this.find_user_by_userName(usernameToUnblock);
            if (!requester || !receiver) {
                throw new common_1.BadRequestException('User not found');
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
        }
        catch (e) { }
    }
    async getUsersIBlockList(id) {
        try {
            const user = await this.find_user_by_id(id);
            const loginUserBlockedList = user.blockedUser;
            let userBlockList = [];
            for (const login of loginUserBlockedList) {
                const user = await this.find_user_by_login(login);
                userBlockList.push({ id: user.id, login: user.login, username: user.userName, avatar: user.avatar });
            }
            return userBlockList;
        }
        catch (e) { }
    }
    async getUsersWhoBlockedMeList(id) {
        try {
            const user = await this.find_user_by_id(id);
            const loginUserBlockedByList = user.blockedBy;
            let userBlockedByList = [];
            for (const login of loginUserBlockedByList) {
                const user = await this.find_user_by_login(login);
                userBlockedByList.push({ id: user.id, login: user.login, username: user.userName, avatar: user.avatar });
            }
            return userBlockedByList;
        }
        catch (e) { }
    }
    async incrementRankAndTitle(id) {
        try {
            let rank;
            let user = await this.find_user_by_id(id);
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
        }
        catch (e) { }
    }
    async incrementLost(id) {
        try {
            const user = await this.find_user_by_id(id);
            if (user) {
                user.lostGameNbr += 1;
                await this.userRepository.save(user);
            }
        }
        catch (error) { }
    }
    async add_inGameUser(id) {
        try {
            UserService_1.inGameUsersSet.add(id);
        }
        catch (e) { }
    }
    async remove_inGameUser(id) {
        try {
            UserService_1.inGameUsersSet.delete(id);
        }
        catch (e) { }
    }
    async getInGameUsers() {
        try {
            const inGameIdList = Array.from(UserService_1.inGameUsersSet);
            let usersInGameDatas = [];
            const idListLength = inGameIdList.length;
            if (idListLength != 0)
                for (const idUser of inGameIdList) {
                    if (idUser != 0) {
                        const user = await this.find_user_by_id(idUser);
                        usersInGameDatas.push({ id: user.id, login: user.login, username: user.userName, avatar: user.avatar });
                    }
                }
            return usersInGameDatas;
        }
        catch (e) { }
    }
    async register_MatchHistory(data) {
        try {
            const player1 = await this.find_user_by_id(data.lpUserId);
            const player1Score = data.lpScore;
            const player2 = await this.find_user_by_id(data.rpUserId);
            const player2Score = data.rpScore;
            if (player1Score > player2Score) {
                this.incrementRankAndTitle(data.lpUserId);
                this.incrementLost(data.rpUserId);
            }
            else {
                this.incrementRankAndTitle(data.rpUserId);
                this.incrementLost(data.lpUserId);
            }
            const game = new game_entity_1.GameEntity();
            game.player1 = player1;
            game.player2 = player2;
            game.player1Score = player1Score;
            game.player2Score = player2Score;
            await this.gameRepository.save(game);
        }
        catch (e) { }
    }
    async getMatchHistory(user) {
        try {
            const games = await this.gameRepository
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
        }
        catch (e) { }
    }
    async getLeaderBoard() {
        try {
            const users = await this.userRepository.find({ order: { wonGameNbr: 'DESC' } });
            const leaderTab = users
                .slice(0, 3)
                .map(user => ({
                id: user.id,
                login: user.login,
                username: user.userName,
                avatar: user.avatar,
                wonGames: user.wonGameNbr,
            }));
            return leaderTab;
        }
        catch (e) { }
    }
};
exports.UserService = UserService;
UserService.inGameUsersSet = new Set();
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(game_entity_1.GameEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map