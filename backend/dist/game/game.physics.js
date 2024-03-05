"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Physics = exports.PaddleDirection = void 0;
const game_serverSchema_1 = require("./game.serverSchema");
const game_tool_1 = require("./game.tool");
var PaddleDirection;
(function (PaddleDirection) {
    PaddleDirection[PaddleDirection["UP"] = 0] = "UP";
    PaddleDirection[PaddleDirection["DOWN"] = 1] = "DOWN";
    PaddleDirection[PaddleDirection["STOP"] = 2] = "STOP";
})(PaddleDirection || (exports.PaddleDirection = PaddleDirection = {}));
class Physics {
    constructor(ball, leftPaddle, rightPaddle, options, speed = 0.57) {
        this.lpDirection = PaddleDirection.STOP;
        this.rpDirection = PaddleDirection.STOP;
        this.angle = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        const { ballSpeed = options.ballSpeed || 1, ballAngle = 0, paddleSpeed = 0.5, } = options || {};
        this.ball = ball;
        this.lp = leftPaddle;
        this.rp = rightPaddle;
        if (options.ballSpeed === 1) {
            this.ballSpeed = 1;
        }
        else {
            this.ballSpeed = options.ballSpeed * speed;
        }
        this.paddleSpeed = paddleSpeed;
        this.setAngle((0, game_tool_1.toRadians)(ballAngle));
    }
    setAngle(angle) {
        this.angle = angle;
        this.xSpeed = this.ballSpeed * Math.cos(angle);
        this.ySpeed = this.ballSpeed * Math.sin(angle);
    }
    getAngle() {
        return this.angle;
    }
    setLeftPaddleDirection(direction) {
        this.lpDirection = direction;
    }
    getLeftPaddleDirection() {
        return this.lpDirection;
    }
    setRightPaddleDirection(direction) {
        this.rpDirection = direction;
    }
    getRightPaddleDirection() {
        return this.rpDirection;
    }
    leftPaddleCollision() {
        if (this.ball.y - game_serverSchema_1.Ball.radius < this.lp.y + game_serverSchema_1.Paddle.height / 2 &&
            this.ball.y + game_serverSchema_1.Ball.radius > this.lp.y - game_serverSchema_1.Paddle.height / 2 &&
            this.ball.x - game_serverSchema_1.Ball.radius < this.lp.x + game_serverSchema_1.Paddle.width / 2) {
            if (this.ball.x > this.lp.x) {
                const diff = this.ball.y - (this.lp.y - game_serverSchema_1.Paddle.height / 2);
                const rad = (0, game_tool_1.toRadians)(45);
                const angle = (0, game_tool_1.map)(diff, 0, game_serverSchema_1.Paddle.height, -rad, rad);
                this.setAngle(angle);
                this.ball.x = this.lp.x + game_serverSchema_1.Paddle.width / 2 + game_serverSchema_1.Ball.radius;
            }
        }
    }
    rightPaddleCollision() {
        if (this.ball.y - game_serverSchema_1.Ball.radius < this.rp.y + game_serverSchema_1.Paddle.height / 2 &&
            this.ball.y + game_serverSchema_1.Ball.radius > this.rp.y - game_serverSchema_1.Paddle.height / 2 &&
            this.ball.x + game_serverSchema_1.Ball.radius > this.rp.x - game_serverSchema_1.Paddle.width / 2) {
            if (this.ball.x < this.rp.x) {
                const diff = this.ball.y - (this.rp.y - game_serverSchema_1.Paddle.height / 2);
                const angle = (0, game_tool_1.map)(diff, 0, game_serverSchema_1.Paddle.height, (0, game_tool_1.toRadians)(225), (0, game_tool_1.toRadians)(135));
                this.setAngle(angle);
                this.ball.x = this.rp.x - game_serverSchema_1.Paddle.width / 2 - game_serverSchema_1.Ball.radius;
            }
        }
    }
    topBottomCollision() {
        if (this.ball.y < 0 + game_serverSchema_1.Ball.radius || this.ball.y > game_serverSchema_1.GameDimensions.height - game_serverSchema_1.Ball.radius) {
            this.ySpeed = -this.ySpeed;
        }
    }
    checkRightWall() {
        if (this.ball.x - game_serverSchema_1.Ball.radius > game_serverSchema_1.GameDimensions.width) {
            return true;
        }
        return false;
    }
    checkLeftWall() {
        if (this.ball.x + game_serverSchema_1.Ball.radius < 0) {
            return true;
        }
        return false;
    }
    movePaddle(paddle, direction, deltaTime) {
        switch (direction) {
            case PaddleDirection.UP:
                const minY = game_serverSchema_1.Paddle.height / 2;
                paddle.y = Math.max(minY, paddle.y - this.paddleSpeed * deltaTime);
                break;
            case PaddleDirection.DOWN:
                const maxY = game_serverSchema_1.GameDimensions.height - game_serverSchema_1.Paddle.height / 2;
                paddle.y = Math.min(maxY, paddle.y + this.paddleSpeed * deltaTime);
                break;
        }
    }
    update(deltaTime) {
        this.leftPaddleCollision();
        this.rightPaddleCollision();
        this.topBottomCollision();
        this.ball.x += this.xSpeed * deltaTime;
        this.ball.y += this.ySpeed * deltaTime;
        this.movePaddle(this.lp, this.lpDirection, deltaTime);
        this.movePaddle(this.rp, this.rpDirection, deltaTime);
    }
}
exports.Physics = Physics;
//# sourceMappingURL=game.physics.js.map