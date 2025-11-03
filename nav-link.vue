<template>
	<a
		:class="{
			'nav-item': true,
			'nav-link': true,
			'active': state == 'active' || $attrs && $attrs.active !== undefined && $attrs.active !== false,
			'disabled': state == 'disabled' || $attrs && $attrs.disabled !== undefined && $attrs.disabled !== false,
		}"
		:href="href || '#'"
	>
		<slot></slot>
	</a>
</template>

<script>
export default {
	props: [
		'href',
		'state',					// active|disabled
//		active						// FALSE|true
//		disabled					// FALSE|true
	]
}
</script>