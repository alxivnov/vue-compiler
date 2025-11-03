<template>
	<span :class="[
		faStyle == 'regular'
			? 'far'
			: faStyle == 'light'
				? 'fal'
				: faStyle == 'duotone'
					? 'fad'
					: faStyle == 'brand'
						? 'fab'
						: 'fas',
		'fa-' + icon,
	]"></span>
</template>

<script>
export default {
	props: [
		'faStyle',		// SOLID|regular|light|duotone|brand
		'icon',			// font awesome
	]
}
</script>
