<script lang="ts">
	import { goto } from "$app/navigation";
    import { onMount } from "svelte";

	let isModalOpen = false;

	export function handleBackHomeModal() {
		try{
			isModalOpen = true;
		}catch (e) {}
	}
	export function handleCancelLeaveGame(){
		try{
			isModalOpen = false
		}catch (e) {}
	}

	export function leaveGame() {
		try{
			isModalOpen = false; // Close the modal
			goto("/"); // Redirect to the home page
		}catch (e) {}
	}

	onMount(()=> {
		const leaveGameButton = document.getElementById("leaveGameButton");

		if (leaveGameButton){
		leaveGameButton.addEventListener("click", () => {
			leaveGame();
    });}
  });
</script>


<nav class="w-full flex gap-10 p-2 justify-center items-center h-full text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
	<button on:click={handleBackHomeModal}>Back to Business</button>
</nav>

{#if isModalOpen}
<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
	<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
  
	<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
	  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
		<div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
		  <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
			<div class="sm:flex sm:items-start">
			  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
				<svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
				</svg>
			  </div>
			  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
				<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Leave Game</h3>
				<div class="mt-2">
				  <p class="text-sm text-gray-500">Are you sure you want to leave game? Once you leave, you are lost as well. This action cannot be undone.</p>
				</div>
			  </div>
			</div>
		  </div>
		  <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
			<button id="leaveGameButton" on:click={leaveGame} type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Leave Game</button>
			<button on:click={handleCancelLeaveGame} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
		  </div>
		</div>
	  </div>
	</div>
  </div>
  {/if}
