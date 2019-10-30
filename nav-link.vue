<template functional>
	<a
		:class="{
			'nav-item': true,
			'nav-link': true,
			'active': props.state == 'active' || data.attrs && data.attrs.active !== undefined && data.attrs.active !== false,
			'disabled': props.state == 'disabled' || data.attrs && data.attrs.disabled !== undefined && data.attrs.disabled !== false,
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
		'state',					// active|disabled
//		active						// FALSE|true
//		disabled					// FALSE|true
	]
}
</script>