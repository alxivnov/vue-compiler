<template functional>
	<div :class="props.col !== undefined && props.col !== false ? props.col.length ? ('col-' + props.col) : 'col' : null">
		<img
			:class="[
				'card-img' + (props.place ? '-' + props.place : '')
			]"

			v-bind="data.attrs"
			v-on="listeners"
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