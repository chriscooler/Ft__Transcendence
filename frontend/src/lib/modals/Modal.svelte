<script lang="ts">
	import { closeModal } from "$lib/store/ModalValues";
</script>

<main>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-backdrop" on:click={() => closeModal()}>
		<div class="modal-content" on:click={(e) => e.stopPropagation()}>
			<slot />
		</div>
	</div>
</main>

<style>
	.modal-backdrop {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2;
		position: absolute;
	}

	.modal-content {
		width: 90%;
		max-width: 600px;
		max-height: 90%;
		background-color: white;
		border-radius: 8px;
		padding: 20px;
		overflow-y: auto;
		z-index: 2;
		position: absolute;
	}
</style>
