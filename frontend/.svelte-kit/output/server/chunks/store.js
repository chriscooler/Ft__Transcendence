import { w as writable } from "./index.js";
let authentificated = writable(false);
let isGoogleAuthActivated = writable(false);
let isGoogleAuthEnabled = writable(false);
let qrGoogle = writable("");
let navbar = writable(true);
let actualUsername = writable("");
let backgroundColor = writable("");
let paddleSize = writable("");
let winnerScore = writable(0);
let dataGame = writable(null);
let leftPlayerUsername = writable("John");
let rightPlayerUsername = writable("Tony");
let InvitedUserLogin = writable("Bob");
let inviteNotif = writable(false);
let inviteNotifModal = writable(false);
let inGame = writable(false);
let session = writable(null);
let user = writable(null);
export {
  InvitedUserLogin as I,
  inviteNotifModal as a,
  authentificated as b,
  isGoogleAuthActivated as c,
  dataGame as d,
  isGoogleAuthEnabled as e,
  inGame as f,
  actualUsername as g,
  backgroundColor as h,
  inviteNotif as i,
  leftPlayerUsername as l,
  navbar as n,
  paddleSize as p,
  qrGoogle as q,
  rightPlayerUsername as r,
  session as s,
  user as u,
  winnerScore as w
};
