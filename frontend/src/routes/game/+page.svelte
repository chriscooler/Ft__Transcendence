<script lang="ts">
	import { goto } from "$app/navigation";
	import { onDestroy, onMount } from "svelte";
	import {
		winnerScore,
		ballSpeed,
		InvitedUserLogin,
		backgroundColor,
		paddleSize,
		InvitedUserUsername,
		isItARefreshement,
	} from "$lib/store/store";
	import GameModal from "$lib/game/gameModal.svelte";
	import { showModal } from "$lib/store/ModalValues";
	let speed: number = 1; // Default value for speed
	let scoreToWin: string = "3"; // Default value for score to win
	let isModalOpen = false;
	let colorMode: string = "blue";
	let paddle: string = "normal";

	let borderColors: Record<string, string> = {
		green: "rgb(0,100,0)",
		blue: "rgb(70,130,180)",
		orange: "rgb(255,143,31)",
	};

	let refresh: boolean;
	onMount(() => {
		isItARefreshement.subscribe((a: boolean) => {
			refresh = a;
		});
		if (refresh === true) {
			// console.log(" [ First GamePage ] ! ***[ Refresh ]*** !");
			goto("/");
		} else {
			// console.log(" [ First GamePage ] *{ Not a Refresh ! }* ");
		}
	});

	$: {
		const selectedColor = colorMode;
		if (selectedColor in borderColors) {
			document.documentElement.style.setProperty(
				"--border-color",
				borderColors[selectedColor]
			);
		}
	}
	let invitedLogin: string; // Game User Login to Invite
	InvitedUserLogin.subscribe((a) => {
		invitedLogin = a;
	});
	let invitedUsername: string;
	InvitedUserUsername.subscribe((a) => {
		invitedUsername = a;
	});

	const openModal = () => {
		isModalOpen = true;
	};
	const closeModal = () => {
		isModalOpen = false;
	};

	function openGameRuleModal() {
		try{
			showModal.set(true);
		}catch (e) {}
	}
	function closeGameRuleModal() {
		try{
			showModal.set(false);
		}catch (e) {}
	}

	const onSubmit = () => {
		const winnerScoreMap: Record<string, number> = {
			"3": 3,
			"5": 5,
		};
		winnerScore.set(winnerScoreMap[scoreToWin]);

		const winnerScoreValue = winnerScoreMap[scoreToWin];
		winnerScore.set(winnerScoreValue);

		paddleSize.set(paddle);
		backgroundColor.set(colorMode);
		ballSpeed.set(speed);
		closeModal();
		goto("/game/create");
	};
	onDestroy(() => {
		closeModal();
	});
</script>

<main class="game-background">
	<div class="button-container">
		<button
			style="margin-top: 2px"
			on:click={openModal}
			class="create-privateRoom-button"
		>
			Create PrivateGame
		</button>
		<button
			style="margin-top: 2px"
			on:click={openGameRuleModal}
			class="create-privateRoom-button"
		>
			Game Rules
		</button>
	</div>
</main>

{#if $showModal}
	<div class="modal">
		<div class="modal-content">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<span class="close" on:click={closeGameRuleModal}>&times;</span>
			<h2 class="py-2 text-4xl text-white">Game Rules</h2>

			<p>To win, be the first to reach the winning score.</p>
			<p>Designate right and left players; left player starts.</p>
			<p>Use 'up','down', 'W','S' to move paddle and hit the ball.</p>
			<p>Invitations initiated by the left player.</p>
			<p>Choose between 3vs3 or 5vs5 games.</p>
			<p>Select game speed (0-3).</p>
			<p>Customize your paddle size.</p>
			<p>
				Stay in the game; disconnecting forfeits the match to your
				opponent.
			</p>
		</div>
	</div>
{/if}

<GameModal bind:isOpen={isModalOpen} on:close={closeModal}>
	<form on:submit|preventDefault={onSubmit}>
		<div class="onSubmitPrivateRoom-container">
			<h2 class="py-2 text-4xl text-white">
				Let's Play with '{invitedUsername}'
			</h2>
			<label>
				Choose ping-pong court color :
				<select bind:value={colorMode}>
					<option value="green">Sprite</option>
					<option value="blue">Pepsi Blue</option>
					<option value="orange">Fanta</option>
				</select>
			</label>

			<label for="speed-range" class="label">
				Speed :
				<input
					type="range"
					id="speed-range"
					min="1"
					max="3"
					bind:value={speed}
					class="range"
				/>
				<span> {speed} / 3</span>
			</label>

			<label>
				Paddle Size :
				<select bind:value={paddle}>
					<option value="normal">normal</option>
					<option value="small">small</option>
					<option value="invisible">invisible</option>
				</select>
			</label>

			<label>
				Score to Win :
				<select bind:value={scoreToWin}>
					<option value="3">3 vs 3</option>
					<option value="5">5 vs 5</option>
				</select>
			</label>
			<button type="submit">Create Game</button>
		</div>
	</form>
</GameModal>

<style>
	.button-container {
		display: flex;
		justify-content: center; /* Center horizontally */
		align-items: center; /* Center vertically */
	}

	.onSubmitPrivateRoom-container {
		width: 100%; /* Set width as needed */
		height: 100%; /* Set height as needed */
		border: 35px solid var(--border-color);
		padding: 18px;
		margin: 0 auto;
		box-sizing: border-box;
		background-image: url("/images/playRoom.jpg");
		background-position: center;
		background-size: cover;
	}

	.create-privateRoom-button {
		background-color: #03080cbd; /* Blue background color */
		font-family: "fantasy";
		color: white; /* White text color */
		border: none;
		padding: 10px 20px; /* Add padding to make the button larger */
		font-size: 20px; /* Increase font size */
		border-radius: 5px; /* Rounded corners */
		cursor: pointer;
		transition: background-color 0.3s ease; /* Smooth background color transition on hover */
		display: block;
		margin: 0 auto;
	}

	.create-privateRoom-button:hover {
		background-color: #007bff; /* Darker blue color on hover */
	}

	label {
		display: flex;
		align-items: center; /* text aligns with the column.*/
		margin-bottom: 10px;
		color: rgb(29, 41, 131);
		font-size: 16px;
		font-weight: 600;
	}

	.range {
		width: 30%; /* Adjust the width as needed */
		background: linear-gradient(
			to right,
			#007bff,
			#00cc99
		); /* Gradient background */
		border: none;
		border-radius: 10px; /* Rounded corners */
		padding: 1px;
		margin: 2px 0;
		/* -webkit-appearance: none; Remove default appearance */
		appearance: none;
	}

	.range::-webkit-slider-thumb {
		/*-webkit-appearance: none; /* Remove default appearance for thumb */
		appearance: none;
		width: 20px;
		height: 20px;
		background: #00cc99;
		border: 2px solid #d5dfe9;
		cursor: pointer;
	}

	input,
	select,
	button {
		background: rgba(217, 204, 204, 0.8);
		border: none;
		padding: 10px;
		border-radius: 20px;
	}
	.py-2 {
		font-family: fantasy;
	}

	button {
		cursor: pointer;
		color: white;
		background: #007bff;
		border-radius: 3px;
		padding: 10px 20px;
		font-size: 18px;
		border: 2px solid #eff1f4;
		transition: background 0.3s ease, color 0.3s ease;
		border-radius: 30px;
	}

	button:hover {
		background: #245a1a;
	}
</style>
