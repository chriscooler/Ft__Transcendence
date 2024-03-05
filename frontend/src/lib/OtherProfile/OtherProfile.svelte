<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { closeModal } from "$lib/store/ModalValues";
	import InviteToPlayButton from "$lib/game/InviteToPlayButton.svelte";
	import {
		InvitedUserId,
		InvitedUserLogin,
		InvitedUserUsername,
		session,
		userId,
	} from "$lib/store/store";

	export let username: string;

	let otherUser: any;
	let login: string;
	let id: number;
	let pictureLink: string;
	let rank: string;
	let title: string;
	let win: number;
	let loose: number;

	let isFriend: boolean;
	let isPending: boolean;
	let isRequested: boolean;
	let hasBlocked: boolean;
	let isBlockedBy: boolean;
	let isModalOpen: boolean = false;

	let games: any = [];
	let wsClient: any;
	let socket: any;
	session.subscribe((a: any) => {
		socket = a;
	});
	let myId: number;
	userId.subscribe((a: number) => {
		myId = a;
	});

	let selectedGame: any = null;
	function selectGame(game: any) {
		selectedGame = game;
	}
	let otherId: number;

	onMount(async () => {
		try {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				goto("/");
			} else {
				const host = import.meta.env.VITE_HOST;
				// console.log("-[ OtherProfile ]-  - username: ", username);
				const url = `http://${host}:3000/user/profileOther?username=${username}`;
				const response = await fetch(url, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				});
				if (response.ok) {
					otherUser = await response.json(); // Convertit la réponse JSON en objet JavaScript
					// console.log(" -[ Profile Other ]- User: ", otherUser);
					login = otherUser.login;
					id = otherUser.id;
					pictureLink = otherUser.avatar;
					username = otherUser.username;
					rank = otherUser.rank;
					title = otherUser.title;
					win = otherUser.win;
					loose = otherUser.loose;
					otherId = otherUser.id;

					isFriend = otherUser.isMyFriend;
					isPending = otherUser.isInPending;
					isRequested = otherUser.isInSentRequest;
					hasBlocked = otherUser.isInBlockList;
					isBlockedBy = otherUser.isInBlockedByList;

					// Set Writtable en cas de lancement d'invitation
					InvitedUserLogin.set(otherUser.login);
					InvitedUserUsername.set(otherUser.username);
					InvitedUserId.set(otherUser.id);
				} else {
					goto("/");
				}

				// Get Match History
				session.subscribe((a: any) => {
					wsClient = a;
				});
				wsClient.emit("getOtherGameHistory", { otherId: otherUser.id });
				wsClient.on("otherGameHistory", (data: any) => {
					games = data;
				});
			}
		} catch (e) {}
	});

	onDestroy(() => {
		closeModal();
	});

	async function handleSendFriendRequest() {
		socket.emit("SendFriendRequest", {
			otherLogin: otherUser.login,
			username: username,
			myId: $userId,
		});
		closeModal();
	}

	async function handleRemoveFriend(friendId: number) {
		const jwt = localStorage.getItem("jwt");
		const data = { idToRemove: friendId };
		const host = import.meta.env.VITE_HOST;
		//console.log("-[ Remove Friend ]- username sent: ", username);
		const response = await fetch(`http://${host}:3000/user/removeFriend`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});
		if (response.ok) {
			// console.log("response { OK } du [ Undo Friend ] ", response.ok);
			await socket.emit("updateFriendList", {
				idToAccept: friendId,
				myId: id,
			});
		} else {
			// console.log("response { NOT OK } du [ Undo Friend ]")
			goto("/");
		}

		closeModal();
	}

	async function handleBlockUser() {
		const jwt = localStorage.getItem("jwt");
		const data = { username: username };
		//console.log("-[ Remove Friend ]- username sent: ", username);
		const host = import.meta.env.VITE_HOST;
		const response = await fetch(`http://${host}:3000/user/blockUser`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});
		if (response.ok) {
			// console.log("response { OK } du [ Block User ]");
		} else {
			// console.log("response { NOT OK } du [ Block User ]");
			goto("/");
		}
		closeModal();
		goto("/");
	}

	async function handleUnblockUser() {
		const jwt = localStorage.getItem("jwt");
		const data = { username: username };
		//console.log("-[ Remove Friend ]- username sent: ", username);
		const host = import.meta.env.VITE_HOST;
		const response = await fetch(`http://${host}:3000/user/unblockUser`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});
		if (response.ok) {
			// console.log("response { OK } du [ Unblock User ]");
		} else {
			// console.log("response { NOT OK } du [ Unblock User ]");
			goto("/");
		}
		isModalOpen = false;
		closeModal();
		goto("/");
	}
	function handleOpenModal() {
		isModalOpen = true;
	}
	function handleCancelModal() {
		isModalOpen = false;
	}
</script>

<div class="profile-Page">
	<h1>That is * {username} * Profile Bro !</h1>
	<div>
		<img
			class="profile-pic"
			src={pictureLink}
			alt=": 🤖 👨🏻‍🌾 Error  🍪 🤣 :"
		/>
	</div>
	<div>
		<p>Login : {login}</p>
		<p>Username : {username}</p>
		<p>Total Won: {win} - {loose} :Lost</p>
		<p>Rank : {rank}</p>
		<p>Title: {title}</p>
	</div>
	{#if isFriend === true}
		<button
			on:click={() => {
				handleRemoveFriend(otherId);
			}}>undo Friendship</button
		>
	{:else if isPending === true}
		<!-- <button
			on:click={() => {
				handleAcceptFriend(otherId);
			}}>accept Friend</button
		>
		<button
			on:click={() => {
				handleRefuseFriendRequest(otherId);
			}}>Refuse Friendship</button
		> -->
	{:else if isRequested === false}
		<button
			on:click={() => {
				handleSendFriendRequest();
			}}>Send friend Request</button
		>
	{/if}

	{#if hasBlocked === true}
		<button
			class="button"
			on:click={() => {
				handleUnblockUser();
			}}>Unblock</button
		>
	{:else if hasBlocked === false}
		<button
			class="buttonBlock"
			on:click={() => {
				handleOpenModal();
			}}>Block</button
		>
	{/if}
</div>

<div>
	{#if isBlockedBy === true}
		<p>You have been blocked By {username} !</p>
	{/if}
</div>

<InviteToPlayButton />

<div>
	<h1>Game History</h1>
	{#if games.length > 0}
		<ul>
			{#each games as game, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<li
					class:selected={selectedGame === game}
					on:click={() => selectGame(game)}
				>
					{game.player1}
					{game.scorePlayer1} vs {game.scorePlayer2}
					{game.player2}
				</li>
			{/each}
		</ul>
	{:else}
		<p>Aucune partie trouvée.</p>
	{/if}
</div>

{#if isModalOpen}
	<div
		class="relative z-10"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
		/>

		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div
				class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
			>
				<div
					class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
				>
					<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
							<div
								class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
							>
								<svg
									class="h-6 w-6 text-red-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
									/>
								</svg>
							</div>
							<div
								class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left"
							>
								<h3
									class="text-base font-semibold leading-6 text-gray-900"
									id="modal-title"
								>
									Block!?
								</h3>
								<div class="mt-2">
									<p class="text-sm text-gray-500">
										Are you sure? Once you block '{username}',
										Don't worry, still can undo it.
									</p>
								</div>
							</div>
						</div>
					</div>
					<div
						class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
					>
						<button
							id="leaveGameButton"
							on:click={handleBlockUser}
							type="button"
							class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
							>Block '{username}''</button
						>
						<button
							on:click={handleCancelModal}
							type="button"
							class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
							>Cancel</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	li {
		cursor: pointer;
		padding: 0.5rem;
		margin: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	li:selected {
		background-color: #e2e8f0;
	}

	button {
		color: white; /* Change text color to white */
		border-width: 1px;
		border-radius: 33%;
		background: rgba(41, 25, 213, 0.326); /* A cool blue color */
		/* border-radius: 3px; */
		padding: 5px 5px;
		font-size: 8px;
		border: 2px solid #eff1f4;
		transition:
			background 0.3s ease,
			color 0.3s ease;
		margin-left: 0;
		margin-right: 0;
		cursor: pointer;
	}

	.buttonBlock {
		color: white; /* Change text color to white */
		border-width: 1px;
		border-radius: 33%;
		background: rgba(255, 0, 0, 0.326); /* A cool blue color */
		/* border-radius: 3px; */
		padding: 5px 5px;
		font-size: 8px;
		border: 2px solid #eff1f4;
		transition:
			background 0.3s ease,
			color 0.3s ease;
		margin-left: 0;
		margin-right: 0;
		cursor: pointer;
	}
	.profile-Page {
		/* height: 2500px;
		width: 2500px; */
		align-items: center;
	}
	.profile-pic {
		max-width: 20%;
		max-height: 20%;
		border-radius: 50%;
	}
	img {
		align-items: center;
		position: relative;
		border-color: black;
		border-width: 2px;
	}
	p {
		margin-top: 2px;
	}
	h1 {
		align-items: center;
		color: black;
	}
</style>
