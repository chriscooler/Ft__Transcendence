<script lang="ts">
	import { goto } from "$app/navigation";
	import { closeModal } from "$lib/store/ModalValues";
	import {
		googleAuth,
		isGoogleAuthActivated,
		isGoogleAuthEnabled,
	} from "$lib/store/store";

	export let login: string;

	async function handleDisable_2fa() {
		const jwt = localStorage.getItem("jwt");
		const data = { login: login };
		const host = import.meta.env.VITE_HOST;
		const response = await fetch(`http://${host}:3000/auth/disable_2fa`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});

		if (response.ok) {
			// console.log("-[ Disable 2fa ]- OK ");
			alert("Two-factor authentication has been turned off.");
		} else {
			alert("Failed to turn off two-factor authentication.");
			goto("/");
		}
		isGoogleAuthEnabled.set(false);
		isGoogleAuthActivated.set(false);
		googleAuth.set(false);
		closeModal();
		goto("/");
	}
</script>

<!-- <div>Desabling Google Authentificator</div>
<div>Confirm your choice :</div>

<div>
	<button on:click={handleDisable_2fa}>Confirm</button>
	<button
		on:click={() => {
			closeModal();
			goto("/Profile");
		}}>No</button
	>
</div> -->

<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
	<h3
		class="text-base font-semibold leading-6 text-gray-900"
		id="modal-title"
	>
		Off Two-factor authentication
	</h3>
	<div class="mt-2">
		<p class="text-sm text-gray-500">
			Are you sure you want to disable Two-factor authentication?
		</p>
	</div>
</div>

<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
	<button
		on:click={() => {
			closeModal();
			goto("/Profile");
		}}>Cancel</button
	>

	<button on:click={handleDisable_2fa}>Confirm</button>
</div>

<style>
	button {
		cursor: pointer;
		color: white;
		border-width: 1px;
		border-radius: 20%;
		background: rgba(255, 0, 0, 0.326);
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
</style>
