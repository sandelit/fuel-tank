<script lang="ts">
	import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import { updateTrigger } from '$lib/store'; // Adjust the path as necessary
	import { onDestroy } from 'svelte';

	export let updateTotal: Function;

	let events = [];
	let tableSource;

	function setTableSource() {
		return {
			head: ['Datum', 'Reg. Nr.', 'Ändring', 'Totalt', 'Namn'],
			body: tableMapperValues(events, ['created_at', 'platenumber', 'change', 'total', 'name'])
			// ... other parts of the table source
		};
	}

	// Subscribe to the updateTrigger store
	const unsubscribe = updateTrigger.subscribe((value) => {
		// Fetch events whenever the trigger changes
		fetchEvents();
	});

	// Cleanup subscription on destroy
	onDestroy(unsubscribe);

	async function fetchEvents() {
		const response = await fetch('/api/events');
		const res = await response.json();
		//console.log('Fetched data:', res); // Debugging

		res.sort((a, b) => {
			let dateA = new Date(a.created_at);
			let dateB = new Date(b.created_at);
			return dateB - dateA;
		});
		events = res.map((event) => {
			event.created_at = convertDate(event.created_at);
			event.change = event.mode === '+' ? '+' + event.change : '-' + event.change;
			return event;
		});
		updateTotal(res[0].total); // Call the passed function to update in parent
		tableSource = setTableSource(); // Update the table source
		//console.log('Updated table source:', tableSource); // Debugging
	}

	function convertDate(timestamp: string) {
		var date = new Date(timestamp);
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();

		day = day < 10 ? '0' + day : day;
		month = month < 10 ? '0' + month : month;

		return day + '/' + month + '/' + year;
	}
</script>

{#if tableSource}
	<Table source={tableSource} />
{:else}
	<p>Loading...</p>
{/if}
