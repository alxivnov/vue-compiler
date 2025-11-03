<template>
	<a
		v-bind="Object.fromEntries(Object.entries($attrs).filter(([name]) => !(name.startsWith('on') && name.length > 2)))"
		v-on="$listeners"

		href="#"
		:class="{
			['dropdown-' + ($slots.default || fas ? 'item' : 'divider')]: true,
			'active': state == 'active' || $attrs && $attrs.active !== undefined && $attrs.active !== false,
			'disabled': state == 'disabled' || $attrs && $attrs.disabled !== undefined && $attrs.disabled !== false,

			['text-' + textStyle]: textStyle,
		}"
	>
		<span
			:v-show="fas"
			:class="{
				'fas': fas,
				['fa-' + fas]: fas,
				'fa-fw': true,

				'mr-1 me-1': fas && $slots.default,
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
