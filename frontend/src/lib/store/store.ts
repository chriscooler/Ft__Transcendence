import type { GameState } from "$lib/game/game.clientSchema";
import { writable } from "svelte/store";

// Bool de Frefresh Pour send vers 'home' en cas de refresh pour Properly resset Wtritables
export let isItARefreshement = writable(true);

// Auth -[ Value ] - qui definit l'acces au compte Utilisateur ou LoginPage
export let authentificated = writable(false);

// Google Authentificator Layout Authentification
export let isGoogleAuthActivated = writable(false);
export let isGoogleAuthEnabled = writable(false);
export let qrGoogle = writable("");
export let googleAuth = writable(false); // Google Auth Profile Set
export let navbar = writable(true);// Navbar

// General user Infos
export let user: any = writable(null);
export let userLogin = writable("");
export let actualUsername = writable("");
export let userId = writable(0);

// Game Options
export let gameState = writable<GameState>();
export let clientColyseus = writable();
export let roomColyseus = writable();
export let backgroundColor = writable("");
export let paddleSize = writable("");
export let ballSpeed = writable(0);
export let winnerScore = writable(0);
export let dataGame = writable();
export let leftPlayerUsername = writable('John');
export let rightPlayerUsername = writable('Tony');
export let InvitedUserLogin = writable('Bob');
export let InvitedUserUsername = writable('Boby 🤓 🦄');
export let InvitedUserId = writable(0);
export let inviteNotif = writable(false);
export let inviteNotifModal = writable(false);
export let iAmInvited = writable(false);
export let gameUserToInvite = writable("");

export let inGame = writable(false);

export let launchedGame = writable(false);
export let dataToCancelInvitation = writable();
export let isInvitationStillOn = writable(false);
export let hasInvitedSomeone = writable(false);


// DM - Chat
export let session: any = writable(null);
export let chanel: any = writable(null);
export let chanelname: any = writable(null);
export let dm: any = writable(null);
export let dmNotif: any = writable(false);

export let block: any = writable(null);
export let kickEndTimes: any = writable(null);
export let muteEndTimes: any = writable(null);