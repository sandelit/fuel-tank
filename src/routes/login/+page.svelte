<script lang="ts">
	import { userSession } from '$lib/store';
	import '../../app.postcss';
	import { goto } from '$app/navigation';

	let password = '';

	const login = async () => {
		const body = JSON.stringify({ password });

		const response = await fetch('/api/login', {
			method: 'POST',
			body
		});
		const res = await response.json();
		if (res.success) {
			userSession.set(true);
			goto('/');
		}
	};
</script>

<div class="relative top-20 mx-auto p-8 border w-96 shadow-lg rounded-md bg-surface-900">
	<form id="myForm" class="flex flex-col gap-6 mb-6">
		<h2>Lösenord</h2>
		<input bind:value={password} class="input" type="password" required placeholder="" />

		<div class="flex justify-center gap-4">
			<button type="submit" on:click={login} class="btn variant-filled w-1/2">Logga in</button>
		</div>
	</form>
</div>
