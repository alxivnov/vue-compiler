<template functional>
	<span :class="[
		props.faStyle == 'regular'
			? 'far'
			: props.faStyle == 'light'
				? 'fal'
				: props.faStyle == 'duotone'
					? 'fad'
					: props.faStyle == 'brand'
						? 'fab'
						: 'fas',
		'fa-' + props.icon,
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
