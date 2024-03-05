import { Room, Client } from 'colyseus';
import { PaddleDirection } from "./game.physics";
import { GameState } from "./game.serverSchema";
export interface PaddleMoveMessage {
    newDirection: PaddleDirection;
}
export interface UserInfos {
    roomId: string;
    username: string;
    login: string;
    id: number;
    clientId: string;
    client: Client;
    idToInvite: number;
    loginToInvite: string;
    speed: number;
    paddleSize: string;
    scoreToWin: number;
    colorMode: string;
}
export declare class privateRoom extends Room<GameState> {
    private static roomPlayerInfosMap;
    maxClients: number;
    private client1;
    private client2;
    private physics;
    lpId: string;
    rpId: string;
    lpUserName: string;
    rpUserName: string;
    lpUserId: number;
    rpUserId: number;
    private winningScore;
    onCreate(options: any): void;
    onJoin(client: Client, options: any): Promise<void>;
    private update;
    onLeave(client: Client, consented?: boolean): Promise<void>;
    onDispose(): void;
}
