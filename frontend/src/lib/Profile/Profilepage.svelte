<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount, onDestroy } from "svelte";
	import Modal from "$lib/modals/Modal.svelte";
	import ImgPreviewProfile from "./ImgPreviewProfile.svelte";
	import ErrorModal from "$lib/modals/ErrorModal.svelte";
	import Enable2Fa from "./Enable2Fa.svelte";
	import Disable2Fa from "./Disable2Fa.svelte";
	import {
		openModal,
		selectedPage,
		closeModal,
		showModal,
	} from "$lib/store/ModalValues";
	import {
		googleAuth,
		actualUsername,
		authentificated,
		isItARefreshement,
		session,
		dmNotif,
	} from "$lib/store/store";

	let show_Modal: boolean;
	showModal.subscribe((a: boolean) => {
		show_Modal = a;
	});

	let selectedModal: string;
	selectedPage.subscribe((b: string) => {
		selectedModal = b;
	});

	let Google2fa: boolean = false;
	let wsClient: any;
	let login: string;
	let pictureLink: string;
	let rank: string;
	let title: string;
	let win: number;
	let loose: number;
	let myId: number;
	let games: any = [];
	let indication_username: string = "";
	let indication_avatar: string = "";
	let newUserName: string = "";
	let refresh: boolean;
	$: username = "";

	let isModalOpen = false;
	function handleOpenModal() {
		isModalOpen = true;
	}
	function handleCancelModal() {
		isModalOpen = false;
	}

	onMount(async () => {
		isItARefreshement.subscribe((a: boolean) => {
			refresh = a;
		});
		if (refresh === true) {
			// console.log(" [ ProfilePage ] ! ***[ Refresh ]*** !");
			goto("/");
		} else {
			// console.log(" [ ProfilePage ] *{ Not a Refresh ! }* ");
		}
		session.subscribe((a: any) => {
			wsClient = a;
		});
		try {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				goto("/");
			} else {
				const host = import.meta.env.VITE_HOST;
				const response = await fetch(
					`http://${host}:3000/user/profile`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					},
				);
				// console.log(" -[ Profile ]- response: ", response);
				if (response.ok) {
					//const user = await response.json(); // Convertit la réponse JSON en objet JavaScript
					const user = await response.json(); // Convertit la réponse JSON en objet JavaScript
					// console.log(" -[ Profile ]- User: ", user);
					// console.log("Salut du Profile");
					login = user.login;
					pictureLink = user.avatar;
					username = user.userName;
					rank = user.rank;
					title = user.title;
					win = user.wonGameNbr;
					loose = user.lostGameNbr;
					myId = user.id;

					googleAuth.set(user.fa2);
					// console.log("2fa Value from user: [ ", user.fa2, " ]");
				} else {
					localStorage.clear();
					authentificated.set(false);
					goto("/");
				}

				// Get Match History
				session.subscribe((a: any) => {
					wsClient = a;
				});
				wsClient.emit("getOtherGameHistory", { otherId: myId });
				wsClient.on("otherGameHistory", (data: any) => {
					games = data;
				});
			}
			googleAuth.subscribe((a) => {
				Google2fa = a;
			});
			session.subscribe((a: any) => {
				wsClient = a;
			});
			wsClient.on("newMessagedm", (data: any) => {
				alert(
					"You have new direct message from " +
						data.messages.senderLogin,
				); //--------------------3
				dmNotif.set(true); //---------------4
			});
		} catch (e) {}
	});

	onDestroy(() => {
		return () => {
			session.subscribe((a: any) => {
				wsClient = a;
			});
			wsClient.off("newMessagedm");
			wsClient.off("updateAvata");
			closeModal();
		};
	});

	async function handleChangeName() {
		// console.log("login ", login, "    newUserame: ", newUserName);
		const jwt = localStorage.getItem("jwt");
		const data = { login: login, newUsername: newUserName };
		const host = import.meta.env.VITE_HOST;
		const response = await fetch(`http://${host}:3000/auth/changeName`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});

		if (response.ok) {
			username = newUserName;
			actualUsername.set(newUserName);
			wsClient.emit("changeUsername");
			goto("/");
		} else {
			goto("/Profile");
			openModal("errorMsg");
			
		}
	}

	async function handleRestAvatar() {
		// console.log("-[ handleRestAvatar ]-Reset Img bien Set")

		session.subscribe((a: any) => {
			wsClient = a;
		});
		wsClient.emit("resetAvatar", { login: login });

		wsClient.on("updateAvatar", (datas: any) => {
			pictureLink = datas.avatar;
			// console.log(" -[ updateAvatar ]- : ", datas.avatar);
		});
	}

	let people = [
		{ newImg: "images/Kyle.png" },
		{ newImg: "images/Kenny.png" },
		{ newImg: "images/Eric.png" },
		{ newImg: "images/Randy.png" },
		{ newImg: "images/Wendy.png" },
		{ newImg: "images/Stan.png" },
		{ newImg: "images/Herbert.png" },
		{ newImg: "images/Butters.png" },
		{ newImg: "images/Chef.png" },
	];

	let prefix = "";
	let newImg = "";
	let i = 0;

	$: filteredPeople = prefix
		? people.filter((person) => {
				const name = `${person.newImg}`;
				return name.toLowerCase().startsWith(prefix.toLowerCase());
		  })
		: people;

	$: selected = filteredPeople[i];

	$: reset_inputs(selected);

	function reset_inputs(person: any) {
		newImg = person ? person.newImg : "";
	}
	
</script>

{#if show_Modal}
	<div>
		<Modal>
			{#if selectedModal === "Try Avatar"}
				<ImgPreviewProfile
					image={newImg}
					{login}
					{username}
					on:closeModal={closeModal}
				/>
			{/if}
			{#if selectedModal === "errorMsg"}
				<ErrorModal
					msg="username [ {newUserName} ] is already used !"
				/>
			{/if}
			{#if selectedModal === "Try Enable 2fa"}
				<Enable2Fa {login} />
			{/if}
			{#if selectedModal === "Try Disable 2fa"}
				<Disable2Fa {login} />
			{/if}
		</Modal>
	</div>
{:else}
	<div class="text-center">
		<h1>
			<span class="profileName">{username}</span> 's Profile
			<span>You will get a Cookie if you are a Good Boy </span>
		</h1>
	</div>
	<div class="w-full flex">
		<div class="profile-Page">
			<div class="partie-gauche">
				<div>
					<img
						class="profile-pic"
						src={pictureLink}
						alt=": 🤖 👨🏻‍🌾 Error  🍪 🤣 :"
					/>
				</div>
				<div>
					<p class="info-container">
						<span
							style="font-family:sans-serif;border:1px orange solid;margin-right:5px;"
						>
							Login :
						</span>
						{login}
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<span
							style="font-family:sans-serif;border:1px orange solid;margin-right:5px;"
						>
							Username :
						</span>
						{username}
					</p>
					<p class="info-container">
						<span
							style="font-family:sans-serif;border:1px orange solid;margin-right:5px;"
						>
							Rank :
						</span>
						{rank}
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<span
							style="font-family:sans-serif;border:1px orange solid;margin-right:5px;"
						>
							Title :
						</span>
						{title}
					</p>
					<p class="info-container">
						<span
							style="font-family:sans-serif;border:1px orange solid;margin-right:5px;"
						>
							Total Won/Lost :
						</span>
						{win} - {loose}
					</p>
					<p />
					<p>
						<span> Google Authentificator : </span>
						{#if Google2fa === true}
							<span>
								<button
									on:click={() => {
										openModal("Try Disable 2fa");
										goto("/Profile");
									}}
								>
									Disable
								</button>
							</span>
						{:else}
							<span>
								<button
									on:click={() => {
										openModal("Try Enable 2fa");
										goto("/Profile");
									}}
								>
									Enable
								</button>
							</span>
						{/if}
					</p>
					<p2 class="flex-container">
						<span
							class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
							>Change username :</span
						>
						<input
							type="text"
							placeholder="new username"
							bind:value={newUserName}
						/>
						<button
							on:click={async () => {
								if (!newUserName.length) {
									indication_username = "Cannot be empty";
								} else if (newUserName.length > 20) {
									indication_username = "20 char Max";
								} else if (/\s/.test(newUserName)) {
									indication_username =
										"No whitespace allowed";
								} else {
									handleOpenModal();
								}
							}}
							>Change
						</button>
						{#if indication_username !== ""}
							<div class="indication">{indication_username}</div>
						{/if}
					</p2>

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

							<div
								class="fixed inset-0 z-10 w-screen overflow-y-auto"
							>
								<div
									class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
								>
									<div
										class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
									>
										<div
											class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
										>
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
														Change username
													</h3>
													<div class="mt-2">
														<p
															class="text-sm text-gray-500"
														>
															Are you sure to
															change this
															username? Once you
															change, you can stil
															change again. Don't
															worry, all your
															histories remain.
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
												on:click={handleChangeName}
												type="button"
												class="inline-flex w-full justify-center rounded-md bg-emerald-200 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
												>Change it</button
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

					<p2 class="flex-container">
						<span
							class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
							>Change Avatar :
						</span>

						<label
							><input
								bind:value={newImg}
								placeholder="newImg"
							/></label
						>

						<button
							on:click={async () => {
								if (!newImg.length) {
									indication_avatar = "Cannot be empty";
								} else if (newImg.length > 200) {
									indication_avatar = "200 char Max";
								} else if (/\s/.test(newImg)) {
									indication_avatar = "No whitespace allowed";
								} else {
									openModal("Try Avatar");
									goto("/Profile");
								}
							}}
						>
							Preview
						</button>

						<button on:click={handleRestAvatar}>Reset</button>
						{#if indication_avatar !== ""}
							<div class="indication">{indication_avatar}</div>
						{/if}
					</p2>

					<select bind:value={i} size={9}>
						{#each filteredPeople as person, i}
							<option value={i}>{person.newImg}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		<div class="game-history">
			<!-- <h1>Game History</h1> -->
			<span class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
				>Game History :</span
			>
			{#if games.length > 0}
				<ul>
					{#each games as game, i}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
						<div>
							{game.player1}
							{game.scorePlayer1} vs {game.scorePlayer2}
							{game.player2}
						</div>
					{/each}
				</ul>
			{:else}
				<p class="p1">Aucune partie trouvée.</p>
			{/if}
		</div>
	</div>
	<!-- divGlobale -->
{/if}

<style>
	.indication {
		color: crimson;
	}

	input {
		display: block;
		margin: 0 0 0.5em 0;
		border-color: rgb(243, 237, 237);
		border: 2px solid #eff1f4;
		font-size: 14px;
		padding: 2px 2px;
	}

	button {
		cursor: pointer;
		color: white; /* Change text color to white */
		border-width: 1px;
		border-radius: 20%;
		background: rgba(255, 0, 0, 0.326); /* A cool blue color */
		padding: 5px 5px;
		font-size: 8px;
		border: 2px solid #eff1f4;
		transition:
			background 0.3s ease,
			color 0.3s ease;
		margin-left: 0;
		margin-right: 0;
	}

	button:hover {
		background: rgb(67, 90, 26);
	}

	.profile-Page {
		flex: 1;
		align-items: flex;
	}
	.game-history {
		flex: 0.5;
		align-items: flex-end;
	}

	.profile-pic {
		max-width: 19%;
		border-radius: 40%;
		align-items: center;
		border-color: rgb(111, 151, 142);
		border-width: 2px;
	}

	p {
		color: rgb(32, 43, 33);
		font-family: inherit;
		align-items: center;
	}

	.p1 {
		color: rgb(17, 199, 196);
		font-family: inherit;
		align-items: center;
		font-size: small;
	}

	.flex-container {
		display: flex;
		align-items: center;
		gap: 10px; /* Adjust the gap as needed to control the spacing between elements */
	}

	.info-container {
		display: flex;
		align-items: center;
	}

	.profileName {
		align-items: center;
		color: rgb(237, 228, 228);
		font-size: 30px;
		margin-top: 10;
		font-family: fantasy;
	}
	h1 {
		font-family: inherit;
		align-items: center;
		color: rgb(227, 238, 227);
	}

	h3 {
		align-items: center;
		color: rgb(214, 225, 222);
	}

	* {
		font-family: inherit;
		font-size: inherit;
		color: rgb(186, 199, 196);
	}

	select {
		float: left;
		margin: 0 1em 1em 0;
		width: 12em;
	}
</style>
