<script>
	let fuelLevel = 850;
	let img = '/fueltank' + String(fuelLevel).charAt(0) + '.png';
</script>

<div class="mt-8">
	<!-- 
	<img src="{img}" alt="bild av bensintank" />
-->

	<h1 class="h1 text-5xl text-center">{fuelLevel} / 1000 L</h1>
</div>
