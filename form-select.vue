<template>
	<div :class="[
//		'form-group',
//		'mb-3',
		row !== undefined
			? 'row'
			: col !== undefined
				? 'col' + (col ? '-' + col : '')
				: null
	]">
		<label :class="[
			row !== undefined
				? 'col-form-label' + (size ? '-' + size : '')
				: 'form-label',
			row !== undefined
				? 'col-' + row
				: null
		]" :for="$attrs && $attrs.id || $data.model && $data.model.expression" v-show="$slots.default">
			<slot></slot>

			<span v-show="$attrs && $attrs.required !== undefined" class="text-danger">*</span>
		</label>

		<select
			v-bind="{
				...$attrs,

//				Vue 3
				...(vue3//$attrs && $attrs.modelValue !== undefined
					? {
						value: $attrs.modelValue,
						onChange: $event => $emit('update:modelValue', $event.target.value)
					}
					: {})
			}"

			v-on="{
				...$listeners,
				...($data.model
					? { input: $event => (Array.isArray($listeners.input) ? $listeners.input : [ $listeners.input ]).forEach(el => el($event.target.value)) }
					: {})
			}"
			:id="$attrs && ($attrs.id || $attrs.name) || $data.model && $data.model.expression"
			:name="$attrs && ($attrs.name || $attrs.id) || $data.model && $data.model.expression"

			:class="[
				'form-select',
				size
					? 'form-select-' + size
					: null,

//				'form-control',
				'custom-select',
				size
//					? 'form-control-' + size
					? 'custom-select-' + size
					: null,
				row !== undefined
					? 'col'
					: null,

				$attrs && $attrs['is-invalid']
					? 'is-invalid'
					: null
			]"
		>
			<slot name="options">
			</slot>
			<slot name="option" v-for="(option, i) in (Array.isArray(options) ? options : Object.keys(options || {}))" :option="option">
				<option :value="option"
					:key="i"

					:selected="($data.model && option == $data.model.value) || ($attrs && option == $attrs.modelValue)"
				>
					{{ Array.isArray(options) ? option : options[option] }}
				</option>
			</slot>
		</select>
		<small v-show="$slots.text" class="form-text text-muted">
			<slot name="text"></slot>
		</small>
		<div v-show="$slots.valid" :class="[ feedbackTooltips ? 'valid-tooltip' : 'valid-feedback' ]">
			<slot name="valid"></slot>
		</div>
		<div v-show="$slots.invalid" :class="[ feedbackTooltips ? 'invalid-tooltip' : 'invalid-feedback' ]">
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
	],
	computed: {
		vue3() {
			return Vue.version >= '3.0';
		}
	}
	//	multiple
	//	readonly
}
</script>
