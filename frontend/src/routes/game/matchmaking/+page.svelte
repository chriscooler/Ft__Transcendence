<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import type { Room } from "colyseus.js";
	import * as Colyseus from "colyseus.js";
	import {
		clientColyseus,
		isItARefreshement,
		roomColyseus,
	} from "$lib/store/store";
	import { closeModal } from "$lib/store/ModalValues";
	import { gameRender } from "$lib/game/gameRender";
	import { GameState, GameDimensions } from "$lib/game/game.clientSchema";
	import {
		actualUsername,
		ballSpeed,
		inGame,
		session,
		userId,
		userLogin,
		winnerScore,
		launchedGame,
		navbar,
	} from "$lib/store/store";
	import { goto } from "$app/navigation";

	let state: GameState;
	let room: Room<GameState>;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let isGamePaused = false;

	// **************   Game options writables  ************** //
	let speed: number;
	let scoreToWin: number;
	let loginName: string;
	let id: number;
	let client: any;

	// Writable userInfos
	let username: string = "john";
	let wsClient: any;
	let refresh: boolean;

	// **************      **************      ************** //

	onMount(() => {
		isItARefreshement.subscribe((a: boolean) => {
			refresh = a;
		});
		if (refresh === true) {
			// console.log(" [ Matchmaking ] ! ***[ Refresh ]*** !");
			goto("/");
		} else {
			// console.log(" [ Matchmaking ] *{ Not a Refresh ! }* ");
		}

		winnerScore.set(3);
		ballSpeed.set(3);
		const host = import.meta.env.VITE_HOST;
		client = new Colyseus.Client(`ws://${host}:3001`);
		clientColyseus.set(client);

		navbar.set(false);
		launchedGame.set(true);
		EnterGame();

		clientColyseus.subscribe((dataClient) => {
			client = dataClient;
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

		session.subscribe((a: any) => {
			wsClient = a;
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
		let theRoom: any;
		roomColyseus.subscribe((a: any) => {
			theRoom = a;
		});
		theRoom.send("player_disconnected", {
			messageDuFront: "Salut du Frontend onDestroy SveltKit !",
		});
		theRoom.leave();
		inGame.set(false);
		LeaveGame();
		closeModal();
		navbar.set(true);
	});

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
			} else {
				goto("/");
			}
		} catch (e) {}
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
			const roomOptions = {
				speed: speed,
				scoreToWin: scoreToWin,
				loginName: loginName,
				id: id,
				username: username,
			};

			inGame.set(true);
			room = await client.joinOrCreate("pong", roomOptions);
			roomColyseus.set(room);
			state = room.state;

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
		} catch (e) {
			// console.error("Failed to connect to the game server:", e);
		}
	}

	enum PaddleDirection {
		UP = 0,
		DOWN,
		STOP,
	}

	// ... [Handle key events]
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
			gameRender(ctx, state);
		} catch (e) {}
	}
</script>

<svelte:window
	on:resize={resizeCanvas}
	on:keydown={handleKeydown}
	on:keyup={handleKeyup}
/>
<canvas bind:this={canvas} id="rendering-canvas" />

<style>
	canvas#rendering-canvas {
		display: flex;
		justify-content: center;
		align-items: center;
		max-width: 100%;
		max-height: 100%;
		border: 10px solid rgb(141, 145, 145);
	}
</style>
