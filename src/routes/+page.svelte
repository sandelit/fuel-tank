<script lang="ts">
	import '../app.postcss';
	import ChangeTable from '$lib/components/ChangeTable.svelte';
	import { updateTrigger } from '$lib/store';
	import { initializeStores, type ToastStore } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	let modal: HTMLDivElement;
	let platenumber = '';
	let change;
	let name = '';
	let fuelTotal: number;
	let mode: '+' | '-';
	let visible = false;

	const updateTotal = (value) => {
		fuelTotal = value;
	};

	const openModal = () => {
		modal.classList.remove('hidden');
		platenumber = '';
		change = null;
		name = '';
	};

	const closeModal = () => {
		modal.classList.add('hidden');
		(platenumber = ''), (change = null);
		name = '';
	};

	const makeChange = async () => {
		change = change.match(/\d/g);
		change = change.join('');

		const obj = {
			platenumber,
			change,
			total: 0,
			name,
			mode
		};

		if (mode === '+') {
			obj.total = Number(fuelTotal) + Number(change);

			if (obj.total > 1000) {
				const t: ToastStore = {
					message: 'Tanken kan inte ha mer än 1000L',
					background: 'variant-filled-error'
				};
				toastStore.trigger(t);
				return;
			}
		} else {
			obj.total = Number(fuelTotal) - Number(change);
			if (obj.total < 0) {
				const t: ToastStore = {
					message: 'Tanken kan inte ha mindre än 0L',
					background: 'variant-filled-error'
				};
				toastStore.trigger(t);
				return;
			}
		}

		const body = JSON.stringify(obj);

		const response = await fetch('/api/events/', { method: 'POST', body });
		const res = await response.json();
		if (res.status === 201) {
			updateTrigger.update((n) => n + 1); // Increment the trigger to indicate an update
		}
		closeModal();
		change = '';
		platenumber = '';
		name = '';
	};
</script>

<main class="container flex flex-col items-center justify-items-center">
	{#if fuelTotal}
		<h1 class="h1 text-5xl text-center mt-8">{fuelTotal} / 1000 L</h1>
	{:else}
		<div class="mt-8"></div>
	{/if}

	<div class="my-8 flex gap-8">
		<button
			class="btn variant-filled font-bold"
			on:click={() => {
				openModal();
				mode = '+';
			}}>Fyll tanken</button
		>
		<button
			class="btn variant-filled font-bold"
			on:click={() => {
				openModal();
				mode = '-';
			}}>Tanka bil</button
		>
	</div>

	<ChangeTable {updateTotal} />

	<div bind:this={modal} id="myModal" class="hidden fixed overflow-y-auto h-full w-full">
		<div class="relative top-20 mx-auto p-8 border w-96 shadow-lg rounded-md bg-surface-900">
			<form id="myForm" class="flex flex-col gap-6 mb-6">
				<input bind:value={platenumber} class="input" type="text" required placeholder="Reg. Nr." />
				<input bind:value={change} class="input" type="text" placeholder="Mängd" />
				<input bind:value={name} class="input" type="text" placeholder="Namn" />

				<div class="flex justify-center gap-4">
					<button type="submit" on:click={makeChange} class="btn variant-filled w-1/2">Ok</button>
					<button on:click={closeModal} class="btn variant-filled w-1/2">Stäng</button>
				</div>
			</form>
		</div>
	</div>
</main>
