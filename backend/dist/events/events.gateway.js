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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const direct_message_service_1 = require("../direct_message/direct_message.service");
const chat_service_1 = require("../chat/chat.service");
const user_service_1 = require("../users/user.service");
const bcrypt = require("bcryptjs");
const websockets_1 = require("@nestjs/websockets");
const dotenv = require("dotenv");
dotenv.config();
let EventsGateway = class EventsGateway {
    constructor(userService, directMessageService, chatService) {
        this.userService = userService;
        this.directMessageService = directMessageService;
        this.chatService = chatService;
        this.socketsByUserID = new Map();
        this.userIdFindHelper = new Map();
        this.idByClientIdMap = new Map();
        this.onlineUsersMap = new Map();
    }
    afterInit(server) {
    }
    async handleConnection(client) {
        try {
            const connected = this.socketsByUserID.get(client.handshake.query.id);
            if (connected) {
                this.socketsByUserID.delete(connected.id);
                connected.disconnect();
            }
            this.socketsByUserID.set(client.handshake.query.id, client);
            this.userIdFindHelper.set(client.id, client.handshake.query.id);
            const id = parseInt(client.handshake.query.id[0], 10);
            this.idByClientIdMap.set(client.id, id);
            if (!this.onlineUsersMap.has(id)) {
                const user = await this.userService.find_user_by_id(id);
                this.onlineUsersMap.set(id, user);
                const usersDatas = [];
                for (const [id, user] of this.onlineUsersMap) {
                    const usr = await this.userService.find_user_by_id(user.id);
                    usersDatas.push({ id: usr.id, login: usr.login, username: usr.userName, avatar: usr.avatar });
                }
                this.server.emit('onlineUsersUpdate', usersDatas);
            }
        }
        catch (e) { }
    }
    async handleDisconnect(client) {
        try {
            this.socketsByUserID.delete(this.userIdFindHelper.get(client.id));
            this.userIdFindHelper.delete(client.id);
            const id = this.idByClientIdMap.get(client.id);
            this.idByClientIdMap.delete(client.id);
            this.onlineUsersMap.delete(id);
            const usersDatas = [];
            for (const [id, user] of this.onlineUsersMap) {
                const usr = await this.userService.find_user_by_id(user.id);
                usersDatas.push({ id: usr.id, login: usr.login, username: usr.userName, avatar: usr.avatar });
            }
            this.server.emit('onlineUsersUpdate', usersDatas);
        }
        catch (e) { }
    }
    async sendOnlineUsersDatas(client) {
        try {
            const usersDatas = [];
            for (const [id, user] of this.onlineUsersMap) {
                const usr = await this.userService.find_user_by_id(user.id);
                usersDatas.push({ id: usr.id, login: usr.login, username: usr.userName, avatar: usr.avatar });
            }
            client.emit('onlineUsersDatas', usersDatas);
        }
        catch (e) { }
    }
    async changeUsername(client) {
        try {
            const usersDatas = [];
            for (const [id, user] of this.onlineUsersMap) {
                const usr = await this.userService.find_user_by_id(user.id);
                usersDatas.push({ id: usr.id, login: usr.login, username: usr.userName, avatar: usr.avatar });
            }
            this.server.emit('onlineUsersUpdate', usersDatas);
        }
        catch (e) { }
    }
    async resetAvatar(client, data) {
        try {
            const user = await this.userService.find_user_by_login(data.login);
            await this.userService.reset_avatar(user.id);
            const userUpdate = await this.userService.find_user_by_login(data.login);
            client.emit('updateAvatar', { avatar: userUpdate.avatar });
        }
        catch (e) { }
    }
    async sendFriendRequest(client, data) {
        try {
            const moi = await this.userService.find_user_by_id(data.myId);
            await this.userService.sendFriendRequest(moi.login, data.otherLogin);
            const friend = await this.userService.find_user_by_login(data.otherLogin);
            const friendnewPendingList = await this.userService.getPendingList(friend.id);
            let friendClient = this.socketsByUserID.get(friend.id.toString());
            friendClient.emit('pendingListUpdate', friendnewPendingList);
            const myNewRequestedList = await this.userService.getSentRequestsList(data.myId);
            client.emit('sentRequestsListUpdate', myNewRequestedList);
        }
        catch (e) { }
    }
    async acceptFriendRequest(client, data) {
        try {
            const mynewPendingList = await this.userService.getPendingList(data.myId);
            client.emit('pendingListUpdate', mynewPendingList);
            const friend = await this.userService.find_user_by_id(data.idToAccept);
            const friendNewRequestList = await this.userService.getSentRequestsList(friend.id);
            let friendClient = this.socketsByUserID.get(friend.id.toString());
            friendClient.emit('sentRequestsListUpdate', friendNewRequestList);
        }
        catch (e) { }
    }
    async updateFriendList(client, data) {
        try {
            const friend = await this.userService.find_user_by_id(data.idToAccept);
            const friendnewFriendList = await this.userService.getFriendsList(friend.id);
            let friendClient = this.socketsByUserID.get(friend.id.toString());
            friendClient.emit('friendListUpdate', friendnewFriendList);
            const myNewFriendList = await this.userService.getFriendsList(data.myId);
            client.emit('friendListUpdate', myNewFriendList);
        }
        catch (e) { }
    }
    async getLeaderBoard(client) {
        try {
            const leaderBoard = await this.userService.getLeaderBoard();
            this.server.emit('updateLeaderBoard', leaderBoard);
        }
        catch (e) { }
    }
    async getOtherGameHstory(client, data) {
        try {
            const user = await this.userService.find_user_by_id(data.otherId);
            const gameHistoryData = await this.userService.getMatchHistory(user);
            client.emit('otherGameHistory', gameHistoryData);
        }
        catch (e) { }
    }
    async enterGame(client, data) {
        try {
            const inGameUsersList = await this.userService.getInGameUsers();
            this.server.emit('inGameFriendUpdate', inGameUsersList);
        }
        catch (e) { }
    }
    async sendGameInvitation(client, data) {
        try {
            let wsClient = this.socketsByUserID.get(data.idToInvite.toString());
            wsClient.emit('receivedGameInvitation', data);
        }
        catch (e) { }
    }
    async refuseGameInvitation(client, data) {
        try {
            let wsClient = this.socketsByUserID.get(data.id.toString());
            wsClient.emit("refuseCloseGame", data);
        }
        catch (e) { }
    }
    invitationUpdate(client, data) {
        try {
            let friendClient = this.socketsByUserID.get(data.idToInvite.toString());
            friendClient.emit('updateInvitation');
        }
        catch (e) { }
    }
    async getDmRooms(client) {
        try {
            let str = this.userIdFindHelper.get(client.id);
            let num = +str;
            let a = await this.directMessageService.findAllRoomsForUser(num);
            client.emit('repDmRooms', {
                rooms: a
            });
        }
        catch (e) { }
    }
    async getDmRoomMessages(client, roomId) {
        try {
            let a = await this.directMessageService.findAllMessagesForRoom(roomId);
            client.emit('repMessagesInDmRooms', {
                messages: a
            });
        }
        catch (e) { }
    }
    async sendMessage(client, data) {
        try {
            if (!data || typeof data.sendBy === 'undefined' || typeof data.sendTo === 'undefined') {
                console.error('Missing data in sendMessage:', data);
                return;
            }
            let a = await this.directMessageService.sendMessage(data.sendBy, data.sendTo, data.message);
            const userOne = this.socketsByUserID.get(data.sendBy.toString());
            const userTwo = this.socketsByUserID.get(data.sendTo.toString());
            if (userOne) {
                userOne.emit('newMessagedm', {
                    messages: a
                });
            }
            if (userTwo) {
                userTwo.emit('newMessagedm', {
                    messages: a,
                    alert: true
                });
            }
        }
        catch (e) { }
    }
    async sendMessageN(client, data) {
        try {
            const sendTo = await this.userService.find_user_by_login(data.sendTo);
            data.sendTo = sendTo.id;
            let a = await this.directMessageService.sendMessage(data.sendBy, data.sendTo, data.message);
            const userOne = this.socketsByUserID.get(data.sendBy.toString());
            const userTwo = this.socketsByUserID.get(data.sendTo.toString());
            if (userOne) {
                userOne.emit('newMessagedm', {
                    messages: a
                });
            }
            if (userTwo) {
                userTwo.emit('newMessagedm', {
                    messages: a
                });
            }
        }
        catch (e) { }
    }
    async getChatRooms(client) {
        try {
            let str = this.userIdFindHelper.get(client.id);
            let num = +str;
            let a = await this.chatService.listAllRooms();
            client.join('1');
            this.server.to('1').emit('repChatRooms', {
                rooms: a
            });
        }
        catch (e) { }
    }
    async sendChatRooms(client, data) {
        try {
            const tittle = data.title;
            const user = data.usere;
            const title = data.title;
            const isPrivate = data.isPrivate;
            let password = data.password;
            const userId = data.IdduUser;
            let hashedPassword;
            const roomExists = await this.chatService.doesRoomExist(tittle);
            if (roomExists) {
                client.emit("roomCreationError", { error: "Room with this name already exists" });
                return;
            }
            const userOne = this.socketsByUserID.get(this.userIdFindHelper.get(client.id));
            if (isPrivate && password) {
                const saltRounds = 10;
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
        }
        catch (e) { }
    }
    async getMessagesInChatRoom(client, id) {
        try {
            let str = this.userIdFindHelper.get(client.id);
            let user = await this.userService.find_user_by_id(str);
            const roomMembers = await this.chatService.findMembersByRoomId(id);
            if (await this.chatService.eligibleMember(str, id)) {
                let messages = await this.chatService.listMessages(id);
                const blockedMembersLogins = roomMembers.filter(member => member.user.blockedUser && member.user.blockedUser.includes(user.login)).map(member => member.user.login);
                const blockedByMembersLogins = roomMembers.filter(member => member.user.blockedBy && member.user.blockedBy.includes(user.login)).map(member => member.user.login);
                client.emit('repMessagesInChatRoom', {
                    messages: messages,
                    blockedMembers: blockedMembersLogins,
                    blockedByMembers: blockedByMembersLogins
                });
            }
        }
        catch (error) {
        }
    }
    async sendMessageChannel(client, payload) {
        try {
            const { message, sendBy, sendBylogin, sendTo } = payload;
            const roomMembers = await this.chatService.findMembersByRoomId(sendTo);
            const blockedMembersLogins = roomMembers.filter(member => member.user.blockedUser && member.user.blockedUser.includes(sendBylogin)).map(member => member.user.login);
            const blockedByMembersLogins = roomMembers.filter(member => member.user.blockedBy && member.user.blockedBy.includes(sendBylogin)).map(member => member.user.login);
            if (this.chatService.eligibleMember(sendBy.id, sendTo)) {
                const savedMessage = await this.chatService.sendMessage(message, sendBy, sendBylogin, sendTo);
                this.server.to(sendTo).emit('newMessage', {
                    savedMessage: savedMessage,
                    blockedMembers: blockedMembersLogins,
                    blockedByMembers: blockedByMembersLogins
                });
            }
        }
        catch (error) {
            client.emit('messageSendError', { message: error.message });
        }
    }
    async joinChatRoom(client, payload) {
        try {
            const { user, room, role } = payload;
            const newMember = await this.chatService.joinChatRoom(user, room, role);
            if (this.chatService.eligibleMember(payload.user.id, payload.room.id)) {
                client.join(payload.room.id);
            }
            if (newMember) {
                this.server.to(payload.room.id).emit('joinedChatRoom', { success: true, room: newMember.chatRoom, user: newMember.user, role: newMember.role });
            }
        }
        catch (error) {
            client.emit('joinedChatRoomError', { success: false, error: error.message });
        }
    }
    async getRoomIdChatRoom(client, roomTitle) {
        try {
            let a = await this.chatService.findRoomIdByTitle(roomTitle);
            client.emit('repRoomIdChatRoom', {
                id: a,
            });
        }
        catch (e) { }
    }
    async handleGetsMembersInRoom(client, roomId) {
        try {
            const members = await this.chatService.findMembersByRoomId(roomId);
            const memberLogins = members.map(member => ({ user: member.user, role: member.role }));
            client.emit('membersList', {
                members: memberLogins,
            });
        }
        catch (error) {
            client.emit('membersListError', { message: error.message });
        }
    }
    async handleMuteUser(client, payload) {
        try {
            const { user, roomId, login, duration } = payload;
            const userToMute = await this.userService.find_user_by_login(login);
            const members = await this.chatService.findMembersByRoomId(roomId);
            const isOwner = members.some(member => (member.role === 'Owner' || member.role === 'Admin') && member.user.id === user.id);
            if (!isOwner) {
                throw new common_1.BadRequestException('Only the room owner or admins can mute users');
            }
            else {
                const member = await this.chatService.findMemberInChatRoom(userToMute.id, roomId);
                member.isMuted = true;
                member.mutedTime = new Date();
                member.mutedDuration = duration;
                await this.chatService.updateMember(member);
                const userSocket = this.socketsByUserID.get(userToMute.id.toString());
                if (userSocket) {
                    userSocket.emit('mutedFromRoom', { roomId, duration });
                }
            }
        }
        catch (error) {
            client.emit('muteError', { message: error.message });
        }
    }
    async handleKickUser(client, payload) {
        try {
            const { user, roomId, login, duration } = payload;
            const userToKick = await this.userService.find_user_by_login(login);
            const room = await this.chatService.findChatRoom(roomId);
            if (!room) {
                throw new common_1.BadRequestException('Room not found');
            }
            const members = await this.chatService.findMembersByRoomId(roomId);
            const isOwner = members.some(member => (member.role === 'Owner' || member.role === 'Admin') && member.user.id === user.id);
            if (!isOwner) {
                throw new common_1.BadRequestException('Only the room owner or admins can kick users');
            }
            else {
                const member = await this.chatService.findMemberInChatRoom(userToKick.id, roomId);
                member.isKicked = true;
                member.kickedTime = new Date();
                member.kickDuration = duration;
                await this.chatService.updateMember(member);
                const userSocket = this.socketsByUserID.get(userToKick.id.toString());
                if (userSocket) {
                    userSocket.emit('kickedFromRoom', { roomId, duration });
                }
            }
        }
        catch (error) {
            client.emit('kickError', { message: error.message });
        }
    }
    async handleBanUser(client, payload) {
        try {
            const { user, roomId, login } = payload;
            const userToBan = await this.userService.find_user_by_login(login);
            const userIdToBan = userToBan.id;
            const room = await this.chatService.findChatRoom(roomId);
            if (!room) {
                throw new common_1.BadRequestException('Room not found');
            }
            const members = await this.chatService.findMembersByRoomId(roomId);
            const isOwner = members.some(member => (member.role === 'Owner' || member.role === 'Admin') && member.user.id === user.id);
            if (!isOwner) {
                throw new common_1.BadRequestException('Only the room owner or admins can ban users');
            }
            if (!room.bannedUsers) {
                room.bannedUsers = [];
            }
            room.bannedUsers.push(userToBan);
            const roome = await this.chatService.updateRoome(room);
            const member = await this.chatService.findMemberInChatRoom(userToBan.id, roomId);
            member.isBanned = true;
            await this.chatService.updateMember(member);
            const userSocket = this.socketsByUserID.get(userIdToBan.toString());
            if (userSocket) {
                userSocket.emit('bannedFromRoom', { roomId });
                userSocket.leave(roomId);
            }
        }
        catch (error) {
            client.emit('banError', { message: error.message });
        }
    }
    async handleCheckUserBan(client, payload) {
        try {
            const { userId, roomId } = payload;
            const isBanned = await this.chatService.isUserBanned(userId, roomId);
            client.emit('userBanStatus', { isBanned });
        }
        catch (error) {
            client.emit('banCheckError', { message: error.message });
        }
    }
    async handleCheckUserStatus(client, payload) {
        try {
            const { userId, roomId } = payload;
            const isBanned = await this.chatService.isUserBanned(userId, roomId);
            const member = await this.chatService.findMemberInChatRoom(userId, roomId);
            const kickEndTime = member.kickedTime ? member.kickedTime.getTime() + member.kickDuration * 60 * 1000 : 0;
            const muteEndTime = member.mutedTime ? member.mutedTime.getTime() + member.mutedDuration * 60 * 1000 : 0;
            client.emit('userStatus', { isBanned, kickEndTimes: { [roomId]: kickEndTime }, muteEndTimes: { [roomId]: muteEndTime } });
        }
        catch (error) {
            client.emit('statusCheckError', { message: error.message });
        }
    }
    async leaveChatRoom(client, payload) {
        try {
            const { user, room } = payload;
            await this.chatService.leaveeChatRoom(user, room);
            const memberes = await this.chatService.findMembersByRoomId(room.id);
            const isOwner = memberes.some(member => (member.role === 'Owner') && member.user.id === user.id);
            if (isOwner) {
                const second = memberes.some(membr => membr.role === 'Admin');
                if (second) {
                    const done = await this.chatService.makeOwner(room);
                    if (done) {
                    }
                }
                else {
                    this.server.to('1').emit("chatRoomDeleted", { success: true, room });
                    await this.chatService.deleteRoom(room);
                }
            }
            client.leave(room.id);
            this.server.to(room.id).emit('leftChatRoom', { success: true, room: room, user: user });
            client.emit('leftChatRoomSuccess', { success: true, room: room });
            const membr = await this.chatService.findMemberInChatRoom(user.id, room.id);
            if (membr) {
                await this.chatService.deleteMember(membr);
            }
        }
        catch (error) {
            client.emit('leftChatRoomError', { success: false, error: error.message });
        }
    }
    async handlemakeAdmin(client, payload) {
        try {
            const { user, roomId, login } = payload;
            const userToAd = await this.userService.find_user_by_login(login);
            const userIdToAd = userToAd.id;
            const room = await this.chatService.findChatRoom(roomId);
            if (!room) {
                throw new common_1.BadRequestException('Room not found');
            }
            const members = await this.chatService.findMembersByRoomId(roomId);
            const isOwner = members.some(member => (member.role === 'Owner' || member.role === 'Admin') && member.user.id === user.id);
            if (!isOwner) {
                throw new common_1.BadRequestException('Only the room owner or admins can Adminning users');
            }
            else {
                const member = await this.chatService.findMemberInChatRoom(userIdToAd, roomId);
                member.role = 'Admin';
                await this.chatService.updateMember(member);
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
    async handleUnbanUser(client, payload) {
        try {
            const { user, roomId, userId } = payload;
            const userToUnBan = await this.userService.find_user_by_login(userId);
            const members = await this.chatService.findMembersByRoomId(roomId);
            const isOwner = members.some(member => (member.role === 'Owner' || member.role === 'Admin') && member.user.id === user.id);
            if (!isOwner) {
                throw new common_1.BadRequestException('Only the room owner or admins can unban users');
            }
            const member = await this.chatService.findMemberInChatRoom(userToUnBan.id, roomId);
            member.isBanned = false;
            await this.chatService.updateMember(member);
            await this.chatService.unbanUser(userToUnBan.id, roomId);
            client.emit('userUnbanned', { userId, roomId });
        }
        catch (error) {
            client.emit('unbanError', { message: error.message });
        }
    }
    async passChatRoom(client, payload) {
        try {
            const { user, room, newPassword } = payload;
            const members = await this.chatService.findMembersByRoomId(room.id);
            const isOwner = members.some(member => member.role === 'Owner' && member.user.id === user.id);
            if (!isOwner) {
                throw new common_1.BadRequestException('Only the room owner can change the password');
            }
            const updatedRoom = await this.chatService.updateRoomPassword(room.id, newPassword);
            this.server.to('1').emit('roomUpdated', updatedRoom);
            client.emit('passwordChangeSuccess', { message: 'Password updated successfully!' });
        }
        catch (error) {
            throw new websockets_1.WsException(`Error updating password: ${error.message}`);
        }
    }
    async cancelpassChatRoom(client, payload) {
        try {
            const { user, room } = payload;
            const members = await this.chatService.findMembersByRoomId(room.id);
            const isOwner = members.some(member => member.role === 'Owner' && member.user.id === user.id);
            if (!isOwner) {
                throw new common_1.BadRequestException('Only the room owner can change the password');
            }
            const updatedRoom = await this.chatService.cancelRoomPassword(room.id);
            this.server.to('1').emit('roomUpdated', updatedRoom);
            client.emit('passwordChangeSuccess', { message: 'Password updated successfully!' });
        }
        catch (error) {
            throw new websockets_1.WsException(`Error updating password: ${error.message}`);
        }
    }
    async handleMessage(client, username) {
        try {
            const userData = await this.userService.find_user_by_userName(username);
            if (!userData) {
                throw new Error('User not found.');
            }
            client.emit('userResponse', { username: username, user: userData });
        }
        catch (error) {
            client.emit('messageError', { message: error.message });
        }
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('getOnlineUsersDatas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "sendOnlineUsersDatas", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('changeUsername'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "changeUsername", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('resetAvatar'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "resetAvatar", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('SendFriendRequest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "sendFriendRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('acceptOrRefuseFriendRequest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "acceptFriendRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateFriendList'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "updateFriendList", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getLeaderBoard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "getLeaderBoard", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getOtherGameHistory'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "getOtherGameHstory", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('inGameUpdate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "enterGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendGameInvitation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "sendGameInvitation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('refuseGameInvitation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "refuseGameInvitation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('cancelInvitation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "invitationUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getDmRooms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "getDmRooms", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getMessagesInDmRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "getDmRoomMessages", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "sendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessageN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "sendMessageN", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getChatRooms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "getChatRooms", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendChatRooms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "sendChatRooms", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getMessagesInChatRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "getMessagesInChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessageChannel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "sendMessageChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinChatRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "joinChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('roomIdChatRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "getRoomIdChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getsMembersInRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleGetsMembersInRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('muteUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleMuteUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('kickUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleKickUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('banUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleBanUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('checkUserBan'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleCheckUserBan", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('CheckUserStatus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleCheckUserStatus", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveChatRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "leaveChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('makeAdmin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handlemakeAdmin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unbanUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleUnbanUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('passChatRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "passChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('cancelpassChatRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "cancelpassChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleMessage", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)(3002, {
        cors: {
            origin: `http://${process.env.HOST}:5173`,
            methods: ['GET', 'POST'],
            credentials: true
        }
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        direct_message_service_1.DirectMessageService,
        chat_service_1.ChatService])
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map