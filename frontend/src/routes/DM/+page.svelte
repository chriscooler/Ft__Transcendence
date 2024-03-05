<script lang="ts">
	import { onMount } from "svelte";
	import {
		session,
		user,
		dmNotif,
		isItARefreshement,
	} from "$lib/store/store";
	import { browser } from "$app/environment";
	import EmojiPicker from "../../components/EmojiPicker.svelte";
	import { goto } from "$app/navigation";

	let isPageFocused = true;
	let rooms: Array<any> = [];
	let roomSelected: number = -1;
	let messages: any = [];
	let chatMessage: string = "";
	let showEmojiPicker: boolean = false;
	let usersIBlockedList: any[] = [];
	let usersWhoBlockedMeList: any[] = [];
	let usersIBlockedEmptyArray: boolean = false;
	let usersWhoBlockedMeEmptyArray: boolean = false;
	let blockedUsername: boolean = false;
	let messageListContainer: any = null;

	function scrollToBottom() {
		try {
			messageListContainer.scrollTop = messageListContainer.scrollHeight;
		} catch (e) {}
	}

	let refresh: boolean;
	onMount(() => {
		isItARefreshement.subscribe((a: boolean) => {
			refresh = a;
		});
		if (refresh === true) {
			// console.log(" [ DM ] ! ***[ Refresh ]*** !");
			goto("/");
		} else {
			// console.log(" [ DM ] *{ Not a Refresh ! }* ");
		}

		if (!browser || !$session) return;
		const fetchData = async () => {
			// Your async code here

			// Users I Blocked List----------------------------------------------
			const jwt = localStorage.getItem("jwt");
			const host = import.meta.env.VITE_HOST;
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

			// Users Who Blocked Me
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
				// console.log("usersWhoBlockedMeList: ", usersWhoBlockedMeList);
			} else {
				goto("/");
			}
		};
		fetchData();
		//----------------------------------------------------------------------
		$session.emit("getDmRooms");

		$session.on("repDmRooms", (data: any) => {
			rooms = data.rooms;
			// console.log("repDmRooms:", rooms);
		});

		$session.on("repMessagesInDmRooms", (data: any) => {
			messages = data.messages;
			scrollToBottom();
			// console.log("repMessagesInDmRooms:", messages);
		});

		$session.on("newMessagedm", (data: any) => {
			messages = [...messages, data.messages];
			// if (data.alert && data.messages.sendTo == $user.id) {
			if (data.alert) {
				alert(
					"You have new direct message from " +
						data.messages.senderLogin,
				); //--------------------3
				dmNotif.set(true); //---------------4
			}
			scrollToBottom();
		});

		return () => {
			$session.off("repDmRooms");
			$session.off("repMessagesInDmRooms");
			$session.off("newMessagedm");
		};
	});

	function handleClick(use: number, logine: string) {
		try {
			// console.log('use----------',use)
			if (
				!(blockedUsername = usersIBlockedList.some(
					(blockedUser) => blockedUser.username == logine,
				))
			)
				blockedUsername = usersWhoBlockedMeList.some(
					(blockedBy) => blockedBy.username == logine,
				);

			// console.log('blockedusername--', blockedUsername);
			if (blockedUsername) {
				alert("Sending direct message blocked!");
			} else {
				$session.emit("sendMessage", {
					message: chatMessage,
					sendBy: $user.id,
					sendTo: use,
				});
				chatMessage = "";
				showEmojiPicker = false;
			}
		} catch (e) {}
	}

	function handleKeyPress(event: any) {
		try {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				handleClick(
					rooms[roomSelected].userOne.id === $user.id
						? rooms[roomSelected].userTwo.id
						: rooms[roomSelected].userOne.id,
					rooms[roomSelected].userOne.id === $user.id
						? rooms[roomSelected].userTwo.userName
						: rooms[roomSelected].userOne.userName,
				);
			}
		} catch (e) {}
	}

	function handleEmojiSelect(event: any) {
		try {
			const selectedEmoji = event.detail.emoji;
			chatMessage += selectedEmoji;
			// console.log('emo',selectedEmoji)
			// Do something with the selectedEmoji
		} catch (e) {}
	}
</script>

<svelte:window
	on:focus={() => (isPageFocused = true)}
	on:blur={() => (isPageFocused = false)}
/>

<div class="w-full h-full flex">
	<div class="room-list">
		{#each rooms as room, i}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="room"
				on:click={() => {
					$session.emit("getMessagesInDmRoom", room.id);
					roomSelected = i;
				}}
			>
				<div class="room-name">
					{room.userOne.userName == $user.userName
						? room.userTwo.userName
						: room.userOne.userName}
				</div>
			</div>
		{/each}
	</div>

	{#if roomSelected !== -1}
		<div class="direct-chat">
			<div
				class="message-list overflow-y-scroll"
				bind:this={messageListContainer}
			>
				{#each messages.filter((msg) => !usersIBlockedList.some((user) => user.username === msg.senderLogin) && !usersWhoBlockedMeList.some((user) => user.username === msg.senderLogin)) as msg}
					<div class="relative w-full h-40 p-2">
						<div
							class="message {msg.sendBy == $user.id
								? 'right-0'
								: 'left-0'}"
						>
							<strong>|{msg.senderLogin}|</strong>
							<strong style="margin-right: 1rem;">:</strong>
							<br />{msg.message}<br />
							<strong style="margin-right: 1rem;" />
							<small>[{msg.date}]</small>
						</div>
					</div>
				{/each}
			</div>

			<div class="chat-wrapper">
				<textarea
					class="w-full h-full"
					bind:value={chatMessage}
					on:keydown={handleKeyPress}
				/>
				<button
					class="absolute right-5 top-1/2 -translate-y-1/2 p-3 bg-blue-400"
					on:click={() =>
						handleClick(
							rooms[roomSelected].userOne.id === $user.id
								? rooms[roomSelected].userTwo.id
								: rooms[roomSelected].userOne.id,
							rooms[roomSelected].userOne.id === $user.id
								? rooms[roomSelected].userTwo.login
								: rooms[roomSelected].userOne.login,
						)}
					>send
				</button>
				<button
					class="absolute right-20 top-1/2 -translate-y-1/2 p-3 bg-yellow-400"
					on:click={() => (showEmojiPicker = !showEmojiPicker)}
				>
					😀
				</button>
				{#if showEmojiPicker}
					<div class="custom-div">
						<EmojiPicker on:emojiSelect={handleEmojiSelect} />
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	/* Your existing CSS and maybe some modifications to accommodate the new UI elements... */
	.room-list {
		display: flex;
		flex-direction: column;
		width: 25%;
		height: 100%;
		background-color: #a9abc2;
		border: 1px solid #181313;
		user-select: none;
	}

	.direct-chat {
		display: flex;
		flex-direction: column;
		width: 75%;
		height: 100%;
		background-color: #48bb78;
	}
	.message {
		/* ... your existing styles ... */
		/* color: aqua; */
		padding: 1rem; /* Increased padding */
	}

	.message strong {
		display: block;
		font-size: 0.8rem;
		color: #0f0f13;
	}

	.message small {
		display: block;
		font-size: 0.6rem;
		color: #79072d;
		margin-top: 0.5rem;
	}

	.message-list {
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		width: 100%;
		height: 80%;
		background-color: #a9abc2;
		gap: 1rem;
	}

	.message {
		background-color: red;
		border: 1px solid white;
		padding: 0.75rem;
		font-size: 0.75rem;
		position: absolute;
		top: 0;
		height: 100%;
		max-width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		white-space: pre-wrap; /* Add this line */
	}

	.chat-wrapper {
		position: relative;
		font-size: 1.125rem;
		background-color: #fefcbf;
		height: 20%;
	}

	.room {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.75rem;
		height: 6rem;
		background-color: #a9abc2;
		border: 1px solid #181313;
		cursor: pointer;
		transition: brightness 0.2s;
	}

	.room:hover {
		filter: brightness(0.9);
	}

	.room:hover {
		background-color: red;
		color: white;
	}
	.custom-div {
		position: absolute;
		bottom: 70px;
		right: 20px;
		border: 1px solid #000; /* Black border */
		padding: 10px;
		transition: background-color 0.3s; /* Smooth background color transition */
		cursor: pointer;
	}

	/* Define hover styles */
	.custom-div:hover {
		background-color: #555; /* Change the background color on hover */
	}
</style>
