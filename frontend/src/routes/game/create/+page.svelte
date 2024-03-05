<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import type { Room } from "colyseus.js";
	import * as Colyseus from "colyseus.js";
	import { closeModal } from "$lib/store/ModalValues";
	import { goto } from "$app/navigation";
	import { gameRender } from "$lib/game/gameRender";
	import { GameState, GameDimensions } from "$lib/game/game.clientSchema";

	import {
		clientColyseus,
		InvitedUserId,
		InvitedUserLogin,
		actualUsername,
		ballSpeed,
		winnerScore,
		dataGame,
		iAmInvited,
		inGame,
		session,
		userId,
		userLogin,
		backgroundColor,
		paddleSize,
		gameState,
		rightPlayerUsername,
		leftPlayerUsername,
		navbar,
		launchedGame,
		isItARefreshement,
		dataToCancelInvitation,
		hasInvitedSomeone,
	} from "$lib/store/store";

	let room: Room<GameState>;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let isDisconnected = false;
	let isGamePaused = false;
	let client: any;

	// **************      ************** //
	// Game options writables
	let speed: number;
	let scoreToWin: number;
	let loginName: string;
	let id: number;
	let userIdToInvite: number;
	let userLoginToInvite: string;
	let backgroundColorChoice: string;
	let paddleSizeChoice: string;

	// Writable userInfos
	let username: string = "john";
	let wsClient: any;
	let invited: boolean;
	let gameData: any;
	let login: string;
	let hasInvited: boolean;
	let state: GameState;
	// **************      ************** //

	async function EnterGame() {
		try {
			const jwt = localStorage.getItem("jwt");
			const host = import.meta.env.VITE_HOST;
			const response = await fetch(`http://${host}:3000/user/enterGame`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				// console.log("-[ Enter Game Button ]- ");
				wsClient.emit("inGameUpdate", { myId: id });
			} else {
				goto("/");
			}
		} catch (e) {}
	}
	let refresh: boolean;
	onMount(() => {
		isItARefreshement.subscribe((a: boolean) => {
			refresh = a;
		});
		if (refresh === true) {
			// console.log(" [ CreateGame ] ! ***[ Refresh ]*** !");
			goto("/");
		} else {
			// console.log(" [ CreateGame ] *{ Not a Refresh ! }* ");
		}

		// console.log("Connection Ws Colyseus [ 3001 ]");
		const host = import.meta.env.VITE_HOST;
		client = new Colyseus.Client(`ws://${host}:3001`);
		clientColyseus.set(client);
		navbar.set(false);
		launchedGame.set(true);
		EnterGame();

		gameState.subscribe((newState) => {
			state = newState;
		});

		actualUsername.subscribe((a) => {
			username = a;
		});
		userLogin.subscribe((a) => {
			loginName = a;
		});
		userId.subscribe((a) => {
			id = a;
		});
		ballSpeed.subscribe((a) => {
			speed = a;
		});
		winnerScore.subscribe((a) => {
			scoreToWin = a;
		});
		InvitedUserId.subscribe((a) => {
			userIdToInvite = a;
		});
		InvitedUserLogin.subscribe((a) => {
			userLoginToInvite = a;
		});
		session.subscribe((a: any) => {
			wsClient = a;
		});

		paddleSize.subscribe((a) => {
			paddleSizeChoice = a;
		});

		// console.log("frontend: createGame [] : userName:", username);
		const context = canvas.getContext("2d");
		if (!context) {
			throw new Error("Failed to get 2D context.");
		}
		ctx = context;

		(async () => {
			// Initialize game and state
			await initializeGame();

			// First render
			gameRender(ctx, state);
			//gameRender();

			// Additional setup
			resizeCanvas();

			// Start rendering loop
			renderLoop();
		})();

		room?.onLeave((code) => {
			if (code === 1000) {
				// Normal closure, not a disconnection
				return;
			}
			handleDisconnection();
		});

		// Add event listeners for key events
		window.addEventListener("resize", resizeCanvas);
		window.addEventListener("keydown", handleKeydown);
		window.addEventListener("keyup", handleKeyup);

		return () => {
			// Cleanup when the component is destroyed
			window.removeEventListener("resize", resizeCanvas);
			window.removeEventListener("keydown", handleKeydown);
			window.removeEventListener("keyup", handleKeyup);
		};
	});

	onDestroy(() => {
		room.send("player_disconnected", {
			messageDuFront: "Salut du Frontend onDestroy SveltKit !",
		});
		room.leave();
		inGame.set(false);
		LeaveGame();
		closeModal();
		navbar.set(true);
		session.subscribe((a: any) => {
			wsClient = a;
		});
		wsClient.off("refuseCloseGame");
		// console.log("Le composant [Game/Create] a été démonté.");
	});

	async function LeaveGame() {
		try {
			const jwt = localStorage.getItem("jwt");
			const host = import.meta.env.VITE_HOST;
			const response = await fetch(`http://${host}:3000/user/leaveGame`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				// console.log("-[ Leave Game ]- ");
				wsClient.emit("inGameUpdate", { myId: id });
				let datas: any;
				dataToCancelInvitation.subscribe((a) => {
					datas = a;
				});
				hasInvitedSomeone.subscribe((a) => {
					hasInvited = a;
				});
				if (hasInvited === true) {
					hasInvitedSomeone.set(false);
					wsClient.emit("cancelInvitation", datas);
				}
			} else {
				goto("/");
			}
		} catch (e) {
			// console.error("Failed to connect to the game server:", e);
		}
	}

	async function registerScoreHistory(data: any) {
		try {
			const jwt = localStorage.getItem("jwt");
			const host = import.meta.env.VITE_HOST;
			const response = await fetch(
				`http://${host}:3000/user/matchHistory`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ data }),
				},
			);

			if (response.ok) {
				// console.log("-[ Match History ]-  Set !");
			} else {
				goto("/");
			}
		} catch (e) {}
	}

	async function initializeGame() {
		try {
			iAmInvited.subscribe((a) => {
				invited = a;
			});
			dataGame.subscribe((a) => {
				gameData = a;
			});

			backgroundColor.subscribe((a) => {
				backgroundColorChoice = a;
				// console.log("gameRender:", backgroundColorChoice);
			});
			const roomOptions = {
				speed: speed,
				scoreToWin: scoreToWin,
				loginName: loginName,
				id: id,
				username: username,
				idToInvite: userIdToInvite,
				loginToInvite: userLoginToInvite,
				paddleSize: paddleSizeChoice,
				backgroundColor: backgroundColorChoice,
			};
			dataToCancelInvitation.set(roomOptions);
			inGame.set(true);
			iAmInvited.subscribe((a) => {
				invited = a;
			});
			// console.log(" [ initiationGame ] gameData: ", gameData);
			// console.log(" [ initiationGame ] invited: ", invited);
			if (invited === false) {
				room = await client.create("privateRoom", roomOptions);
			} else {
				room = await client.joinById(gameData.roomId, roomOptions);
				iAmInvited.set(false);
			}

			state = room.state;

			// [ Invitation ] // // // // // // // // // // // // // //
			room.onMessage("invitation", (data: any) => {
				userLogin.subscribe((a) => {
					login = a;
				});
				if (login === data.login) {
					// console.log(" [ room.onMessage(Invitation) ] data: ", data);
					rightPlayerUsername.set(data.loginToInvite);
					leftPlayerUsername.set(data.login);
					winnerScore.set(data.scoreToWin);
					// console.log("[ room.onMessage(Invitation) winnerScore.set(data.scoreToWin ] ",winnerScore.set(data.scoreToWin));
					let wsServer: any;
					session.subscribe((a: any) => {
						wsServer = a;
					});
					hasInvitedSomeone.set(true);
					wsServer.emit("sendGameInvitation", data);
				}
			});
			// // // // // // // // // // // // // // // // // // // //

			room.onMessage("state", (message: any) => {
				// console.log("New game state received:", message);
			});
			room.onMessage("startGame", (message: any) => {});
			room.onStateChange((newState) => {
				state = newState;
				gameRender(ctx, state);
			});
			room.onMessage("updateWinningScore", (message: any) => {
				scoreToWin = message.winningScore;
			});

			room.onMessage("scoreHistory", (data: any) => {
				registerScoreHistory(data);
			});

			room.onMessage("opponentLeft", () => {
				alert("You Won Bro!, Your opponent left");
			});

			room.onMessage("gameFinished", (message: any) => {
				if (message.winnerLogin) {
					alert("Winner is '" + message.winnerLogin + "'"); // Display the winnerLogin if it exists
				}
				LeaveGame();
			});
			handleDisconnection();
		} catch (e) {}
	}

	function handleDisconnection() {
		wsClient.on("refuseCloseGame", (data: any, message: string) => {
			message = "the other player refused the game";
			alert(message);
			goto("/");
		});
	}

	function handleReconnection() {
		try {
			isDisconnected = false;
			isGamePaused = false; // Resume the game on reconnection
		} catch (e) {}
	}

	//  Handle key events
	function handleKeydown(e: KeyboardEvent) {
		try {
			if (isGamePaused) {
				return; // Don't handle key events when the game is paused
			}
			switch (e.key) {
				case "ArrowUp":
				case "W":
				case "w":
					room.send("paddleMove", {
						newDirection: PaddleDirection.UP,
					});
					break;
				case "ArrowDown":
				case "S":
				case "s":
					room.send("paddleMove", {
						newDirection: PaddleDirection.DOWN,
					});
					break;
			}
		} catch (e) {}
	}

	enum PaddleDirection {
		UP = 0,
		DOWN,
		STOP,
	}

	function handleKeyup(e: KeyboardEvent) {
		try {
			if (isGamePaused) {
				return; // Don't handle key events when the game is paused
			}
			switch (e.key) {
				case "ArrowUp":
				case "ArrowDown":
				case "W":
				case "S":
				case "w":
				case "s":
					room.send("paddleMove", {
						newDirection: PaddleDirection.STOP,
					});
					break;
			}
		} catch (e) {}
	}

	function resizeCanvas() {
		try {
			const scale = Math.min(
				window.innerWidth / GameDimensions.width,
				window.innerHeight / GameDimensions.height,
			);
			ctx.canvas.width = GameDimensions.width * scale;
			ctx.canvas.height = GameDimensions.height * scale;
			ctx.scale(scale, scale);
		} catch (e) {}
	}
	function renderLoop() {
		try {
			requestAnimationFrame(renderLoop);
			//gameRender();
			gameRender(ctx, state);
		} catch (e) {}
	}
</script>

{#if isDisconnected}
	<div class="disconnected-message">
		<h2>Opponent Left</h2>
		<button on:click={handleReconnection}>Reconnect</button>
	</div>
{/if}
<svelte:window
	on:resize={resizeCanvas}
	on:keydown={handleKeydown}
	on:keyup={handleKeyup}
/>
<canvas bind:this={canvas} id="rendering-canvas" />

<style>
</style>
