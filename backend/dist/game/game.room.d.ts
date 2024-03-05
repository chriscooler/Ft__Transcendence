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
}
export declare class PongRoom extends Room<GameState> {
    static roomPlayerInfosMap: Map<number, UserInfos>;
    maxClients: number;
    private client1;
    private client2;
    private physics;
    lpId: any;
    rpId: any;
    lpUserName: string;
    rpUserName: string;
    lpUserId: number;
    rpUserId: number;
    private winningScore;
    private roomLocked;
    onCreate(options: any): void;
    private update;
    onJoin(client: Client, options: any): Promise<void>;
    private lockRoomAndStartGame;
    private handlePlayerDisconnection;
    onLeave(client: Client, consented?: boolean): Promise<void>;
    onDispose(): void;
}
