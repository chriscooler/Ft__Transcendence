<script lang="ts">
    import { onMount } from "svelte";
    import {
        session,
        user,
        kickEndTimes,
        muteEndTimes,
        isItARefreshement,
        userId,
        dmNotif,
    } from "$lib/store/store";
    import UserProfileModal from "./../../components/UserProfileModal.svelte";
    import EmojiPicker from "../../components/EmojiPicker.svelte";
    import { goto } from "$app/navigation";
    import { writable } from "svelte/store"; // Import the store function

    type Notification = {
        message: string;
        timestamp: number;
    };
    let notifications = writable<Notification[]>([]);
    const latestNotification = writable<Notification | null>(null);
    let title = "";
    let isPrivate = false;
    let password = "";
    let message = "";
    let member: any = { nullable: true };
    let chatRooms: any[] = [];
    let selectedChatRoom: any = null;
    let selectedChatRoomid: string = "";
    let chatMessages: any[] = [];
    let showChatWindow = true;
    let showChatHistory = true;
    let showSendMessage = true;
    let usersInRoom: any[] = [];
    let showEmojiPicker: boolean = false;
    let showChatRoom: boolean = true;

    interface ISocketValue {
        rooms: string;
    }

    let IdduUser: number;
    let usere: any;

    let enteredPassword: string | null;
    enteredPassword = "";
    let kickDuration: any;
    kickDuration = 1;
    interface Message {
        // your message properties here, e.g.,
        content: string;
        senderLogin: string;
        createdAt: Date;
        // ... any other properties your message objects might have
    }

    let chatMessagesPerRoom: { [roomId: string]: Message[] } = {};

    // Define a type for the end times data
    type EndTimesData = Record<string, number>;
    const kickEndTimesData: EndTimesData = $kickEndTimes;
    const muteEndTimesData: EndTimesData = $muteEndTimes;

    let isProfileModalOpen = false;
    let userToDisplay: any = null;
    let isModalVisible = false;
    const sessionStore = writable(null);

    function showNotification(message: string) {
        try {
            const notification: Notification = {
                message,
                timestamp: Date.now(),
            };
            notifications.update((prev) => [...prev, notification]);

            // Update the latestNotification store
            latestNotification.set(notification);

            // Optionally, you can add a timeout to remove the notification after a certain period
            setTimeout(() => {
                notifications.update((prev) =>
                    prev.filter((n) => n !== notification),
                );
                latestNotification.set(null);
            }, 5000); // Remove the notification after 5 seconds
        } catch (e) {}
    }

    function promptPasswordAndEnter(room: any) {
        try {
            enteredPassword = prompt("Enter password for room:");

            if (enteredPassword) {
                const host = import.meta.env.VITE_HOST;
                fetch(`http://${host}:3000/chat/verify-room-password`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        roomId: room.id,
                        password: enteredPassword,
                    }),
                })
                    .then((response) => response.text()) // Get the response as text first
                    .then((text) => {
                        try {
                            // Now try to parse the text as JSON
                            return JSON.parse(text);
                        } catch (error) {
                            console.error("Failed to parse JSON:", error);
                            console.error("Server response:", text); // log the server's response to inspect what's wrong
                            throw new Error(
                                "Received non-JSON response from server.",
                            );
                        }
                    })
                    .then((parsedData) => {
                        if (parsedData.success) {
                            selectChatRoom(room);
                        } else {
                            alert("Incorrect password");
                        }
                    })
                    .catch((error) => {
                        // Handle the error
                        console.error("An error occurred:", error.message);
                    });
            }
        } catch (e) {}
    }

    let refresh: boolean;
    onMount(() => {
        // Ensure sessionStore is initialized
        const currentSession = $session;
        if (!currentSession) {
            // Redirect to the home page when sessionStore is null
            goto("/");
        } else {
            // Set the initial value of sessionStore to the current value of $session
            sessionStore.set(currentSession);
            // Update sessionStore with the current value of $session
            isItARefreshement.subscribe((a: boolean) => {
                refresh = a;
            });
            if (refresh === true) {
                // console.log(" [ Chat ] ! ***[ Refresh ]*** !");
                goto("/");
            } else {
                // console.log(" [ Chat ] *{ Not a Refresh ! }* ");
            }

            user.subscribe((a: any) => {
                usere = a;
            });
            userId.subscribe((a: any) => {
                IdduUser = a;
            });
            $session.emit("getChatRooms");

            // General event listener for debugging
            $session.onAny((event: any, ...args: any) => {
                // console.log(`Received event: ${event}`, args);
            });

            $session.on("repChatRooms", (data: ISocketValue) => {
                chatRooms = [...data.rooms];
            });

            $session.on("repMessagesInChatRoom", (data: any) => {
                // Iterate through the messages and check if any sender login is in the blockedMembers or blockedByMembers list
                const filteredMessages = data.messages.filter(
                    (message: any) => {
                        const senderLogin = message.senderLogin;
                        if (
                            data.blockedMembers &&
                            data.blockedMembers.includes(senderLogin)
                        ) {
                            return false; // Don't process the message as this user should not see it
                        }
                        if (
                            data.blockedByMembers &&
                            data.blockedByMembers.includes(senderLogin)
                        ) {
                            return false; // Don't process the message as this user should not see it
                        }
                        return true; // Process the message
                    },
                );
                chatMessagesPerRoom[selectedChatRoomid] = filteredMessages;
                scrollToBottom();
            });

            $session.on("joinedChatRoom", ({ room, user, role }: any) => {
                const notificationMessage = `${user.login} joined room "${room.title}" as ${role}`;
                showNotification(notificationMessage);
                // console.log(`${user.login} is trying to join room ${room.title} as ${role}`);
            });

            $session.on("newMessage", (data: any) => {
                // console.log('Received new message:', data);

                // Check if data.savedMessage exists before accessing it
                if (!data || !data.savedMessage) {
                    console.error(
                        "Error: received message without savedMessage property:",
                        data,
                    );
                    return;
                }

                // Check if the logged-in user's login is in the blockedMembers list
                if (
                    data.blockedMembers &&
                    data.blockedMembers.includes(usere.login)
                ) {
                    // Don't process the message as this user should not see it
                    return;
                }

                if (
                    data.blockedByMembers &&
                    data.blockedByMembers.includes(usere.login)
                ) {
                    // Don't process the message as this user should not see it
                    return;
                }

                if (
                    selectedChatRoom &&
                    data.savedMessage.roomId === selectedChatRoom.id
                ) {
                    if (!chatMessagesPerRoom[selectedChatRoomid]) {
                        chatMessagesPerRoom[selectedChatRoomid] = [];
                    }
                    chatMessagesPerRoom[selectedChatRoomid].push(
                        data.savedMessage,
                    );
                    chatMessagesPerRoom = { ...chatMessagesPerRoom }; // Trigger Svelte's reactivity
                    scrollToBottom();
                }
            });

            $session.on("chatRoomCreated", (data: any) => {
                const { channel } = data;
                //  console.log("newRoom", channel)
                chatRooms = [...chatRooms, channel];
                const notificationMessage = `${channel.title} created as a room`;
                showNotification(notificationMessage);
            });
            $session.on("chatRoomDeleted", (data: any) => {
                const { room } = data;
                //  console.log("deletedRoom", room)
                chatRooms = chatRooms.filter((item) => item.id !== room.id);
                const notificationMessage = `room ${room.title} deleted`;
                showNotification(notificationMessage);
            });

            $session.on("membersList", (data: any) => {
                usersInRoom = data.members;
                // console.log('users in room', usersInRoom);
            });

            $session.on("kickedFromRoom", ({ roomId, duration }: any) => {
                const newEndTime = new Date().getTime() + duration * 60 * 1000;
                kickEndTimes[roomId] = newEndTime;
                const notificationMessage = `${usere.userName} kicked from room ${selectedChatRoom.title} for ${duration} minutes`;
                showNotification(notificationMessage);
                if (roomId === selectedChatRoomid) {
                    // Calculate the time at which the kicked duration will end.
                    showChatHistory = false;
                    showSendMessage = false;
                    const timer = setTimeout(
                        () => {
                            if (
                                new Date().getTime() >
                                (kickEndTimes[roomId] || 0)
                            ) {
                                showChatHistory = true;
                                showSendMessage = true;
                            }
                        },
                        duration * 60 * 1000,
                    ); // The duration until chat history will be closed
                    clearTimeout(timer);
                }
            });

            $session.on("mutedFromRoom", ({ roomId, duration }: any) => {
                const newEndTime = new Date().getTime() + duration * 60 * 1000;
                muteEndTimes[roomId] = newEndTime;
                const notificationMessage = `${usere.userName} muted from room ${selectedChatRoom.title} for ${duration} minutes`;
                showNotification(notificationMessage);
                if (roomId === selectedChatRoomid) {
                    showSendMessage = false;
                    const timer = setTimeout(
                        () => {
                            if (
                                new Date().getTime() >
                                (muteEndTimes[roomId] || 0)
                            ) {
                                showSendMessage = true;
                            }
                        },
                        duration * 60 * 1000,
                    ); // The duration until chat history will be closed
                    clearTimeout(timer);
                }
            });

            $session.on("bannedFromRoom", ({ roomId }: any) => {
                if (roomId === selectedChatRoomid) {
                    showChatHistory = false;
                    showSendMessage = false;
                    const notificationMessage = `${usere.userName} banned from room ${selectedChatRoom.title} entering this room is forbiden!`;
                    showNotification(notificationMessage);
                }
            });

            // Handle an updated room
            $session.on("roomUpdated", (updatedRoom: any) => {
                const index = chatRooms.findIndex(
                    (room) => room.id === updatedRoom.id,
                );
                if (index !== -1) {
                    chatRooms[index] = updatedRoom;
                    chatRooms = [...chatRooms]; // Re-assign to trigger reactivity in Svelte
                }
                const notificationMessage = `Attention room ${selectedChatRoom.title} updated!`;
                showNotification(notificationMessage);
            });
            $session.on("newMessagedm", (data: any) => {
                alert(
                    "You have new direct message from " +
                        data.messages.senderLogin,
                ); //--------------------3
                dmNotif.set(true); //---------------4
            });

            return () => {
                $session.off("repChatRooms");
                $session.off("repMessagesInChatRoom");
                $session.off("newMessage");
                $session.off("chatRoomCreated");
                $session.off("chatRoomDeleted");
                $session.off("membersList");
                $session.off("joinedChatRoom");
                $session.off("kickedFromRoom");
                $session.off("mutedFromRoom");
                $session.off("bannedFromRoom");
                $session.off("roomUpdated");
            };
        }
    });

    function fetchMembersInRoom(roomId: string) {
        try {
            $session.emit("getsMembersInRoom", roomId);
            usersInRoom = [];
        } catch (e) {}
    }

    function scrollToBottom() {
        try {
            const chatHistoryDiv = document.querySelector(".chat-history");
            if (chatHistoryDiv) {
                chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
            }
        } catch (e) {}
    }

    $: if (chatMessages && chatMessages.length > 0) {
        scrollToBottom();
    }

    async function selectChatRoom(room: any) {
        try {
            selectedChatRoom = room;
            selectedChatRoomid = room.id;
            // console.log('useri d ****', usere.id)
            // Check if the user is banned from this room
            $session.emit("checkUserBan", {
                userId: usere.id,
                roomId: selectedChatRoomid,
            });

            // Listen to the server's response
            $session.once("userBanStatus", (data: any) => {
                if (data.isBanned) {
                    showChatHistory = false;
                    showSendMessage = false;
                    // Notify the user that they are banned or take appropriate action.
                    return;
                }
                // Request user's status in the chat room
                $session.emit("CheckUserStatus", {
                    userId: usere.id,
                    roomId: selectedChatRoomid,
                });

                // Listen to the server's response
                $session.once("userStatus", (data: any) => {
                    if (data.isBanned) {
                        showChatHistory = false;
                        showSendMessage = false;
                        // Notify the user that they are banned or take appropriate action.
                    } else {
                        // Check if user is still kicked from this room
                        if (
                            new Date().getTime() <=
                            (data.kickEndTimes[selectedChatRoomid] || 0)
                        ) {
                            // If the user is still kicked from the room
                            showChatHistory = false;
                            showSendMessage = false;
                        } else {
                            showChatHistory = true;
                            showSendMessage = true;
                        }

                        if (
                            new Date().getTime() <=
                            (data.muteEndTimes[selectedChatRoomid] || 0)
                        ) {
                            // If the user is still muted in the room
                            showSendMessage = false;
                        } else {
                            showSendMessage = true;
                        }
                    }
                });
                fetchMembersInRoom(selectedChatRoomid);

                // Check if user is still kicked from this room
                if (
                    new Date().getTime() <=
                    (kickEndTimes[selectedChatRoomid] || 0)
                ) {
                    // If the user is still kicked from the room
                    showChatHistory = false;
                    showSendMessage = false;
                } else {
                    showChatHistory = true;
                    showSendMessage = true;
                }

                if (
                    new Date().getTime() <=
                    (muteEndTimes[selectedChatRoomid] || 0)
                ) {
                    // If the user is still mute from the room
                    showSendMessage = false;
                } else {
                    showSendMessage = true;
                }
                if (member.kickedTime && member.kickDuration) {
                    const currentTime = new Date().getTime();
                    const kickEndTime =
                        member.kickedTime.getTime() +
                        member.kickDuration * 60 * 1000;
                    if (currentTime <= kickEndTime) {
                        // The user is still within the kick duration
                        showChatHistory = false;
                        showSendMessage = false;
                        // You can display a message to the user indicating the remaining kick duration.
                    }
                }
                const isMember = usersInRoom.some(
                    (member) => member.user.id == usere.id,
                );
                if (!isMember) {
                    const payload = {
                        user: usere,
                        room: selectedChatRoom,
                        role: "Participant",
                    };
                    $session.emit("joinChatRoom", payload);
                }

                $session.emit("getMessagesInChatRoom", selectedChatRoomid);
            });
        } catch (e) {}
    }

    function handleEmojiSelect(event: any) {
        try {
            const selectedEmoji = event.detail.emoji;
            message += selectedEmoji;
            // console.log('emo',selectedEmoji)
            // Do something with the selectedEmoji
        } catch (e) {}
    }

    function createChatRoom() {
        try {
            const payload = {
                title,
                member,
                IdduUser,
                usere,
                isPrivate,
                password: isPrivate ? password : null,
            };
            $session.emit("sendChatRooms", payload);
            showChatRoom = false;
        } catch (e) {}
    }

    function sendMessage() {
        try {
            // console.log('here***-*-*-*-*-')

            $session.emit("sendMessageChannel", {
                message: message,
                sendBy: usere,
                sendBylogin: usere.login,
                sendTo: selectedChatRoomid,
            });
            // console.log(selectedChatRoomid)

            message = ""; // Clear the message after sending
        } catch (e) {}
    }

    function clean() {
        try {
            // showChatHistory = true;
            showChatWindow = true;
            showChatRoom = true;
        } catch (e) {}
    }

    function kickUser(user: any, login: string, roomId: string, duration: any) {
        try {
            $session.emit("kickUser", {
                user,
                roomId: roomId,
                login: login,
                duration,
            });
        } catch (e) {}
    }
    function muteUser(user: any, login: string, roomId: string, duration: any) {
        try {
            $session.emit("muteUser", {
                user,
                roomId: roomId,
                login: login,
                duration,
            });
        } catch (e) {}
    }

    function banUser(user: any, login: string, roomId: string) {
        try {
            $session.emit("banUser", { user, roomId: roomId, login: login });
        } catch (e) {}
    }

    function makeAdmin(user: any, login: string, roomId: string) {
        try {
            $session.emit("makeAdmin", { user, roomId: roomId, login: login });
        } catch (e) {}
    }

    function unbanUser(user: any, userId: any, roomId: any) {
        try {
            $session.emit("unbanUser", { user, userId, roomId });

            // Listen for confirmation or errors
            $session.on("userUnbanned", ({ userId, roomId }: any) => {
                // Update the UI or notify the admin that the user has been unbanned
            });

            $session.on("unbanError", ({ message }: any) => {
                // Handle the error (e.g., display an error message to the admin)
            });
        } catch (e) {}
    }

    //------------------------------OFFLINE ADDINGS----------------------------===============

    async function leaveChatRoom() {
        try {
            if (selectedChatRoom) {
                $session.emit("leaveChatRoom", {
                    user: usere,
                    room: selectedChatRoom,
                });
                selectedChatRoom = null;
                selectedChatRoomid = "";
            } else {
                console.warn("No chat room selected to leave.");
            }
        } catch (e) {}
    }

    async function passChatRoom() {
        try {
            if (selectedChatRoom) {
                let newPassword;
                if (selectedChatRoom.password) {
                    // If there's already a password, prompt for the new password
                    newPassword = prompt("Please enter the new room password:");
                } else {
                    // If there's no password, allow the owner to set one
                    newPassword = prompt("Set a password for the chat room:");
                }
                if (newPassword) {
                    // Emit the event to the server with the new password
                    $session.emit("passChatRoom", {
                        user: usere,
                        room: selectedChatRoom,
                        newPassword: newPassword,
                    });
                } else {
                    console.warn(
                        "Password change aborted. No password provided.",
                    );
                }
            }
        } catch (e) {}
    }

    async function cancelpassChatRoom() {
        try {
            if (selectedChatRoom) {
                if (selectedChatRoom.hashedPassword) {
                    $session.emit("cancelpassChatRoom", {
                        user: usere,
                        room: selectedChatRoom,
                    });
                }
            } else {
                console.warn("Password cancel aborted..");
            }
        } catch (e) {}
    }

    function openProfileModal(username: any) {
        try {
            userToDisplay = username;
            isProfileModalOpen = true;
            isModalVisible = true;
        } catch (e) {}
    }

    function toggleModal() {
        try {
            isModalVisible = !isModalVisible;

            if (!isModalVisible) {
                isProfileModalOpen = false;
            }
        } catch (e) {}
    }

    function handleKeyDown(event: any) {
        try {
            // If the Enter key is pressed
            if (event.key === "Enter") {
                event.preventDefault(); // To prevent a newline or form submission
                sendMessage();
            }

            // If the Tab key is pressed
            if (event.key === "Tab") {
                event.preventDefault(); // Prevent moving to the next input or button

                // Insert a tab character at the cursor's current position
                const start = event.target.selectionStart;
                const end = event.target.selectionEnd;
                message =
                    message.substring(0, start) + "\t" + message.substring(end);

                // Position the cursor after the inserted tab character
                event.target.selectionStart = start + 1;
                event.target.selectionEnd = start + 1;
            }
        } catch (e) {}
    }
</script>

{#if $latestNotification}
    <div class="notification" class:showNotification>
        <p>{$latestNotification.message}</p>
    </div>
{/if}
{#if showChatWindow}
    {#if showChatRoom}
        <div class="chat-window">
            <button
                class="close-btn"
                on:click={() => {
                    // console.log('Close button clicked');
                    showChatWindow = false;
                }}>X</button
            >

            <form on:submit|preventDefault={createChatRoom}>
                <p class="user-list-title">CREATE CHANNEL</p>

                <label>
                    Room Title:
                    <input bind:value={title} required />
                </label>
                <label>
                    <input type="checkbox" bind:checked={isPrivate} /> Is Private
                </label>

                {#if isPrivate}
                    <label>
                        Password:
                        <input type="password" bind:value={password} required />
                    </label>
                {/if}

                <!-- goto('/current-route'); -->

                <button type="submit"> Create Chat Room</button>
            </form>
        </div>
    {/if}
{/if}

<div class="rooms-list">
    <p class="room-list-title">ACTIVE CHANNELS</p>

    <ul>
        {#each chatRooms as room (room.id)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <li
                on:click={() =>
                    room.isPrivate
                        ? promptPasswordAndEnter(room)
                        : selectChatRoom(room)}
            >
                {room.title}
                {#if room.isPrivate}
                    <span class="locked-icon">🔒</span>
                {/if}
            </li>
        {/each}
    </ul>
</div>
{#if selectedChatRoom && showChatHistory}
    <div class="chat-history">
        <button
            class="close-btn"
            on:click={() => {
                // console.log('Close button clicked');
                showChatHistory = false;
            }}>X</button
        >

        <!-- Chat Messages Display Section -->
        <div>
            {#if showChatHistory}
                <p class="user-list-title">CHAT HISTORY</p>
                {#if Array.isArray(chatMessagesPerRoom[selectedChatRoomid])}
                    {#each chatMessagesPerRoom[selectedChatRoomid] as message}
                        <div class="chat-message">
                            <p class="sender">{message.senderLogin}</p>
                            <p>{message.content}</p>
                            <p class="date">
                                {new Date(message.createdAt).toLocaleString()}
                            </p>
                        </div>
                    {/each}
                {/if}
            {/if}
            <div class="message-input">
                {#if showSendMessage}
                    <div class="message-input">
                        <input
                            bind:value={message}
                            on:keydown={handleKeyDown}
                            placeholder="Type your message..."
                        />
                        <button
                            class="absolute right-20 top-1/2 -translate-y-1/2 p-3 bg-yellow-400"
                            on:click={() =>
                                (showEmojiPicker = !showEmojiPicker)}
                        >
                            😀
                        </button>
                        {#if showEmojiPicker}
                            <div class="custom-div">
                                <EmojiPicker
                                    on:emojiSelect={handleEmojiSelect}
                                />
                            </div>
                        {/if}
                        <button on:click={sendMessage}>Send</button>
                    </div>
                {/if}
            </div>
        </div>
        <div class="users-container">
            <ul id="userList">
                <p class="user-list-title">USER LIST</p>
                <p />
                <span class="pa">Welcome {usere.userName}</span>
                <p />

                {#each usersInRoom as user}
                    <li>
                        {user.user.userName}
                        <span class="par">: {user.role}</span>
                        {#if usere.userName != user.user.userName}
                            <button
                                on:click={(e) => {
                                    e.stopPropagation();
                                    openProfileModal(user.user.userName);
                                }}
                            >
                                See Profile
                            </button>
                        {/if}

                        <!-- svelte-ignore empty-block -->
                        {#if user.role === "Admin" && usere.userName != user.user.userName}
                            <!-- {#if usere.role === "Owner"} -->
                            <div>
                                <input
                                    type="number"
                                    class="kickd"
                                    bind:value={kickDuration}
                                    placeholder="Duration (minutes)"
                                    min="1"
                                    max="60"
                                />
                                <button
                                    on:click={() =>
                                        kickUser(
                                            usere,
                                            user.user.login,
                                            selectedChatRoomid,
                                            kickDuration,
                                        )}>Kick</button
                                >
                                <button
                                    on:click={() =>
                                        muteUser(
                                            usere,
                                            user.user.login,
                                            selectedChatRoomid,
                                            kickDuration,
                                        )}>Mute</button
                                >
                            </div>

                            <button
                                on:click={() =>
                                    banUser(
                                        usere,
                                        user.user.login,
                                        selectedChatRoomid,
                                    )}>Ban</button
                            >
                            <button
                                on:click={() =>
                                    unbanUser(
                                        usere,
                                        user.user.login,
                                        selectedChatRoomid,
                                    )}>Unban</button
                            >

                            <button
                                on:click={() =>
                                    makeAdmin(
                                        usere,
                                        user.user.login,
                                        selectedChatRoomid,
                                    )}>Make Admin</button
                            >
                            <!-- {/if} -->
                        {/if}
                        {#if user.role === "Participant" && user.user.userName != usere.userName}
                            <div>
                                <input
                                    type="number"
                                    class="kickd"
                                    bind:value={kickDuration}
                                    placeholder="Duration (minutes)"
                                    min="1"
                                    max="60"
                                />
                                <button
                                    on:click={() =>
                                        kickUser(
                                            usere,
                                            user.user.login,
                                            selectedChatRoomid,
                                            kickDuration,
                                        )}>Kick</button
                                >
                                <button
                                    on:click={() =>
                                        muteUser(
                                            usere,
                                            user.user.login,
                                            selectedChatRoomid,
                                            kickDuration,
                                        )}>Mute</button
                                >
                            </div>

                            <button
                                on:click={() =>
                                    banUser(
                                        usere,
                                        user.user.login,
                                        selectedChatRoomid,
                                    )}>Ban</button
                            >
                            <button
                                on:click={() =>
                                    unbanUser(
                                        usere,
                                        user.user.login,
                                        selectedChatRoomid,
                                    )}>Unban</button
                            >

                            <button
                                on:click={() =>
                                    makeAdmin(
                                        usere,
                                        user.user.login,
                                        selectedChatRoomid,
                                    )}>Make Admin</button
                            >
                        {/if}
                    </li>
                {/each}
            </ul>

            <!-- //------------------------------OFFLINE ADDINGS----------------------------=============== -->

            <!-- The Leave Channel button -->
            <button on:click={leaveChatRoom}>Leave Channel</button>
            <button on:click={passChatRoom}>Change Channel Password</button>
            <button on:click={cancelpassChatRoom}
                >Cancel Channel Password</button
            >
        </div>
    </div>
{/if}
<!-- Profile Modal Structure -->
{#if isModalVisible}
    <div class="modal content">
        <div class="modal-content">
            <h2>User Profile</h2>

            <!-- Display the Profile Information Here -->
            {#if isProfileModalOpen}
                <UserProfileModal username={userToDisplay} />
            {/if}

            <button on:click={toggleModal}>Close</button>
        </div>
    </div>
{/if}

<!-- Debugging button to manually log chat messages -->
<button on:click={clean}>New window</button>

<style>
    .notification {
        position: fixed;
        top: 7%;
        right: 50%;
        padding: 10px;
        background-color: #a9abc2;
        border: 1px solid #181313;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.2); /* Red shadow */
        border-radius: 5px;
        transition: all 0.3s ease-in-out;
        max-width: 300px; /* Adjust the maximum width as needed */
    }

    .notification:hover {
        box-shadow: 0 0 15px rgba(255, 0, 0, 0.4); /* Larger shadow on hover */
    }
    .notification:active {
        position: fixed;
        top: 15%;
        left: 28%;
        width: 38%;
        padding: 10px;
        background-color: #a9abc2;
        border: 1px solid #181313;
        box-shadow: 0 0 15px rgba(255, 0, 0, 0.4); /* Larger red shadow on active */
        border-radius: 10px;
    }
    .showNotification {
        opacity: 1;
        transform: translateY(0);
    }

    .notification:not(.showNotification) {
        opacity: 0;
        transform: translateY(-100%);
        pointer-events: none; /* Prevent interaction with hidden notification */
    }
    .chat-message p {
        white-space: pre-wrap;
    }

    .chat-window {
        position: fixed;
        top: 15%;
        right: 0%;
        width: 34%;
        padding: 20px;
        background-color: #a9abc2;
        border: 1px solid #181313;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.2); /* Red shadow */
        border-radius: 5px;
        color: rgb(14, 3, 3);
        overflow-y: scroll;
    }

    .chat-history {
        position: fixed;
        top: 15%;
        left: 28%;
        width: 38%;
        background-color: #a9abc2;
        border: 1px solid #181313;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.2); /* Red shadow */
        border-radius: 5px;
        overflow-y: auto;
        height: 85vh;
        padding: 15px;
        color: white;
        overflow-y: scroll;

        /* scroll-behavior:auto; */
    }

    .chat-message {
        margin-bottom: 10px;
        padding: 10px;
        background-color: #181010; /* Slightly lighter than the background */
        border-radius: 5px;
        overflow-y: scroll;
    }

    .chat-message p {
        margin: 0;
    }

    .chat-message .sender {
        font-weight: bold;
        color: red;
    }

    .chat-message .date {
        font-size: 0.8rem;
        color: red;
    }

    .rooms-list ul {
        list-style: none;
        background-color: #a5a7b9;
        padding: 10px;
        border-radius: 5px;
    }

    .rooms-list li:hover {
        background-color: red;
        cursor: pointer;
        color: rgb(14, 12, 12);
    }

    .chat-history button,
    .chat-window button,
    .chat-history .message-input button {
        background-color: red;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .chat-window button:hover,
    .chat-history .message-input button:hover,
    .chat-history button:hover {
        background-color: #990000;
    }

    .message-input {
        margin-top: 10px;
        display: flex;
        gap: 10px;
        color: black;
    }

    .message-input input {
        flex-grow: 1;
    }

    .users-container {
        position: fixed;
        top: 35%;
        right: 0%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #a9abc2;
        border: 1px solid #181313;
        width: 34%;
        height: 70vh;

        padding: 20px;
    }

    #userList {
        list-style-type: none;
        padding: 0;
        margin-bottom: 10px;
    }
    .locked-icon {
        margin-left: 5px;
    }

    div.users-container ul#userList li .user-list button {
        background-color: red;
        color: white;
        padding: 1px 3px !important; /* further reduced padding */
        border: none;
        border-radius: 2px;
        margin-left: 1px; /* slight margin reduction for tighter spacing */
        transition: background-color 0.3s ease;
        box-shadow: 0 0 2px rgba(255, 0, 0, 0.2);
        font-size: 0.6rem !important; /* further reduced font-size */
        line-height: 1; /* adjusted line-height */
        vertical-align: middle; /* to align button text vertically in case it's misaligned */
    }

    .par {
        color: #181313; /* Green text color */
        background-color: #a9abc2; /* White background */
        padding: 4px 8px; /* Optional: some padding for better appearance */
        border-radius: 4px; /* Optional: rounded corners for a softer look */
    }
    .kickd {
        color: #181313; /* Green text color */
        padding: 4px 8px; /* Optional: some padding for better appearance */
        border-radius: 4px; /* Optional: rounded corners for a softer look */
    }
    .pa:hover {
        color: #fafafa; /* Green text color */
        background-color: rgb(185, 25, 19); /* red background */
        /* Optional: rounded corners for a softer look */
    }
    .user-list-title {
        text-align: center;
        font-weight: bold;
        color: #181010;
        padding: 4px 8px; /* Optional: some padding for better appearance */
        border-radius: 4px;
    }
    .room-list-title {
        font-weight: bold;
        color: #181010;
        background-color: #a9abc2;
    }

    /* //------------------------------OFFLINE ADDINGS----------------------------=============== */

    .users-container button {
        margin-top: 10px;
    }
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(
            0,
            0,
            0,
            0.7
        ); /* semi-transparent background to highlight the modal */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000; /* to ensure the modal is always on top */
    }

    .modal-content {
        background: #a9abc2; /* Matches the chat window's color */
        padding: 20px;
        border-radius: 5px; /* To keep the consistency of rounded corners */
        width: 60%; /* A comfortable width for a modal, but feel free to adjust */
        max-width: 90%;
        max-height: 80%;
        overflow: auto;
        box-shadow: 0 0 15px rgba(255, 0, 0, 0.3); /* A more pronounced red shadow for emphasis */
        color: rgb(14, 3, 3); /* Keeping the text color consistent */
    }

    .modal-content h2 {
        margin-top: 0;
        color: #181313; /* Matches the .room-list-title color */
        border-bottom: 2px solid #181313; /* A divider for visual separation */
        padding-bottom: 10px;
        margin-bottom: 10px;
    }

    .modal-content button {
        display: block; /* Ensure the close button takes the full width */
        margin-top: 15px; /* Space from content */
        text-align: center; /* To center the 'Close' text */
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
