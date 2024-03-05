<script lang="ts" , context="module">
	import Typewriter from "svelte-typewriter";
	// import Viewport from "svelte-viewport-info";
	import Modal from "$lib/modals/Modal.svelte";
	import Chat from "$lib/chat/Chat.svelte";
	import Game from "$lib/game/Game.svelte";

	// Imports  -[ Functions ]-
	import { closeModal, errorMsg } from "$lib/store/ModalValues";

	// Est ce que Display une Modal  -[ boolean ]-
	import { showModal } from "$lib/store/ModalValues";
	let show_Modal: boolean;
	showModal.subscribe((a: boolean) => {
		show_Modal = a;
	});

	// Nom de la Modal a display  -[ string ]-
	import { selectedPage } from "$lib/store/ModalValues";
	import ErrorModal from "$lib/modals/ErrorModal.svelte";
	let selectedPage_Value: string;
	selectedPage.subscribe((a: string) => {
		selectedPage_Value = a;
	});
	let msgError = "";
	errorMsg.subscribe((a) => {
		msgError = a;
	});
</script>

<main>
	<div class="main">
		<autoTyping>
			<Typewriter loopRandom>
				<p class="py-2 text-2xl text-white">
					In a realm of digital wizardry, a land of fascination.
				</p>
				<p class="py-1 text-2xl text-white">
					Our Transcendence project, a tale of innovation.
				</p>
				<p class="py-1 text-2xl text-white">
					Users are about to embark, an epic recreation, A cosmic Pong
					game, a matchmaking duel
				</p>
				<p class="py-1 text-2xl text-white">
					Within this mystical Nestjs and sevlte, a grand
					foundation,An interface of elegance, a futuristic narration.
				</p>
				<p class="py-0 text-2xl text-white">
					Designed to traverse space, a cosmic exploration, Uniting
					players in time, a cosmic synchronization.
				</p>
				<p class="py-0 text-2xl text-white">
					A chat feature will serve, a global communication, Among
					interstellar gladiators, a cosmic federation.
				</p>
				<!-- <p class="py-6 text-2xl text-white">A cosmic Pong game, a matchmaking duel.</p> -->
				<!-- <p class="py-5 text-2xl text-white">An interface of elegance, a futuristic narration.</p> -->
				<!-- <p class="py-3 text-2xl text-white">Uniting players in time, a cosmic synchronization.</p> -->
				<!-- <p class="py-1 text-2xl text-white">Among interstellar gladiators, a cosmic federation.</p>			 -->
			</Typewriter>
		</autoTyping>
		{#if show_Modal}
			<Modal>
				<!-- Display du Modal demande par le User -->
				{#if selectedPage_Value === "chat"}
					<Chat on:closeModal={closeModal} />
				{:else if selectedPage_Value === "game"}
					<Game on:closeModal={closeModal} />
				{:else if selectedPage_Value === "errorMsg"}
					<ErrorModal msg={msgError} on:closeModal={closeModal} />
				{/if}
			</Modal>
		{/if}
	</div>
</main>

<!-- <svelte:body
	on:viewportchanged={() => {
		// console.log(
		// 	"Viewport Size changed to: ",
		// 	Viewport.Width + "x" + Viewport.Height
		// );
	}}
	on:orientationchangeend={() => {
		// console.log(
		// 	"Screen Orientation changed to: ",
		// 	Viewport.Orientation +
		// 		(Viewport.detailledOrientation == null
		// 			? ""
		// 			: "(" + Viewport.detailledOrientation + ")")
		// );
	}}
/> -->

<style lnag="postcss">
	.main {
		background-image: url("/images/backgroundImg.jpg");
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		z-index: 1;
		content: "";
		position: relative;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	autoTyping {
		/* content: ""; */
		margin-top: 3%;
		font-size: 1rem;
		text-align: center;
		position: relative;
	}
	.py-2,
	.py-1,
	.py-0 {
		font-family: "Courier New", Courier, monospace;
		font-size: 1.1rem;
	}
</style>
