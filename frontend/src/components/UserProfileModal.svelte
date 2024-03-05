<script lang="ts">
    import { session } from "$lib/store/store";
    import { onDestroy, onMount } from "svelte";
    import { InvitedUserId, InvitedUserLogin } from "$lib/store/store";
    import InviteToPlayButton from "$lib/game/InviteToPlayButton.svelte";
    import { closeModal } from "$lib/store/ModalValues";

    export let username: any;

    let user: any = null;
    let pictureLink: any;
    let wsClient: any;

    onMount(() => {
        // console.log('here', username)
        session.subscribe((a: any) => {
            wsClient = a;
        });
        wsClient.emit("message", username);

        wsClient.on("userResponse", (data: any) => {
            user = data.user;
            pictureLink = user.avatar;

            InvitedUserLogin.set(user.login);
            InvitedUserId.set(user.id);
        });
        return () => {
            wsClient.off("userResponse");
        };
    });
    onDestroy(() => {
        closeModal();
    });
</script>

<div class="modal-content">
    {#if user}
        <div>
            <img
                class="profile-pic"
                src={pictureLink}
                alt=": 🤖 👨🏻‍🌾 Error  🍪 🤣 :"
            />
        </div>
        <p>Username: {user.userName}</p>
        <p>Login: {user.login}</p>
        <p>Rank: {user.rank}</p>
        <p>Title: {user.title}</p>
        <p>Total Won: {user.wonGameNbr} - {user.lostGameNbr} :Lost</p>
        <InviteToPlayButton />
    {:else}
        <p>Loading user data...</p>
    {/if}
</div>
