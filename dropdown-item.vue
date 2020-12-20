<template functional>
	<a
		v-bind="data.attrs"
		v-on="listeners"

		href="#"
		:class="{
			['dropdown-' + (slots().default || props.fas ? 'item' : 'divider')]: true,
			'active': props.state == 'active' || data.attrs && data.attrs.active !== undefined && data.attrs.active !== false,
			'disabled': props.state == 'disabled' || data.attrs && data.attrs.disabled !== undefined && data.attrs.disabled !== false,

			['text-' + props.textStyle]: props.textStyle,
		}"
	>
		<span
			:v-show="props.fas"
			:class="{
				'fas': props.fas,
				['fa-' + props.fas]: props.fas,
				'fa-fw': true,

				'mr-1 me-1': props.fas && slots().default,
			}"
		></span>
		<slot></slot>
	</a>
</template>

<script>
export default {
	props: [
		'state',		// active|disabled
//		active			// FALSE|true
//		disabled		// FALSE|true

		'fas',			// font awesome
		'textStyle',	// primary|secondary|success|danger|warning|info|light|dark|body|muted|white|black-50|white-50
	]
}
</script>
