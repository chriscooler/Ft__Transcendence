<script lang="ts">
	import { goto } from "$app/navigation";
	import { closeModal } from "$lib/store/ModalValues";
	import {
		dataGame,
		iAmInvited,
		inviteNotif,
		inviteNotifModal,
		session,
		winnerScore,
		rightPlayerUsername,
		leftPlayerUsername,
		backgroundColor,
		paddleSize,
		isInvitationStillOn,
	} from "$lib/store/store";
	import { onDestroy } from "svelte";

	let wsClient: any;
	session.subscribe((a: any) => {
		wsClient = a;
	});
	let gameData: any;
	dataGame.subscribe((a) => {
		gameData = a;
	});

	let isInvitOn: boolean;

	function handleAccept() {
		try{
			inviteNotif.set(false);
			inviteNotifModal.set(false);
			iAmInvited.set(true);
			isInvitationStillOn.subscribe((a) => {
				isInvitOn = a;
			});
			if (isInvitOn) {
				winnerScore.set(gameData.scoreToWin);
				rightPlayerUsername.set(gameData.loginToInvite);
				leftPlayerUsername.set(gameData.login);
				backgroundColor.set(gameData.colorMode);
				paddleSize.set(gameData.paddleSize);
				closeModal();
				goto("/game/create");
			} else {
				alert("Your Opponent Canceled the Game");
				iAmInvited.set(false);
				closeModal();
		}}catch (e) {}
	}

	function handleRefuse() {
		try{
			isInvitationStillOn.subscribe((a) => {
				isInvitOn = a;
			});
			if (isInvitOn) {
				wsClient.emit("refuseGameInvitation", gameData);
				// console.log(" [GameInvitaion -- handleRefuse] data:", data);
			}
			inviteNotif.set(false);
			inviteNotifModal.set(false);
			iAmInvited.set(false);
			closeModal();
		}catch (e) {}
		
	}

	onDestroy(() => {
		inviteNotif.set(false);
		inviteNotifModal.set(false);
		closeModal();
	});
</script>

<div>
	<p>You have been invited by {gameData.username}</p>
	<div>
		<button
			class="accept"
			on:click={() => {
				handleAccept();
			}}>Accept</button
		>
		<button
			class="refuse"
			on:click={() => {
				handleRefuse();
			}}>Refuse</button
		>
	</div>
</div>

<style>
	button {
		cursor: pointer;
		color: white; /* Change text color to white */
		border-width: 1px;
		border-radius: 20%;
		background: rgba(255, 0, 0, 0.326); /* A cool blue color */
		padding: 5px 5px;
		font-size: 8px;
		border: 2px solid #eff1f4;
		transition: background 0.3s ease, color 0.3s ease;
		margin-left: 0;
		margin-right: 0;
	}

	button:hover {
		background: rgb(67, 90, 26);
	}
</style>
