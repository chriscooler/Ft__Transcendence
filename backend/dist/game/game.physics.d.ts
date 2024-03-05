import { Ball, Paddle } from "./game.serverSchema";
export declare enum PaddleDirection {
    UP = 0,
    DOWN = 1,
    STOP = 2
}
export interface PhysicsOptions {
    ballSpeed: number;
    paddleSpeed: number;
    ballAngle: number;
}
export declare class Physics {
    private ball;
    private lp;
    private rp;
    private lpDirection;
    private rpDirection;
    paddleSpeed: number;
    private angle;
    private ballSpeed;
    private xSpeed;
    private ySpeed;
    constructor(ball: Ball, leftPaddle: Paddle, rightPaddle: Paddle, options?: PhysicsOptions, speed?: number);
    setAngle(angle: number): void;
    getAngle(): number;
    setLeftPaddleDirection(direction: PaddleDirection): void;
    getLeftPaddleDirection(): PaddleDirection;
    setRightPaddleDirection(direction: PaddleDirection): void;
    getRightPaddleDirection(): PaddleDirection;
    private leftPaddleCollision;
    private rightPaddleCollision;
    private topBottomCollision;
    checkRightWall(): boolean;
    checkLeftWall(): boolean;
    private movePaddle;
    update(deltaTime: number): void;
}
