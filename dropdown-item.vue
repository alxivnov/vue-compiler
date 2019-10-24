<template functional>
	<a
		v-bind="data.attrs"
		v-on="listeners"
		
		href="#"
		:class="{
			['dropdown-' + (slots().default || props.fas ? 'item' : 'divider')]: true,
			'active': props.active !== undefined && props.active !== false,
			'disabled': props.disabled !== undefined && props.disabled !== false,

			['text-' + props.textStyle]: props.textStyle,
		}"
	>
		<span
			:v-show="props.fas"
			:class="{
				'fas': props.fas,
				['fa-' + props.fas]: props.fas,
				'fa-fw': true,

				'mr-1': props.fas && slots().default,
			}"
		></span>
		<slot></slot>
	</a>
</template>

<script>
export default {
	props: [
		'active',
		'disabled',

		'fas',			// font awesome
		'textStyle',	// primary|secondary|success|danger|warning|info|light|dark|body|muted|white|black-50|white-50
	]
}
</script>
