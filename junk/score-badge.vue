<template functional>
	<span
		:class="[
			data.class,
			data.staticClass,
			props.value >= 0 ? 'badge' + (props.text ? ' text-' + props.text : badgeColor === 'transparent' ? '' : ' text-white') : props.value != null && 'badge'
		]"
		:style="{
			'font-size': 'small',
			'background': badgeColor
		}"
	>
		<slot>{{ props.value != null ? props.value : '' }}</slot>
	</span>
</template>

<script>
export default {
	inheritAttrs: true,

	props: [
		'value',							// score
		'text',								// text color class, WHITE
		'scoreColorMap'						// badge color map (up to X) (last VALUE <= X will be colored in that), DEFAULT: { [undefined]: 'transparent', [null]: 'green', 0: 'lightgreen', 49: 'goldenrod', 69: 'darkorange', 70: 'gray', 89: 'firebrick', 100: 'maroon' }
	],

	computed: {
		badgeColor () {
			// eslint-disable-next-line no-undef
			return this.value != null
				? Object.entries(this.$props.scoreColorMap || { 0: 'lightgreen', 1: 'khaki', 2: 'paleturquoise', 49: 'goldenrod', 69: 'darkorange', 70: 'gray', 89: 'firebrick', 100: 'maroon', [Number.MAX_SAFE_INTEGER]: 'transparent' }).find(v => v[0] >= Number(this.value))[1]
				: (this.value && ((this.$props.scoreColorMap || { [null]: 'green' })[this.value]) || 'transparent');
		}
	}
}
</script>
