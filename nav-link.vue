<template functional>
	<a
		:class="{
			'nav-item': true,
			'nav-link': true,
			'active': props.active !== undefined && props.active !== false,
			'disabled': props.disabled !== undefined && props.disabled !== false,
		}"
		:href="props.href || '#'"
	>
		<slot></slot>
	</a>
</template>

<script>
export default {
	props: [
		'href',
		'active',			// FALSE|true
		'disabled',			// FALSE|true
	]
}
</script>