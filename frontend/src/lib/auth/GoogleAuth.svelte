<script lang="ts">
	import { goto } from "$app/navigation";
	import { closeModal, openModal, errorMsg } from "$lib/store/ModalValues";
	import {
		authentificated,
		googleAuth,
		isGoogleAuthActivated,
		isGoogleAuthEnabled,
	} from "$lib/store/store";

	// Value de QrCode et Login assigne par fonction parent qui call GoogleAuth
	export let QrCode: string;
	export let login: string;
	$: codeVerif = "";
	let indication: string = "";
	let verif: boolean = false;

	async function handleVerifyCode() {
		const host = import.meta.env.VITE_HOST;
		const response = await fetch(
			`http://${host}:3000/auth/verify_2fa?code=${codeVerif}&login=${login}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (response.ok) {
			let res = await response.json();
			if (res.jwt !== null) {
				// console.log("-[ Google Authentificator ]- OK !");
				const jwt: string = res.jwt;
				// console.log(
				// 	"-[Google Auth]-JWT: de la Reponse GoogleAuth",
				// 	jwt,
				// );
				localStorage.setItem("jwt", jwt);
				authentificated.set(true);
				isGoogleAuthEnabled.set(true);
				googleAuth.set(true);
				verif = true;
				isGoogleAuthActivated.set(false);
			} else {
				// console.log("Google Auth Paramètre 'jwt' { NULL }.");
				localStorage.removeItem("jwt");
				isGoogleAuthActivated.set(false);
				verif = false;
				alert("Google Auth Code Incorect !");
				goto("/");
				location.reload();
			}
		} else {
			localStorage.removeItem("jwt");
			goto("/");
			location.reload();
		}
		verif = false;
	}
</script>

<div>
	<div>Google Authenticator</div>
	<div>Use Google Authenticator App to scan the QR Code</div>
	<img src={QrCode} alt="Error Google generating QR" />

	<div>Code d'authentification Google :</div>
	<div>
		<input
			type="text"
			placeholder="Put code here !"
			bind:value={codeVerif}
		/>
		<button
			on:click={async () => {
				if (!codeVerif.length) {
					indication = "Cannot be empty";
				} else if (!/^\d+$/.test(codeVerif)) {
					indication = "Only digits plz";
				} else if (codeVerif.length != 6) {
					indication = "Only 6 digits plz";
				} else {
					handleVerifyCode();
					closeModal();
					goto("/");
				}
			}}>Verify Code</button
		>
	</div>
	<div>{indication}</div>
</div>

<style>
	button {
		margin-left: 5px;
		border-width: 1px;
		border-color: brown;
		border-radius: 42%;
	}
	button:hover {
		color: brown;
	}
</style>
