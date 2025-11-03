<template>
	<div :class="{
		'btn-group': true,
		'btn-group-sm': size == 'sm',
		'btn-group-lg': size == 'lg',
		'btn-group-vertical': vertical,
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
