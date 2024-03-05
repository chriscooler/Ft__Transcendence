import { UserEntity } from "./user.entity";
export declare class GameEntity {
    id: number;
    player1: UserEntity;
    player2: UserEntity;
    player1Score: number;
    player2Score: number;
    date: Date;
}
