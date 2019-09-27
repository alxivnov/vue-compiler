<template functional>
	<a
		v-bind="data.attrs"
		v-on="listeners"
		
		href="#"
		:class="{
			'dropdown-item': true,
			'active': props.state == 'active',
			'disabled': props.state == 'disabled',

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
		'state',		// active|disabled

		'fas',			// font awesome
		'textStyle',	// primary|secondary|success|danger|warning|info|light|dark|body|muted|white|black-50|white-50
	]
}
</script>
