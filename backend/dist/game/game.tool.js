"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertUnreachable = exports.map = exports.toDegrees = exports.toRadians = void 0;
const toRadians = (degree) => Math.PI / 180 * degree;
exports.toRadians = toRadians;
const toDegrees = (radians) => 180 / Math.PI * radians;
exports.toDegrees = toDegrees;
const map = (n, in_min, in_max, out_min, out_max) => (n - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
exports.map = map;
function assertUnreachable(_data) {
    throw new Error('Reached unreachable code');
}
exports.assertUnreachable = assertUnreachable;
//# sourceMappingURL=game.tool.js.map