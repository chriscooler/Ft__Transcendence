import { Schema, type } from '@colyseus/schema';
import { paddleSize, winnerScore, actualUsername, InvitedUserLogin } from '$lib/store/store';

// Dimensions of the game area
export const GameDimensions = {
	width: 1280,
	height: 720,
}
// Calculate the center of the game area
const center = {
	x: Math.round(GameDimensions.width / 2),
	y: Math.round(GameDimensions.height / 2),
}
// Define which side a paddle can be on
enum PaddleSide {
	LEFT = 0,
	RIGHT,
}

// wriable paddle size
let paddleSizeChoice: string = 'normal';

paddleSize.subscribe((a) => {
	paddleSizeChoice = a;
	// console.log("Game schema [paddleSizeChoice] :", paddleSizeChoice);
})

export class Paddle extends Schema {
	// Constants for the paddle dimensions and offsets
	public static offset: number;
	public static width: number; //default width
	public static height: number // default height;
	public static widthFactor: number;
	public static heightFactor: number;

	// x and y coordinates of the paddle
	@type('int32')
	public x: number;
	// Initialize to the center y-coordinate
	@type('int32')
	public y = center.y;

	constructor(private side: PaddleSide, private paddleSize: string) {
		super();
		this.paddleSize = paddleSizeChoice;
		this.initialize();
	}

	// Reset method
	public reset() {
		this.initialize();
	}

	public initialize() {

		const actualOffset = Paddle.width / 2 + Paddle.offset;
		switch (this.side) {
			case PaddleSide.LEFT:
				this.x = actualOffset;
				break;

			case PaddleSide.RIGHT:
				this.x = GameDimensions.width - actualOffset;
				break;
		}
		this.y = center.y; // Reset to center position
	}
}

export class Ball extends Schema {
	public static readonly radius = 12;

	@type('int32')
	public x = center.x;

	@type('int32')
	public y = center.y;

	public reset() {
		this.center();
	}
	public center() {
		this.x = center.x;
		this.y = center.y;
	}
}

export class Scoreboard extends Schema {
	@type('int8')
	public left = 0;

	@type('int8')
	public right = 0;

	public reset() {
		this.left = 0;
		this.right = 0;
	}
}

export enum GameStatus {
	WAITING = 0,
	PLAYING,
	FINISHED,
	INTERRUPTED,
	STOPSOLO,
}

export class GameState extends Schema {
	@type('int8')
	public gameStatus = GameStatus.WAITING;

	@type(Scoreboard)
	public scoreboard = new Scoreboard();

	@type(Paddle)
	public leftPaddle = new Paddle(PaddleSide.LEFT);

	@type(Paddle)
	public rightPaddle = new Paddle(PaddleSide.RIGHT);

	@type(Ball)
	public ball = new Ball();

	public username: string = "john";
	public scoreToWin: number;
	public userLoginToInvite: string;

	constructor() {
		super();

		actualUsername.subscribe((a) => {
			this.username = a;
		});

		winnerScore.subscribe((a) => {
			this.scoreToWin = a;
		});

		InvitedUserLogin.subscribe((a) => {
			this.userLoginToInvite = a;
		});
	}
}