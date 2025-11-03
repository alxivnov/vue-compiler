<template>
	<span
		:title="title || $data.title"
		:class="[
			$data.class,
			$data.staticClass,
			+mValue >= 0 ? (badgeColor === 'transparent' ? '' : 'badge') + (text ? (' text-' + text) : (badgeColor === 'transparent' ? '' : ' text-white')) : (mValue != null && !isSpecialValue && 'badge text-white')
		]"
		:style="{
			...$data.style,
			'font-size': 'small',
			'background': badgeColor,
			'text-shadow': '0 0 2px #5e5e5e'
		}"
	>
		<span v-if="mValue === 'progress'"><vue-feather type="rotate-cw" animation="spin" animation-speed="medium" stroke="dodgerblue" size="16" /></span>
		<span v-else-if="mValue === 'errdgr'"><vue-feather type="alert-octagon" stroke="red" size="16" /></span>
		<span v-else-if="mValue === 'errwrn'"><vue-feather type="alert-triangle" stroke="orange" size="16" /></span>
		<span v-else-if="mValue === 'nil'" class="badge bg-info text-white">{{ 'N/A' }}</span>
		<slot v-else>{{ mValue != null ? mValue : '' }}</slot>
	</span>
</template>

<script>
const nilVals = [
	'progress',
	'errdgr',
	'errwrn',
	'nil'
];
export default {
	inheritAttrs: true,

	components: {
		VueFeather: Vue.defineAsyncComponent(() => import('vue-feather.vue'))
	},

	props: [
		'title',							// HTML title
		'modelValue',					// score
													// SPECIAL VALUES:
													// - progress: displays an in-progress animation
													// - errdgr: displays a danger icon
													// - errwrn: displays a warning icon
													// - nil: displays a N/A badge
		'text',								// text color class, WHITE
		'scoreColorMap'				// badge color map (up to MAP_STEP_X) (last VALUE <= MAP_STEP_X will be colored in that), DEFAULT: { [undefined]: 'transparent', [null]: 'green', 0: 'lightgreen', 49: 'goldenrod', 69: 'darkorange', 70: 'gray', 89: 'firebrick', 100: 'maroon' }
	],

	computed: {
		mValue () {
			return [ this.modelValue, /*this.value,*/ this.$attrs.modelValue, this.$attrs.value ].find(v => v != null);
		},
		scMap () {
			return this.mValue != null && !nilVals.includes(this.mValue)
			? this.scoreColorMap || this.$attrs.scoreColorMap || { 0: 'forestgreen', 1: 'darkkhaki', 2: 'steelblue', 49: 'goldenrod', 69: 'darkorange', 70: 'gray', 89: 'firebrick', 100: 'maroon', [Number.MAX_SAFE_INTEGER]: 'transparent' }
			: this.scoreColorMap || this.$attrs.scoreColorMap || { [null]: 'green' };
		},
		isSpecialValue () {
			return [
				'progress',
				'errdgr',
				'errwrn',
				'nil'
			].includes(this.mValue);
		},
		badgeColor () {
			// eslint-disable-next-line no-undef
			return this.mValue != null && !nilVals.includes(this.mValue)
				// ? Object.entries(this.$props.scoreColorMap || { 0: 'lightgreen', 1: 'khaki', 2: 'paleturquoise', 49: 'goldenrod', 69: 'darkorange', 70: 'gray', 89: 'firebrick', 100: 'maroon', [Number.MAX_SAFE_INTEGER]: 'transparent' }).find(v => +v[0] >= Number(this.mValue))[1]
				? Object.entries(this.scMap).find(v => +v[0] >= +this.mValue)[1]
				: ((this.mValue && ((this.scMap)[this.mValue])) || 'transparent');
		}
	}
}
</script>
