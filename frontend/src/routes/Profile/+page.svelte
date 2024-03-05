<script lang="ts">
	import Profilepage from "$lib/Profile/Profilepage.svelte";
</script>

<div class="background" />

<main>
	<div class="box">
		<Profilepage />
	</div>
</main>

<style>
	.background {
		background-image: url("/images/milky_galaxy.jpg"); /* Add your image URL here */
		background-size: cover; /* Adjust background-size property as needed */
		background-position: center; /* Center the background image */
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1; /* Place the background behind the .box */
	}

	.box {
		width: 880px;
		height: 600px;
		/* width: 60%;
		height: 72%; */
		border: 1px solid #aaa;
		border-radius: 6px;
		box-shadow: 20px 300px 100px rgba(255, 5, 5, 0.1);
		padding: 3em;
		/* margin: 0 0 1em 0;
		margin-top: 0%; */
		margin: 0 auto; /* Center horizontally */
		position: fixed;
		top: 60%; /* Center vertically */
		left: 50%; /* Center horizontally */
		transform: translate(-50%, -50%);
	}
</style>
