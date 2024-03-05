import { Schema } from '@colyseus/schema';
export declare const GameDimensions: {
    width: number;
    height: number;
};
declare enum PaddleSide {
    LEFT = 0,
    RIGHT = 1
}
export declare class Paddle extends Schema {
    private side;
    static readonly offset = 50;
    static readonly width = 40;
    static readonly height = 200;
    x: number;
    y: number;
    constructor(side: PaddleSide);
    reset(): void;
    private initialize;
}
export declare class Ball extends Schema {
    static readonly radius = 12;
    x: number;
    y: number;
    reset(): void;
    center(): void;
}
export declare class Scoreboard extends Schema {
    left: number;
    right: number;
    reset(): void;
}
export declare enum GameStatus {
    WAITING = 0,
    PLAYING = 1,
    FINISHED = 2,
    INTERRUPTED = 3,
    STOPSOLO = 4
}
export declare class GameState extends Schema {
    gameStatus: GameStatus;
    scoreboard: Scoreboard;
    leftPaddle: Paddle;
    rightPaddle: Paddle;
    ball: Ball;
}
export {};
