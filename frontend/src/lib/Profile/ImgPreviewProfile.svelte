<script lang="ts">
	import { goto } from "$app/navigation";
	import { closeModal } from "$lib/store/ModalValues";
	import { onDestroy } from "svelte";

	export let image: string;
	export let login: string;
	export let username: string;

	async function handleGarderImg() {
		const jwt = localStorage.getItem("jwt");
		const data = { login: login, img: image };
		const host = import.meta.env.VITE_HOST;
		const response = await fetch(`http://${host}:3000/auth/changeImage`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});

		if (response.ok) {
			// console.log("-[ Change Image ]- New Image bien Set");
		} else {
			goto("/");
		}
		closeModal();
		goto("/");
	}

	async function handleNo() {
		closeModal();
		goto("/Profile");
	}
	onDestroy(() => {
		closeModal();
	});
</script>

<div>
	<h3>That is your Preview Bro, Enjoy !!!</h3>
	<div>
		<img class="profile-pic" src={image} alt=" 🤖 ❌ Error 🍪 🤣 " />
	</div>
	<div>
		<p class="info-container">
			<span
				style="font-family:sans-serif;border:1px orange solid;margin-right:5px;"
			>
				Login :
			</span>
			{login}
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			<span
				style="font-family:sans-serif;border:1px orange solid;margin-right:5px;"
			>
				Username :
			</span>
			{username}
		</p>
	</div>
</div>
<br />
<br />
<div>
	<div>Make a Choice Son !</div>
	<button on:click={handleGarderImg}>Garder</button>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<button on:click={handleNo}>Pas Top!</button>
</div>

<style>
	button {
		cursor: pointer;
		color: white; /* Change text color to white */
		border-width: 1px;
		border-radius: 20%;
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
	}

	button:hover {
		background: rgb(67, 90, 26);
	}

	div {
		grid-auto-flow: row;
	}

	.profile-pic {
		max-width: 50%;
		max-height: 50%;
		border-radius: 200px;
		align-items: center;
		position: relative;
		border-color: black;
		border-width: 2px;
	}
</style>
