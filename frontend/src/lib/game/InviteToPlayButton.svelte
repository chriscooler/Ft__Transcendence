<script lang="ts">
	import { goto } from "$app/navigation";

	async function handleInviteToPlay() {
		try{
		goto("/game");
		}catch (e) {}
	}
</script>

<div>
	<button on:click={handleInviteToPlay}>Play Moi</button>
</div>

<style>
	button {
		color: white; /* Change text color to white */
		border-width: 1px;
		border-radius: 33%;
		background: rgba(41, 25, 213, 0.326); /* A cool blue color */
		/* border-radius: 3px; */
		padding: 5px 5px;
		font-size: 8px;
		border: 2px solid #eff1f4;
		/* transition: background 0.3s ease, color 0.3s ease; */
		margin-left: 0;
		margin-right: 0;
		cursor: pointer;
	}
</style>
