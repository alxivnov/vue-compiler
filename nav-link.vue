<template functional>
	<a
		:class="{
			'nav-item': true,
			'nav-link': true,
			'active': props.active !== undefined,
			'disabled': props.disabled !== undefined,
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