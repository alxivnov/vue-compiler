<template functional>
	<div :class="{
		'btn-group': true,
		'btn-group-sm': props.size == 'sm',
		'btn-group-lg': props.size == 'lg',
		'btn-group-vertical': props.vertical,
	}">
		<slot></slot>
	</div>
</template>

<script>
export default {
	props: [
		'size',			// sm|lg
		'vertical',		// true|FALSE
	]
}
</script>
