<template functional>
	<div :class="[
/*		'form-check': true,
		'form-check-inline': props.inline,
*/
		'custom-control',
		props.type == 'radio'
			? 'custom-radio'
			: props.switch
				? 'custom-switch'
				: 'custom-checkbox',
		props.inline ? 'custom-control-inline' : null,

		props.col ? 'col-' + props.col : 'col'
	]">
		<input
			v-bind="data.attrs"
			
			v-on="{
				...listeners,
				...(data.model
					? { input: $event => (Array.isArray(listeners.input) ? listeners.input : [ listeners.input ]).forEach(el => el($event.target.checked)) }
					: {})
			}"
			:id="data.attrs && (data.attrs.id || data.attrs.name) || data.model && data.model.expression"
			:name="data.attrs && (data.attrs.name || data.attrs.id) || data.model && data.model.expression"
			:checked="data.attrs && data.attrs.value"
			
			:class="{
//				'form-check-input': true,
				'custom-control-input': true,
				'position-static': !slots().default
			}"

			:type="data.attrs && data.attrs.type || 'checkbox'"
		>

		<label :for="data.attrs && data.attrs.id || data.model && data.model.expression" v-show="slots().default" class="custom-control-label"><!--class="form-check-label"-->
			<slot></slot>
		</label>
	</div>
</template>

<script>
export default {
	inheritAttrs: false,

	props: [
		'col',		// auto|...

		'inline',	// FALSE|true

		'switch'	// FALSE|true
	]
	
	//	disabled
	//	type:		CHECKBOX|radio
}
</script>
