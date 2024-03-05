import { UserService } from './user.service';
import { UserEntity } from './orm/user.entity';
import { JwtService } from '@nestjs/jwt';
export declare class UserController {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    profile(req: any, res: any): Promise<void>;
    profileOther(username: string, req: any, res: any): Promise<void>;
    sendFriendRequest(req: any): Promise<void>;
    refuseFriendRequest(req: any): Promise<void>;
    addNewFriendship(req: any): Promise<void>;
    removeFriendship(req: any): Promise<void>;
    getPendingList(req: any, res: any): Promise<void>;
    getfriendList(req: any, res: any): Promise<void>;
    getRequestsList(req: any, res: any): Promise<void>;
    incrementWinner(req: any): Promise<void>;
    incrementLooser(req: any): Promise<void>;
    enterGame(req: any): Promise<void>;
    leaveGame(req: any): Promise<void>;
    getInGameUsersList(req: any, res: any): Promise<void>;
    matchHistory(req: any): Promise<void>;
    getMatchHistoryList(req: any, res: any): Promise<void>;
    blockAUser(req: any): Promise<void>;
    unblockUser(req: any): Promise<void>;
    getBlockUserList(req: any, res: any): Promise<void>;
    getBlockedByUserList(req: any, res: any): Promise<void>;
    find_all_users(): Promise<UserEntity[]>;
}
