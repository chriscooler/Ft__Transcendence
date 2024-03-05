<script lang="ts">
	import { goto } from "$app/navigation";

	async function EnterGame() {
		try {
			const jwt = localStorage.getItem("jwt");
			const host = import.meta.env.VITE_HOST;
			const response = await fetch(`http://${host}:3000/user/enterGame`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				// console.log("-[ Enter Game Button ]- ");
			} else {
				goto("/");
			}
			goto("/Friends");
		} catch (e) {}
	}
</script>

<div>
	<button on:click={EnterGame}>Enter Game</button>
</div>

<style>
	button {
		color: blue;
		border-width: 1px;
		border-radius: 25%;
		border-color: blue;
		margin-left: 2px;
		margin-right: 2px;
	}
</style>
