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
exports.GameState = exports.GameStatus = exports.Scoreboard = exports.Ball = exports.Paddle = exports.GameDimensions = void 0;
const schema_1 = require("@colyseus/schema");
exports.GameDimensions = {
    width: 1280,
    height: 720,
};
const center = {
    x: Math.round(exports.GameDimensions.width / 2),
    y: Math.round(exports.GameDimensions.height / 2),
};
var PaddleSide;
(function (PaddleSide) {
    PaddleSide[PaddleSide["LEFT"] = 0] = "LEFT";
    PaddleSide[PaddleSide["RIGHT"] = 1] = "RIGHT";
})(PaddleSide || (PaddleSide = {}));
class Paddle extends schema_1.Schema {
    constructor(side) {
        super();
        this.side = side;
        this.y = center.y;
        this.initialize();
    }
    reset() {
        this.initialize();
    }
    initialize() {
        const actualOffset = Paddle.width / 2 + Paddle.offset;
        switch (this.side) {
            case PaddleSide.LEFT:
                this.x = actualOffset;
                break;
            case PaddleSide.RIGHT:
                this.x = exports.GameDimensions.width - actualOffset;
                break;
        }
        this.y = center.y;
    }
}
exports.Paddle = Paddle;
Paddle.offset = 50;
Paddle.width = 40;
Paddle.height = 200;
__decorate([
    (0, schema_1.type)('int32'),
    __metadata("design:type", Number)
], Paddle.prototype, "x", void 0);
__decorate([
    (0, schema_1.type)('int32'),
    __metadata("design:type", Object)
], Paddle.prototype, "y", void 0);
class Ball extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.x = center.x;
        this.y = center.y;
    }
    reset() {
        this.center();
    }
    center() {
        this.x = center.x;
        this.y = center.y;
    }
}
exports.Ball = Ball;
Ball.radius = 12;
__decorate([
    (0, schema_1.type)('int32'),
    __metadata("design:type", Object)
], Ball.prototype, "x", void 0);
__decorate([
    (0, schema_1.type)('int32'),
    __metadata("design:type", Object)
], Ball.prototype, "y", void 0);
class Scoreboard extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.left = 0;
        this.right = 0;
    }
    reset() {
        this.left = 0;
        this.right = 0;
    }
}
exports.Scoreboard = Scoreboard;
__decorate([
    (0, schema_1.type)('int8'),
    __metadata("design:type", Object)
], Scoreboard.prototype, "left", void 0);
__decorate([
    (0, schema_1.type)('int8'),
    __metadata("design:type", Object)
], Scoreboard.prototype, "right", void 0);
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["WAITING"] = 0] = "WAITING";
    GameStatus[GameStatus["PLAYING"] = 1] = "PLAYING";
    GameStatus[GameStatus["FINISHED"] = 2] = "FINISHED";
    GameStatus[GameStatus["INTERRUPTED"] = 3] = "INTERRUPTED";
    GameStatus[GameStatus["STOPSOLO"] = 4] = "STOPSOLO";
})(GameStatus || (exports.GameStatus = GameStatus = {}));
class GameState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.gameStatus = GameStatus.WAITING;
        this.scoreboard = new Scoreboard();
        this.leftPaddle = new Paddle(PaddleSide.LEFT);
        this.rightPaddle = new Paddle(PaddleSide.RIGHT);
        this.ball = new Ball();
    }
}
exports.GameState = GameState;
__decorate([
    (0, schema_1.type)('int8'),
    __metadata("design:type", Object)
], GameState.prototype, "gameStatus", void 0);
__decorate([
    (0, schema_1.type)(Scoreboard),
    __metadata("design:type", Object)
], GameState.prototype, "scoreboard", void 0);
__decorate([
    (0, schema_1.type)(Paddle),
    __metadata("design:type", Object)
], GameState.prototype, "leftPaddle", void 0);
__decorate([
    (0, schema_1.type)(Paddle),
    __metadata("design:type", Object)
], GameState.prototype, "rightPaddle", void 0);
__decorate([
    (0, schema_1.type)(Ball),
    __metadata("design:type", Object)
], GameState.prototype, "ball", void 0);
//# sourceMappingURL=game.serverSchema.js.map