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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const jwt_1 = require("@nestjs/jwt");
let UserController = class UserController {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async profile(req, res) {
        try {
            const headers = req.headers;
            const Token = req.headers.authorization;
            const [, jwtToken] = Token.split(' ');
            const jwt = this.jwtService.decode(jwtToken);
            const user = await this.userService.find_user_by_id(jwt.id);
            res.json(user);
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async profileOther(username, req, res) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
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
                };
                res.json(user);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async sendFriendRequest(req) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                const friendUsername = req.body.data.username;
                await this.userService.sendFriendRequest(decoded.login, friendUsername);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async refuseFriendRequest(req) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                const friendId = req.body.data.idToRefuse;
                const user2login = await this.userService.find_user_by_id(friendId);
                const user1username = await this.userService.find_user_by_login(decoded.login);
                await this.userService.clearUpdatePendingAndRequestList(user1username.userName, user2login.login);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async addNewFriendship(req) {
        try {
            const token = await req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                const friendId = await req.body.data.idToAccept;
                await this.userService.addFriend(decoded.login, friendId);
                const user2login = await this.userService.find_user_by_id(friendId);
                const user1username = await this.userService.find_user_by_login(decoded.login);
                await this.userService.clearUpdatePendingAndRequestList(user1username.userName, user2login.login);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async removeFriendship(req) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                const friendId = req.body.data.idToRemove;
                const friend = await this.userService.find_user_by_id(friendId);
                const friendUsername = friend.userName;
                await this.userService.removeFriend(decoded.login, friendUsername);
                const user2login = await this.userService.find_user_by_userName(friendUsername);
                const user1username = await this.userService.find_user_by_login(decoded.login);
                await this.userService.removeFriend(user2login.login, user1username.userName);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async getPendingList(req, res) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                const pendingList = await this.userService.getPendingList(decoded.id);
                res.json(pendingList);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async getfriendList(req, res) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                const friendsList = await this.userService.getFriendsList(decoded.id);
                res.json(friendsList);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async getRequestsList(req, res) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                const sentRequestsList = await this.userService.getSentRequestsList(decoded.id);
                res.json(sentRequestsList);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async incrementWinner(req) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                await this.userService.incrementRankAndTitle(decoded.id);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async incrementLooser(req) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                await this.userService.incrementLost(decoded.id);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async enterGame(req) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                await this.userService.add_inGameUser(decoded.id);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async leaveGame(req) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                await this.userService.remove_inGameUser(decoded.id);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async getInGameUsersList(req, res) {
        try {
            const inGameList = await this.userService.getInGameUsers();
            res.json(inGameList);
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async matchHistory(req) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                const history = req.body.data;
                await this.userService.register_MatchHistory(history);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async getMatchHistoryList(req, res) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                const user = await this.userService.find_user_by_id(decoded.id);
                const matchHistoryList = await this.userService.getMatchHistory(user);
                res.json(matchHistoryList);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async blockAUser(req) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                const usernameToBlock = req.body.data.username;
                this.userService.blockUser(decoded.login, usernameToBlock);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async unblockUser(req) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                const usernameToUnblock = req.body.data.username;
                this.userService.unblockUser(decoded.login, usernameToUnblock);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async getBlockUserList(req, res) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                const blockUserList = await this.userService.getUsersIBlockList(decoded.id);
                res.json(blockUserList);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    async getBlockedByUserList(req, res) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const jwt = token.replace('Bearer', '').trim();
                const decoded = this.jwtService.decode(jwt);
                const blockedByList = await this.userService.getUsersWhoBlockedMeList(decoded.id);
                res.json(blockedByList);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
    find_all_users() {
        try {
            return this.userService.find_all_users();
        }
        catch (e) {
            throw new common_1.UnauthorizedException;
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "profile", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('profileOther'),
    __param(0, (0, common_1.Query)('username')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "profileOther", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('sendFriendRequest'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendFriendRequest", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('refuseFriendRequest'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refuseFriendRequest", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('addFriend'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addNewFriendship", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('removeFriend'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeFriendship", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('pendingList'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPendingList", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('friendsList'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getfriendList", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('sentRequestsList'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getRequestsList", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('increment'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "incrementWinner", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('incrementLooser'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "incrementLooser", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('enterGame'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "enterGame", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('leaveGame'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "leaveGame", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('inGameUsers'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getInGameUsersList", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('matchHistory'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "matchHistory", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('getMatchHistory'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMatchHistoryList", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('blockUser'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "blockAUser", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('unblockUser'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unblockUser", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('blockUserList'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getBlockUserList", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('blockedByList'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getBlockedByUserList", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "find_all_users", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], UserController);
//# sourceMappingURL=user.controller.js.map