<template functional>
	<div :class="[
		'form-group',
		props.row !== undefined
			? 'row'
			: props.col !== undefined
				? 'col' + (props.col ? '-' + props.col : '')
				: null
	]">
		<label :class="[
			props.row !== undefined
				? 'col-form-label' + (props.size ? '-' + props.size : '')
				: null,
			props.row !== undefined
				? 'col-' + props.row
				: null
		]" :for="data.attrs && data.attrs.id || data.model && data.model.expression" v-show="slots().default">
			<slot></slot>

			<span v-show="data.attrs && data.attrs.required !== undefined" class="text-danger fa fas-asterisk"></span>
		</label>

		<textarea
			v-bind="data.attrs"
			
			v-on="{
				...listeners,
				...(data.model
					? { input: $event => (Array.isArray(listeners.input) ? listeners.input : [ listeners.input ]).forEach(el => el($event.target.value)) }
					: {})
			}"
			:id="data.attrs && data.attrs.id || data.model && data.model.expression"
			:name="data.attrs && data.attrs.name || data.model && data.model.expression"

			:class="[
				'form-control',
				props.row !== undefined
					? 'col'
					: null,
				
				data.attrs && data.attrs['is-invalid']
					? 'is-invalid'
					: null
			]"
		></textarea>
		<small v-show="slots().text" class="form-text text-muted">
			<slot name="text"></slot>
		</small>
		<div v-show="slots().valid" :class="[ props.feedbackTooltips ? 'valid-tooltip' : 'valid-feedback' ]">
			<slot name="valid"></slot>
		</div>
		<div v-show="slots().invalid" :class="[ props.feedbackTooltips ? 'invalid-tooltip' : 'invalid-feedback' ]">
			<slot name="invalid"></slot>
		</div>
	</div>
</template>

<script>
export default {
	inheritAttrs: false,
	
	props: [
		'col',	// auto|...
		'row',	// true|FALSE

		'feedback-tooltips'	// FALSE|true
	],
	//	readonly
}
</script>
