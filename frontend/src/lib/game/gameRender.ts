import { Ball, Paddle, GameState, GameStatus, GameDimensions, Scoreboard } from "./game.clientSchema";
import { backgroundColor, paddleSize } from "$lib/store/store";
import { goto } from "$app/navigation";

// Constants for background and paddle colors
const BackgroundColors: any = {
    blue: 'rgb(65, 135, 225)',
    orange: 'rgb(255, 143, 31)',
    green: 'rgb(0, 100, 0)',
    default: 'rgb(0, 100, 0)',
};

const PaddleColors: any = {
    blue: 'green',
    orange: 'white',
    green: 'rgb(255, 95, 31)',
    default: 'rgb(255, 95, 31)',
};

//Game writable 
let backgroundColorChoice: string;
backgroundColor.subscribe((a) => {
    backgroundColorChoice = a;
    // console.log("gameRender:", backgroundColorChoice);
});

let paddleSizeChoice: string;
paddleSize.subscribe((a) => {
    paddleSizeChoice = a;
    // console.log("paddleSizeChoice :", paddleSizeChoice);
})

export function drawTextCenter(ctx: CanvasRenderingContext2D, text: string) {
    try {
        ctx.font = 'italic 58px Arial, sans-serif';
        ctx.fillText(text, GameDimensions.width / 2, GameDimensions.height / 2);
    } catch (e) { }
}

export function drawText(ctx: CanvasRenderingContext2D, text: string) {
    try {
        ctx.font = 'italic 42px Arial, sans-serif';
        ctx.fillText(text, GameDimensions.width / 2, (GameDimensions.height * 2) / 3);
    } catch (e) { }
}

export function drawHalfwayLine(ctx: CanvasRenderingContext2D, color: string) {
    try {
        ctx.beginPath();
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = color; // Set the line color
        ctx.moveTo(GameDimensions.width / 2, 0);
        ctx.lineTo(GameDimensions.width / 2, GameDimensions.height);
        ctx.stroke();
    } catch (e) { }
}
export function drawLeftDashedLine(ctx: CanvasRenderingContext2D, color: string) {
    try {
        ctx.beginPath();
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = color;
        ctx.moveTo(0, GameDimensions.height / 6);
        ctx.lineTo(GameDimensions.width, GameDimensions.height / 6);
        ctx.stroke();
        ctx.moveTo(0, (GameDimensions.height / 6) * 5);
        ctx.lineTo(GameDimensions.width, (GameDimensions.height / 6) * 5);
        ctx.stroke();
    } catch (e) { }

}

export function drawRightDashedLine(ctx: CanvasRenderingContext2D, color: string) {
    try {
        ctx.beginPath();
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = color;
        ctx.moveTo((GameDimensions.width / 10) * 9, GameDimensions.height / 6);
        ctx.lineTo((GameDimensions.width / 10) * 9, (GameDimensions.height / 6) * 5);
        ctx.stroke();
        ctx.moveTo((GameDimensions.width / 10), GameDimensions.height / 6);
        ctx.lineTo((GameDimensions.width / 10), (GameDimensions.height / 6) * 5);
        ctx.stroke();
    } catch (e) { }
}


export function renderBall(ctx: CanvasRenderingContext2D, ball: Ball) {
    try {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, Ball.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    } catch (e) { }
}

export function renderPaddle(ctx: CanvasRenderingContext2D, paddle: Paddle) {
    try {
        if (paddleSizeChoice === 'small') {
            Paddle.width = 30;
            Paddle.height = 160;
        } else if (paddleSizeChoice === 'invisible') {
            Paddle.width = 40;
            Paddle.height = 0;
        }
        else {
            Paddle.width = 40;
            Paddle.height = 200;
        }
        ctx.fillRect(paddle.x - Paddle.width / 2, paddle.y - Paddle.height / 2, Paddle.width, Paddle.height);
    } catch (e) { }
}

export function renderScoreboard(ctx: CanvasRenderingContext2D, scoreboard: Scoreboard) {
    try {
        ctx.font = 'italic 58px Arial, sans-serif';
        ctx.fillText(scoreboard.left.toString(), GameDimensions.width * (1 / 4), 100);
        ctx.fillText(scoreboard.right.toString(), GameDimensions.width * (3 / 4), 100);
    } catch (e) { }
}

let isModalOpen = false;
export function handleBackHomeModal() {
    try {
        isModalOpen = true;
    } catch (e) { }
}
export function handleCancelLeaveGame() {
    try {
        isModalOpen = false
    } catch (e) { }
}

export function leaveGame() {
    try {
        isModalOpen = false;
        goto("/game");
    } catch (e) { }
}

export function gameRender(ctx: CanvasRenderingContext2D, state: GameState) {
    try {
        let backgroundColor: string;
        let paddleColor: string;

        backgroundColor = BackgroundColors[backgroundColorChoice] || BackgroundColors.default;
        paddleColor = PaddleColors[backgroundColorChoice] || PaddleColors.default;
        ctx.fillStyle = backgroundColor;

        ctx.fillRect(0, 0, GameDimensions.width, GameDimensions.height);
        ctx.fillStyle = paddleColor;
        ctx.lineWidth = 8;

        ctx.textAlign = "center";

        switch (state.gameStatus) {
            case GameStatus.WAITING:
                drawTextCenter(ctx, 'Waiting an Opponent...');
                drawText(ctx, 'UP Down W S to play');
                break;
            case GameStatus.PLAYING:
                drawHalfwayLine(ctx, 'white');
                drawLeftDashedLine(ctx, 'white');
                drawRightDashedLine(ctx, 'white');
                renderBall(ctx, state.ball);
                renderPaddle(ctx, state.leftPaddle);
                renderPaddle(ctx, state.rightPaddle);
                renderScoreboard(ctx, state.scoreboard);
                break;
            case GameStatus.FINISHED:
                renderScoreboard(ctx, state.scoreboard);
                drawTextCenter(ctx, 'Game Over !');
                break;
            case GameStatus.INTERRUPTED:
                drawTextCenter(ctx, 'Opponent left, You Win Bro !');
                break;
            case GameStatus.STOPSOLO:
                drawTextCenter(ctx, 'Opponent is yourself!  Stop playing solo!');
                break;
        }
    } catch (e) { }
}
