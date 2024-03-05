<script>
	import { createEventDispatcher } from "svelte";
	import "../../global.css";

	const dispatch = createEventDispatcher();

	export let isOpen = false;
	const closeModal = () => {
		dispatch("close");
	};
</script>

{#if isOpen}
	<div class="modal">
		<div class="modal-content">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<span class="close-btn" on:click={closeModal}>&times;</span>
			<slot />
		</div>
	</div>
{/if}

