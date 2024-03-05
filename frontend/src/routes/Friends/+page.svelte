<script lang="ts">
	import { goto } from "$app/navigation";
	import { onDestroy, onMount } from "svelte";
	import Modal from "$lib/modals/Modal.svelte";
	import OtherProfile from "$lib/OtherProfile/OtherProfile.svelte";
	import {
		openModal,
		closeModal,
		showModal,
		selectedPage,
	} from "$lib/store/ModalValues";
	import {
		authentificated,
		isItARefreshement,
		session,
		userId,
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

	let id: number;
	userId.subscribe((a: number) => {
		id = a;
	});

	let socket: any;
	session.subscribe((a: any) => {
		socket = a;
	});

	let messagedUsers = new Set(
		JSON.parse(sessionStorage.getItem("messagedUsers") || "[]"),
	);

	// [ Online Users ]
	let myId: number = 0;
	let onlineUsersDatas: any[] = [];
	let onlineUserDatasEmptyArray: boolean = true;
	let chatMessages: { [key: string]: string[] } = {}; // Define the type explicitly
	let isTextAreaOpen = false;
	let activeUserId: any;

	// [ Friends List ]
	let friendsListDatas: any[] = [];
	let friendsListDatasEmptyArray: boolean = false;

	// [ Online Friends List ]
	let onlineFriendsList: any[] = [];
	let onlineFriendsEmptyArray: boolean = false;

	// [ InGame Friends ]
	let inGameUsersList: any[] = [];
	let inGameUsersEmptyArray: boolean = false;
	let inGameFriendsList: any[] = [];
	let inGameFriendsEmptyArray: boolean = false;

	// [ Pending List ]
	let pendingList: any[] = [];
	let pendingListEmptyArray: boolean = false;

	// [ Sent Requests List ]
	let sentRequestsList: any[] = [];
	let sentRequestListEmptyArray: boolean = false;

	// [ Block System ]
	let usersIBlockedList: any[] = [];
	let usersIBlockedEmptyArray: boolean = false;
	let usersWhoBlockedMeList: any[] = [];
	let usersWhoBlockedMeEmptyArray: boolean = false;

	let userLoginToDisplay: string;
	let pictureLink: string;
	let topPlayers: any[] = [];

	let userLoginTime: any = new Date().getTime();
	let refresh: boolean;

	// Function to calculate the time difference
	function calculateTimeDifference() {
		const currentTime: any = new Date().getTime();
		const timeDifference = Math.floor(
			(currentTime - userLoginTime) / (1000 * 60 * 60),
		); // Difference in hours
		return timeDifference;
	}

	onMount(async () => {
		isItARefreshement.subscribe((a: boolean) => {
			refresh = a;
		});
		if (refresh === true) {
			// console.log(" [ Friends ] ! ***[ Refresh ]*** !");
			goto("/");
		} else {
			// console.log(" [ Friends ] *{ Not a Refresh ! }* ");
		}

		try {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				goto("/");
				return;
			} else {
				// // // // [  Socket.on('message')  ] // // // //
				// [ OnlineUsers ]
				socket.on("onlineUsersDatas", (datas: any) => {
					onlineUsersDatas = datas;
					// console.log(" -[ OnlineUsersDatas ]- : ", onlineUsersDatas);
					userId.subscribe((a: number) => {
						myId = a;
					});
					if (onlineUsersDatas.length >= 2) {
						onlineUserDatasEmptyArray = false;
					} else {
						onlineUserDatasEmptyArray = true;
					}
				});

				socket.on("onlineUsersUpdate", (usersDatas: any[]) => {
					if (usersDatas.length >= 2) {
						onlineUserDatasEmptyArray = false;
					} else {
						onlineUserDatasEmptyArray = true;
					}
					// console.log(' -[ socket.on("onlineUsersUpdate" ]- : ',usersDatas);
					onlineUsersDatas = usersDatas;

					onlineFriendsList = onlineUsersDatas.filter((user) => {
						return friendsListDatas.some(
							(friend) => friend.id === user.id,
						);
					});
					// console.log(onlineFriendsList);
					if (onlineFriendsList.length === 0) {
						onlineFriendsEmptyArray = true;
					} else {
						onlineFriendsEmptyArray = false;
					}
				});
				socket.on("friendListUpdate", (newFriendsList: any[]) => {
					friendsListDatasEmptyArray =
						newFriendsList.length === 0 ? true : false;
					// console.log(' -[ socket.on("friendListUpdate" ]- : ',newFriendsList);
					friendsListDatas = newFriendsList;
					onlineFriendsList = onlineUsersDatas.filter((user) => {
						return friendsListDatas.some(
							(friend) => friend.id === user.id,
						);
					});
					// console.log(onlineFriendsList);
					if (onlineFriendsList.length === 0) {
						onlineFriendsEmptyArray = true;
					} else {
						onlineFriendsEmptyArray = false;
					}
				});
				socket.on("pendingListUpdate", (newPendingList: any[]) => {
					if (newPendingList.length === 0) {
						pendingListEmptyArray = true;
					} else {
						pendingListEmptyArray = false;
					}
					pendingList = newPendingList;
					// console.log(" -[ io.on - pendingListUpdate ]- Liste : ",pendingList);
				});
				socket.on(
					"sentRequestsListUpdate",
					(newSentRequestsList: any[]) => {
						if (newSentRequestsList.length === 0) {
							sentRequestListEmptyArray = true;
						} else {
							sentRequestListEmptyArray = false;
						}
						sentRequestsList = newSentRequestsList;
						// console.log(" -[ io.on - sentRequestUpdate ]- Liste : ",sentRequestsList);
					},
				);
				socket.on("inGameFriendUpdate", (inGameUsersList: any[]) => {
					inGameFriendsList = friendsListDatas.filter((friend) => {
						return inGameUsersList.some(
							(user) => friend.id === user.id,
						);
					});
					if (inGameFriendsList.length === 0) {
						inGameFriendsEmptyArray = true;
					} else {
						inGameFriendsEmptyArray = false;
					}
					// console.log(" -[ io.on - inGameFriendUpdate ]- Liste : ",inGameFriendsList);
				});
				socket.on("updateLeaderBoard", (data: any) => {
					topPlayers = data;
				});
				socket.on("newMessagedm", (data: any) => {
					if (data.alert) {
						alert(
							"You have new direct message from " +
								data.messages.senderLogin,
						); //--------------------3
						dmNotif.set(true); //---------------4
					}
				});

				// // // // // // // // // [ Execution - onMount() ] // // // // // //
				// [ OnlineUsersDatas ]
				socket.emit("getOnlineUsersDatas");

				// [ User - Me]
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
				if (response.ok) {
					const user = await response.json();
					pictureLink = user.avatar;
				} else {
					goto("/");
				}

				// [ InGame Users ]
				const inGameUsersListResponse = await fetch(
					`http://${host}:3000/user/inGameUsers`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					},
				);
				if (inGameUsersListResponse.ok) {
					inGameUsersList = await inGameUsersListResponse.json();
					if (inGameUsersList.length === 0) {
						inGameUsersEmptyArray = true;
					}
					// console.log("inGameUsersList: ", inGameUsersList);
				} else {
					goto("/");
				}

				// [ Pending List ]
				const pendingListResponse = await fetch(
					`http://${host}:3000/user/pendingList`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					},
				);
				if (pendingListResponse.ok) {
					pendingList = await pendingListResponse.json();
					if (pendingList.length === 0) {
						pendingListEmptyArray = true;
					}
					// console.log("pendingList: ", pendingList);
				} else {
					localStorage.clear();
					authentificated.set(false);
					goto("/");
				}

				// [ Friends List ]
				const friendsListResponse = await fetch(
					`http://${host}:3000/user/friendsList`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					},
				);
				if (friendsListResponse.ok) {
					friendsListDatas = await friendsListResponse.json();
					if (friendsListDatas.length === 0) {
						friendsListDatasEmptyArray = true;
					} else {
						friendsListDatasEmptyArray = false;
					}
					// console.log("friendsListDatas: ", friendsListDatas);
				} else {
					goto("/");
				}

				// [ Sent Requests List ]
				const sentRequestsListResponse = await fetch(
					`http://${host}:3000/user/sentRequestsList`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					},
				);
				if (sentRequestsListResponse.ok) {
					sentRequestsList = await sentRequestsListResponse.json();
					if (sentRequestsList.length === 0) {
						sentRequestListEmptyArray = true;
					}
					// console.log("sendRequest List: ", sentRequestsList);
				} else {
					goto("/");
				}

				// [ Users I Blocked List ]
				const blockedUsersListResponse = await fetch(
					`http://${host}:3000/user/blockUserList`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					},
				);
				if (blockedUsersListResponse.ok) {
					usersIBlockedList = await blockedUsersListResponse.json();
					if (usersIBlockedList.length === 0) {
						usersIBlockedEmptyArray = true;
					}
					// console.log("usersIblockedList: ", usersIBlockedList);
				} else {
					goto("/");
				}

				// [ Users Who Blocked Me ]
				const usersWhoBlockedMeListResponse = await fetch(
					`http://${host}:3000/user/blockedByList`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					},
				);
				if (usersWhoBlockedMeListResponse.ok) {
					usersWhoBlockedMeList =
						await usersWhoBlockedMeListResponse.json();
					if (usersWhoBlockedMeList.length === 0) {
						usersWhoBlockedMeEmptyArray = true;
					}
					// console.log("usersWhoBlockedMeList: ",usersWhoBlockedMeList);
				} else {
					goto("/");
				}

				// [ Online Friends ]
				onlineFriendsList = onlineUsersDatas.filter((user) => {
					return friendsListDatas.some(
						(friend) => friend.id === user.id,
					);
				});
				// console.log(onlineFriendsList);
				if (onlineFriendsList.length === 0) {
					onlineFriendsEmptyArray = true;
				}

				// [ InGame Friends ]
				inGameFriendsList = friendsListDatas.filter((friend) => {
					return inGameUsersList.some(
						(user) => friend.id === user.id,
					);
				});
				if (inGameFriendsList.length === 0) {
					inGameFriendsEmptyArray = true;
				} else {
					inGameFriendsEmptyArray = false;
				}

				// // //  [ LeaderBoard ]  // // //
				socket.emit("getLeaderBoard");
			}
		} catch (e) {
			// console.log("Friend OnMount PB");
		}
	});

	onDestroy(() => {
		socket.off("onlineUsersDatas");
		socket.off("onlineUsersUpdate");
		socket.off("friendListUpdate");
		socket.off("pendingListUpdate");
		socket.off("sentRequestsListUpdate");
		socket.off("newMessagedm");
		socket.off("updateLeaderBoard");
		// socket.off('');
	});

	///////////////////////////////////////////////////////////////
	//			[  Handle Functions  ]
	///////////////////////////////////////////////////////////////
	async function handleSeeProfil(login: string) {
		userLoginToDisplay = login;
		openModal("OtherProfile");
		goto("/Friends");
	}

	async function handleAcceptFriend(friendId: number) {
		const jwt = localStorage.getItem("jwt");
		const data = { idToAccept: friendId };
		//console.log("-[ Add Friend ]- username sent: ", username);
		const host = import.meta.env.VITE_HOST;
		const response = await fetch(`http://${host}:3000/user/addFriend`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});
		if (response.ok) {
			// console.log("response { OK } du [ Add Friend ]");
			await socket.emit("acceptOrRefuseFriendRequest", {
				idToAccept: friendId,
				myId: id,
			});
			await socket.emit("updateFriendList", {
				idToAccept: friendId,
				myId: id,
			});
		} else {
			// console.log("response { NOT OK } du [ Add Friend ]");
			goto("/");
		}

		closeModal();
	}

	async function handleRefuseFriendRequest(friendId: number) {
		const jwt = localStorage.getItem("jwt");
		const data = { idToRefuse: friendId };
		const host = import.meta.env.VITE_HOST;
		const response = await fetch(
			`http://${host}:3000/user/refuseFriendRequest`,
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
			// console.log("response { OK } du [ Refuse Friend ] : ", response.ok);
			socket.emit("acceptOrRefuseFriendRequest", {
				idToAccept: friendId,
				myId: id,
			});
		} else {
			// console.log("response { NOT OK } du [ Refuse Friend ]");
			goto("/");
		}

		closeModal();
	}

	async function handleRemoveFriend(friendId: number) {
		const jwt = localStorage.getItem("jwt");
		const data = { idToRemove: friendId };
		//console.log("-[ Remove Friend ]- username sent: ", username);
		const host = import.meta.env.VITE_HOST;
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
			socket.emit("updateFriendList", {
				idToAccept: friendId,
				myId: id,
			});
		} else {
			// console.log("response { NOT OK } du [ Undo Friend ]");
			goto("/");
		}

		closeModal();
	}

	// /// /// /// /// // [ D M ] // /// /// /// /// //
	// function resetMessagedUsers() {
	// 	sessionStorage.removeItem("messagedUsers");
	// 	alert("Messaged users reset successfully!");
	// }

	function handleButtonClick(id2: number, use: string) {
		if (chatMessages[use] && chatMessages[use].length === 0) {
			alert("Please write some message!");
			return;
		}
		// console.log('use-----------', use)
		const isBlockedByMe = usersIBlockedList.some(
			(user) => user.username === use,
		);
		const isBlockedByOthers = usersWhoBlockedMeList.some(
			(user) => user.username === use,
		);

		if (isBlockedByMe || isBlockedByOthers) {
			alert("Sending direct message blocked!");
			return; // Exit the function since the user is blocked
		}
		if (!chatMessages[use]) {
			alert("Please write some message!");
			return;
		}
		// if (!messagedUsers.has(use)) {
		// Only send the default message if we haven't messaged this user before
		$session.emit("sendMessage", {
			message: chatMessages[use],
			sendBy: id,
			sendTo: id2,
		});
		chatMessages[use] = [];
		closeTextArea();

		// Mark this user as messaged
		// messagedUsers.add(use);
		// messagedUsers.add(use);

		// Save to sessionStorage
		// sessionStorage.setItem(
		// 	"messagedUsers",
		// 	JSON.stringify([...messagedUsers])
		// );
		// }

		// Call this regardless of whether it's the first message or not,
		// as it appears to be your intention from the original code
		// handleDM(use);
		goto("/DM");
	}

	function openTextArea(id: number) {
		isTextAreaOpen = true;
		activeUserId = id;
	}

	function closeTextArea() {
		isTextAreaOpen = false;
		activeUserId = null;
	}
</script>

<ul role="list" class="divide-y divide-gray-100">
	{#if show_Modal}
		<div>
			<Modal>
				{#if selectedModal === "OtherProfile"}
					<OtherProfile
						username={userLoginToDisplay}
						on:closeModal={closeModal}
					/>
				{/if}
			</Modal>
		</div>
	{:else}
		<div>
			<h3>Leaderboard</h3>

			{#if topPlayers.length !== 0}
				<div class="flex">
					{#each topPlayers as { id, login, username, avatar, wonGames }}
						<li class="flex justify-between gap-x-6 py-5">
							<div class="flex min-w-0 gap-x-4">
								<img
									class="h-12 w-12 flex-none rounded-full bg-gray-50"
									style="margin-left: 20px;"
									src={avatar}
									alt=": 🤖 👨🏻‍🌾 Error  🍪 🤣 :"
								/>
								<div class="min-w-0 flex-auto">
									<p>
										Games Won:
										{wonGames}
									</p>
									<p
										class="mt-1 truncate text-sm leading-5 text-gray-500"
									>
										{username}
									</p>
								</div>
							</div>
						</li>
					{/each}
				</div>
			{:else}
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-300">
							Empty Leaderboard !
						</p>
					</div>
				</li>
			{/if}

			<h3>Online Users</h3>
			<li class="flex justify-between" />
			{#if onlineUserDatasEmptyArray === true}
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-300">
							Sorry Bro no one is connected !
						</p>
					</div>
				</li>
			{:else}
				{#each onlineUsersDatas as { id, login, username, avatar }}
					{#if id != myId}
						<li class="flex justify-between gap-x-6 py-5">
							<div class="flex min-w-0 gap-x-4">
								<img
									class="h-12 w-12 flex-none rounded-full bg-gray-50"
									style="margin-left: 20px;"
									src={avatar}
									alt=": 🤖 👨🏻‍🌾 Error  🍪 🤣 :"
								/>
								<div class="min-w-0 flex-auto">
									<p
										class="text-sm font-semibold leading-6 text-gray-900"
									>
										{username}
									</p>
									<p
										class="mt-1 truncate text-xs leading-5 text-gray-500"
									>
										<button
											on:click={() => {
												handleSeeProfil(login);
											}}
											>See Profile
										</button>
									</p>
								</div>
								{#if isTextAreaOpen && activeUserId === id}
									<textarea
										class="w-10% h-10%"
										bind:value={chatMessages[username]}
									/>
								{/if}

								<button
									class="mt-1 truncate text-xs leading-5 text-neutral-600"
									on:click={() => {
										if (activeUserId === id) {
											handleButtonClick(id, username);
										} else {
											openTextArea(id);
										}
									}}
								>
									{activeUserId === id
										? "Send"
										: "Send DM"}</button
								>
							</div>

							<div class="mt-1 flex items-center gap-x-1.5">
								<div
									class="flex-none rounded-full bg-emerald-500/20 p-1"
								>
									<div
										class="h-2 w-2 rounded-full bg-emerald-500"
									/>
								</div>
								<p
									class="text-xs leading-5 text-neutral-600"
									style="margin-right: 130px;"
								>
									Online
								</p>
							</div>
						</li>
					{/if}
				{/each}
			{/if}
			<li class="flex justify-between" />

			<h2>Online Friends</h2>
			{#if onlineFriendsEmptyArray === true}
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-300">
							Sorry Bro your friends are not connected. Request
							new Friends !
						</p>
					</div>
				</li>
			{:else}
				<!-- {#each onlineFriendsList as user} -->
				{#each onlineFriendsList as { id, login, username, avatar }}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={avatar}
								alt="error"
							/>
							<div class="min-w-0 flex-auto">
								<p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{username}
								</p>
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button
										on:click={() => {
											handleSeeProfil(login);
										}}
										>See Profile
									</button>
								</p>
							</div>
							{#if isTextAreaOpen && activeUserId === id}
								<textarea
									class="w-10% h-10%"
									bind:value={chatMessages[username]}
								/>
							{/if}

							<button
								class="mt-1 truncate text-xs leading-5 text-neutral-600"
								on:click={() => {
									if (activeUserId === id) {
										handleButtonClick(id, username);
									} else {
										openTextArea(id);
									}
								}}
							>
								{activeUserId === id
									? "Send"
									: "Send DM"}</button
							>
						</div>

						<div class="mt-1 flex items-center gap-x-1.5">
							<div
								class="flex-none rounded-full bg-emerald-500/20 p-1"
							>
								<div
									class="h-2 w-2 rounded-full bg-emerald-500"
								/>
							</div>
							<p
								class="text-xs leading-5 text-neutral-600"
								style="margin-right: 130px;"
							>
								Online
							</p>
						</div>
					</li>
				{/each}
			{/if}

			<h2>In Game Friends</h2>
			{#if inGameFriendsEmptyArray === true}
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-300">
							None of your friends is playing. Invite them to play
							!
						</p>
					</div>
				</li>
			{:else}
				{#each inGameFriendsList as { id, login, username, avatar }}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={avatar}
								alt="error"
							/>
							<div class="min-w-0 flex-auto">
								<p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{username}
								</p>
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button
										on:click={() => {
											handleSeeProfil(login);
										}}
										>See Profile
									</button>
								</p>
							</div>
						</div>

						<div class="mt-1 flex items-center gap-x-1.5">
							<div
								class="flex-none rounded-full bg-emerald-500/20 p-1"
							>
								<div
									class="h-1.5 w-1.5 rounded-full bg-emerald-500"
								/>
							</div>
							<p
								class="text-xs leading-5 text-neutral-600"
								style="margin-right: 130px;"
							>
								Game-On
							</p>
						</div>
					</li>
				{/each}
			{/if}

			<h2>Friends List</h2>
			{#if friendsListDatasEmptyArray === true}
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-300">
							Sorry Bro, you're a lone wolf! Try to make friends,
							request online users!
						</p>
					</div>
				</li>
			{:else}
				{#each friendsListDatas as { id, login, username, avatar }}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={avatar}
								alt="error"
							/>
							<div class="min-w-0 flex-auto">
								<!-- <p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{username}
								</p> -->
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button
										on:click={() => {
											handleSeeProfil(login);
										}}
										>See Profile
									</button>
								</p>
							</div>
						</div>

						<div
							class="hidden shrink-0 sm:flex sm:flex-col sm:items-end"
						>
							<p
								class="mt-1 truncate text-xs leading-5 text-neutral-600"
								style="margin-right: 130px;"
							>
								<button
									on:click={() => {
										handleRemoveFriend(id);
									}}
									>Undo Friendship
								</button>
							</p>
						</div>
						{#if onlineFriendsEmptyArray === false}
							<div class="mt-1 flex items-center gap-x-1.5">
								<div
									class="flex-none rounded-full bg-emerald-500/20 p-1"
								>
									<div
										class="h-2 w-2 rounded-full bg-emerald-500"
									/>
								</div>
								<p
									class="text-xs leading-5 text-neutral-600"
									style="margin-right:130px;"
								>
									Online
								</p>
							</div>
						{:else}
							<div
								class="hidden shrink-0 sm:flex sm:flex-col sm:items-center"
							>
								<p
									class="mt-1 text-xs leading-5 text-gray-500"
									style="margin-right: 130px;"
								>
									Last seen {calculateTimeDifference()}h ago
								</p>
							</div>
						{/if}
					</li>
				{/each}
			{/if}

			<h2>Pending friend Request</h2>
			{#if pendingListEmptyArray === true}
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-300">
							Sorry Bro, no one wants to be your friend !
						</p>
					</div>
				</li>
			{:else}
				{#each pendingList as { id, login, username, avatar }}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={avatar}
								alt="error"
							/>
							<div class="min-w-0 flex-auto">
								<!-- <p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{username}
								</p> -->
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button
										on:click={() => {
											handleSeeProfil(login);
										}}
										>See Profile
									</button>
								</p>
							</div>
						</div>

						<div
							class="hidden shrink-0 sm:flex sm:flex-col sm:items-end"
						>
							<p
								class="mt-1 truncate text-xs leading-5 text-neutral-900"
								style="margin-left:90px;"
							>
								<button
									on:click={() => {
										handleAcceptFriend(id);
									}}
									>Accept
								</button>
							</p>
						</div>
						<div
							class="hidden shrink-0 sm:flex sm:flex-col sm:items-end"
						>
							<p
								class="mt-1 truncate text-xs leading-5 text-neutral-900"
								style="margin-right:400px;"
							>
								<button
									on:click={() => {
										handleRefuseFriendRequest(id);
									}}
									>Refuse
								</button>
							</p>
						</div>
					</li>
				{/each}
			{/if}

			<h2>Friend Requests sent</h2>
			{#if sentRequestListEmptyArray === true}
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-300">
							Request new friends Bro !
						</p>
					</div>
				</li>
			{:else}
				<p class="text-xs leading-5 text-gray-300">
					Waiting an answer from
				</p>
				{#each sentRequestsList as { id, login, username, avatar }}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={avatar}
								alt="error"
							/>
							<div class="min-w-0 flex-auto">
								<!-- <p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{username}
								</p> -->
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button
										on:click={() => {
											handleSeeProfil(login);
										}}
										>See Profile
									</button>
								</p>
							</div>
						</div>
					</li>
				{/each}
			{/if}

			{#if usersIBlockedEmptyArray === false}
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-neutral-100">
							Users I Blocke
						</p>
					</div>
				</li>
				{#each usersIBlockedList as { id, login, username, avatar }}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={avatar}
								alt="error"
							/>
							<div class="min-w-0 flex-auto">
								<!-- <p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{username}
								</p> -->
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-300"
								>
									<button
										on:click={() => {
											handleSeeProfil(login);
										}}
										>See Profile
									</button>
								</p>
							</div>
						</div>
					</li>
				{/each}
			{/if}

			{#if usersWhoBlockedMeEmptyArray === false}
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-neutral-100">
							Users Who Blocked Me
						</p>
					</div>
				</li>
				{#each usersWhoBlockedMeList as { id, login, username, avatar }}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={avatar}
								alt="error"
							/>
							<div class="min-w-0 flex-auto">
								<!-- <p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{username}
								</p> -->
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-300"
								>
									<button
										on:click={() => {
											handleSeeProfil(login);
										}}
										>See Profile
									</button>
								</p>
							</div>
						</div>
					</li>
				{/each}
			{/if}
		</div>
	{/if}
</ul>

<style>
	li {
		line-height: 1;
	}

	.text-xs {
		padding-top: 5px; /* Adjust this value as needed */
	}
	.text-xs,
	.text-sm {
		/* line-height: 0.85; */
		line-height: 1em;
	}

	h2 {
		text-indent: 1em;
		line-height: 0.5;
		color: rgb(241, 58, 58);
		align-items: center;
	}
	h3 {
		text-indent: 1em;
		line-height: 2;
		color: rgb(241, 58, 58);
		align-items: center;
	}
</style>
