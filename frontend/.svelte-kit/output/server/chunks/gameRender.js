import { type, Schema } from "@colyseus/schema";
import { p as paddleSize, g as actualUsername, w as winnerScore, I as InvitedUserLogin, h as backgroundColor } from "./store.js";
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$1(target, key, result);
  return result;
};
const GameDimensions$1 = {
  width: 1280,
  height: 720
};
const center$1 = {
  x: Math.round(GameDimensions$1.width / 2),
  y: Math.round(GameDimensions$1.height / 2)
};
const _Paddle$1 = class _Paddle extends Schema {
  constructor(side) {
    super();
    this.side = side;
    this.y = center$1.y;
    this.initialize();
  }
  // Reset method
  reset() {
    this.initialize();
  }
  initialize() {
    const actualOffset = _Paddle.width / 2 + _Paddle.offset;
    switch (this.side) {
      case 0:
        this.x = actualOffset;
        break;
      case 1:
        this.x = GameDimensions$1.width - actualOffset;
        break;
    }
    this.y = center$1.y;
  }
};
_Paddle$1.offset = 50;
_Paddle$1.width = 40;
_Paddle$1.height = 200;
__decorateClass$1([
  type("int32")
], _Paddle$1.prototype, "x", 2);
__decorateClass$1([
  type("int32")
], _Paddle$1.prototype, "y", 2);
let Paddle$1 = _Paddle$1;
let Ball$1 = class Ball extends Schema {
  constructor() {
    super(...arguments);
    this.x = center$1.x;
    this.y = center$1.y;
  }
  reset() {
    this.center();
  }
  center() {
    this.x = center$1.x;
    this.y = center$1.y;
  }
};
Ball$1.radius = 25;
__decorateClass$1([
  type("int32")
], Ball$1.prototype, "x", 2);
__decorateClass$1([
  type("int32")
], Ball$1.prototype, "y", 2);
let Scoreboard$1 = class Scoreboard extends Schema {
  constructor() {
    super(...arguments);
    this.left = 0;
    this.right = 0;
  }
  reset() {
    this.left = 0;
    this.right = 0;
  }
};
__decorateClass$1([
  type("int8")
], Scoreboard$1.prototype, "left", 2);
__decorateClass$1([
  type("int8")
], Scoreboard$1.prototype, "right", 2);
let GameState$1 = class GameState extends Schema {
  constructor() {
    super(...arguments);
    this.gameStatus = 0;
    this.scoreboard = new Scoreboard$1();
    this.leftPaddle = new Paddle$1(
      0
      /* LEFT */
    );
    this.rightPaddle = new Paddle$1(
      1
      /* RIGHT */
    );
    this.ball = new Ball$1();
  }
};
__decorateClass$1([
  type("int8")
], GameState$1.prototype, "gameStatus", 2);
__decorateClass$1([
  type(Scoreboard$1)
], GameState$1.prototype, "scoreboard", 2);
__decorateClass$1([
  type(Paddle$1)
], GameState$1.prototype, "leftPaddle", 2);
__decorateClass$1([
  type(Paddle$1)
], GameState$1.prototype, "rightPaddle", 2);
__decorateClass$1([
  type(Ball$1)
], GameState$1.prototype, "ball", 2);
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
const GameDimensions = {
  width: 1280,
  height: 720
};
const center = {
  x: Math.round(GameDimensions.width / 2),
  y: Math.round(GameDimensions.height / 2)
};
let paddleSizeChoice$1 = "normal";
paddleSize.subscribe((a) => {
  paddleSizeChoice$1 = a;
  console.log("Game schema [paddleSizeChoice] :", paddleSizeChoice$1);
});
const _Paddle2 = class _Paddle3 extends Schema {
  // setSize(){
  // 	if(paddleSizeChoice === 'small')
  // 	{
  // 		Paddle.width = 15;
  // 		Paddle.height = 100;
  // 		Paddle.offset = 20;
  // 		console.log(" class Paddle:this.size === PaddleSize.Small: Paddle.offset ", Paddle.offset);
  // 		} else {
  // 		Paddle.offset = 40;
  // 		Paddle.width  = 40;
  // 		Paddle.height = 200;
  // 		console.log(" class Paddle:this.size === PaddleSize.Normal : Paddle.offset ", Paddle.offset);
  // 	}}
  constructor(side, paddleSize2) {
    super();
    this.side = side;
    this.paddleSize = paddleSize2;
    this.paddleSize = paddleSizeChoice$1;
    this.initialize();
  }
  // Constants for the paddle dimensions and offsets
  // public static readonly offset = 50;
  static offset;
  static width;
  //default width
  static height;
  // default height;
  static widthFactor;
  static heightFactor;
  x;
  y = center.y;
  // Reset method
  reset() {
    this.initialize();
  }
  initialize() {
    const actualOffset = _Paddle3.width / 2 + _Paddle3.offset;
    switch (this.side) {
      case 0:
        this.x = actualOffset;
        break;
      case 1:
        this.x = GameDimensions.width - actualOffset;
        break;
    }
    this.y = center.y;
  }
};
__decorateClass([
  type("int32")
], _Paddle2.prototype, "x", 2);
__decorateClass([
  type("int32")
], _Paddle2.prototype, "y", 2);
let Paddle = _Paddle2;
class Ball2 extends Schema {
  static radius = 25;
  x = center.x;
  y = center.y;
  reset() {
    this.center();
  }
  center() {
    this.x = center.x;
    this.y = center.y;
  }
}
__decorateClass([
  type("int32")
], Ball2.prototype, "x", 2);
__decorateClass([
  type("int32")
], Ball2.prototype, "y", 2);
class Scoreboard2 extends Schema {
  left = 0;
  right = 0;
  reset() {
    this.left = 0;
    this.right = 0;
  }
}
__decorateClass([
  type("int8")
], Scoreboard2.prototype, "left", 2);
__decorateClass([
  type("int8")
], Scoreboard2.prototype, "right", 2);
class GameState2 extends Schema {
  gameStatus = 0;
  scoreboard = new Scoreboard2();
  leftPaddle = new Paddle(
    0
    /* LEFT */
  );
  rightPaddle = new Paddle(
    1
    /* RIGHT */
  );
  ball = new Ball2();
  username = "john";
  scoreToWin;
  userLoginToInvite;
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
__decorateClass([
  type("int8")
], GameState2.prototype, "gameStatus", 2);
__decorateClass([
  type(Scoreboard2)
], GameState2.prototype, "scoreboard", 2);
__decorateClass([
  type(Paddle)
], GameState2.prototype, "leftPaddle", 2);
__decorateClass([
  type(Paddle)
], GameState2.prototype, "rightPaddle", 2);
__decorateClass([
  type(Ball2)
], GameState2.prototype, "ball", 2);
let backgroundColorChoice;
backgroundColor.subscribe((a) => {
  backgroundColorChoice = a;
  console.log("gameRender:", backgroundColorChoice);
});
let paddleSizeChoice;
paddleSize.subscribe((a) => {
  paddleSizeChoice = a;
  console.log("paddleSizeChoice :", paddleSizeChoice);
});
InvitedUserLogin.subscribe((a) => {
});
