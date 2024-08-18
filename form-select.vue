<template functional>
	<div :class="[
//		'form-group',
//		'mb-3',
		props.row !== undefined
			? 'row'
			: props.col !== undefined
				? 'col' + (props.col ? '-' + props.col : '')
				: null
	]">
		<label :class="[
			props.row !== undefined
				? 'col-form-label' + (props.size ? '-' + props.size : '')
				: 'form-label',
			props.row !== undefined
				? 'col-' + props.row
				: null
		]" :for="data.attrs && data.attrs.id || data.model && data.model.expression" v-show="slots().default">
			<slot></slot>

			<span v-show="data.attrs && data.attrs.required !== undefined" class="text-danger">*</span>
		</label>

		<select
			v-bind="{
				...data.attrs,

//				Vue 3
				...(data.attrs && data.attrs.modelValue !== undefined
					? {
						value: data.attrs.modelValue,
						onChange: $event => $emit('update:modelValue', $event.target.value)
					}
					: {})
			}"

			v-on="{
				...listeners,
				...(data.model
					? { input: $event => (Array.isArray(listeners.input) ? listeners.input : [ listeners.input ]).forEach(el => el($event.target.value)) }
					: {})
			}"
			:id="data.attrs && (data.attrs.id || data.attrs.name) || data.model && data.model.expression"
			:name="data.attrs && (data.attrs.name || data.attrs.id) || data.model && data.model.expression"

			:class="[
				'form-select',
				props.size
					? 'form-select-' + props.size
					: null,

//				'form-control',
				'custom-select',
				props.size
//					? 'form-control-' + props.size
					? 'custom-select-' + props.size
					: null,
				props.row !== undefined
					? 'col'
					: null,

				data.attrs && data.attrs['is-invalid']
					? 'is-invalid'
					: null
			]"
		>
			<slot name="options">
			</slot>
			<slot name="option" v-for="(option, i) in (Array.isArray(props.options) ? props.options : Object.keys(props.options || {}))" :option="option">
				<option
					:key="i"

					:value="option"
					:selected="(data.model && option == data.model.value) || (data.attrs && option == data.attrs.modelValue)"
				>
					{{ Array.isArray(props.options) ? option : props.options[option] }}
				</option>
			</slot>
		</select>
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
		'col',					// auto|...
		'row',					// true|FALSE

		'size',					// lg|sm

		'feedback-tooltips',	// FALSE|true

		'options'				//
	]
	//	multiple
	//	readonly
}
</script>
