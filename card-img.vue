<template>
	<div :class="col !== undefined && col !== false ? col.length ? ('col-' + col) : 'col' : null">
		<img
			:class="[
				'card-img' + (place ? '-' + place : '')
			]"

			v-bind="Object.fromEntries(Object.entries($attrs).filter(([name]) => !(name.startsWith('on') && name.length > 2)))"
			v-on="$listeners"
		>
	</div>
</template>

<script>
export default {
	props: [
		'place',		// top|bottom
		'col'
	]
}
</script>