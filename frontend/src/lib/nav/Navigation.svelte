<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { selectedPage, showModal } from "$lib/store/ModalValues";
	import {
		authentificated,
		isGoogleAuthEnabled,
		session,
		inviteNotif,
		inviteNotifModal,
		dmNotif,
	} from "../store/store";

	// [ Notif Game Invitation] // // // // // // // // // //
	$: inviteNotif;
	$: notif = false;
	$: notifDm = false;
	let socket: any;
	let isModalOpen = false;

	inviteNotif.subscribe((a) => {
		notif = a;
	});
	let show_Modal: boolean;
	showModal.subscribe((a: boolean) => {
		show_Modal = a;
	});
	let selectedModal: string;
	selectedPage.subscribe((b: string) => {
		selectedModal = b;
	});
	dmNotif.subscribe((a: any) => {
		notifDm = a;
	});
	// // // // // // // // // // // // // // // // // // // //

	function handleProfile() {
		goto("/Profile");
	}
	function handleFriends() {
		goto("/Friends");
	}
	function handleGame() {
		goto("/game/matchmaking");
	}
	function handleInvitation() {
		inviteNotifModal.set(true);
		goto("/");
	}

	function handleOpenModal() {
		isModalOpen = true;
	}
	function handleCancelModal() {
		isModalOpen = false;
	}

	async function handleLoggout() {
		localStorage.clear();
		isGoogleAuthEnabled.set(false);
		authentificated.set(false);
		session.subscribe((a: any) => {
			socket = a;
		});
		socket.close();
		goto("/");
		location.reload();
	}
	onMount(() => {
		const handleLoggoutButton =
			document.getElementById("handlLoggoutButton");
		if (handleLoggoutButton) {
			handleLoggoutButton.addEventListener("click", () => {
				handleLoggout();
			});
		}
	});
	function handleDMNotif() {
		dmNotif.set(false);
		goto("/DM");
	}
</script>

<nav class="w-full flex gap-10 p-2 justify-center items-center h-full">
	<button on:click={() => goto("/")}>Home</button>
	<button on:click={handleProfile}>Profile</button>
	<button on:click={handleGame}>Game</button>
	<button
		on:click={() => {
			goto("/Chat");
		}}>Chat</button
	>
	<button on:click={handleFriends}>Friends</button>
	{#if notifDm === true}
		<button on:click={handleDMNotif}>DM</button>
	{:else}
		<button on:click={() => goto("/DM")}>DM</button>
	{/if}
	<button on:click={handleOpenModal}>Logout</button>
	{#if notif === true}
		<button class="notif" on:click={handleInvitation}
			>🏓 Invitation 🏓</button
		>
	{/if}
</nav>

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
									Log out
								</h3>
								<div class="mt-2">
									<p class="text-sm text-gray-500">
										Are you sure you want to log out? Once
										you log out, you'll need to log in
										again. Don't worry, all your histories
										remain.
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
							on:click={handleLoggout}
							type="button"
							class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
							>Log out</button
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
	.notif {
		color: blue;
	}
</style>
