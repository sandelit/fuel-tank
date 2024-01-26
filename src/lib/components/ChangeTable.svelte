<script lang="ts">
	import { Table } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import { tableMapperValues } from '@skeletonlabs/skeleton';

	export let updateTotal: Function;

	const convertDate = (timestamp: string) => {
		var date = new Date(timestamp);
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();

		day = day < 10 ? '0' + day : day;
		month = month < 10 ? '0' + month : month;

		return day + '/' + month + '/' + year;
	};

	const fetchEvents = async () => {
		const response = await fetch('/api/events');
		const res = response.json();

		return res.then((res) => {
			if (res && res.length > 0) {
				res = res.sort((a, b) => {
					let dateA = new Date(a.created_at),
						dateB = new Date(b.created_at);
					return dateB - dateA;
				});

				res.forEach((event) => {
					event.created_at = convertDate(event.created_at);
					event.change = event.mode === '+' ? '+' + event.change : '-' + event.change;
				});

				updateTotal(res[0].total); // Call the passed function to update in parent
			}

			return {
				head: ['Datum', 'Reg. Nr.', 'Ändring', 'Totalt', 'Namn'],
				body: tableMapperValues(res, ['created_at', 'platenumber', 'change', 'total', 'name'])
			};
		});
	};
</script>

{#await fetchEvents() then result}
	<Table source={result} />
{/await}
