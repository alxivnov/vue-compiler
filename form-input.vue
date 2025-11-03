<template>
	<div :class="[
		$attrs && $attrs.type == 'file'
			? 'custom-file'
//			: 'form-group',
//			: 'mb-3',
			: null,
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
				: null,

			$attrs && $attrs.type == 'file'
				? 'custom-file-label'
				: null,
		]" :for="$attrs && $attrs.id || $data.model && $data.model.expression" v-show="$slots.default">
			<slot></slot>

			<i v-show="$attrs && $attrs.required !== undefined" class="fas fa-asterisk text-danger" style="font-size: 1ex"></i>
		</label>

		<input
			v-bind="{
				...$attrs,

//				Vue 3
				...(vue3//$attrs && $attrs.modelValue !== undefined
					? {
						value: $attrs.modelValue,
						onInput: $event => $emit('update:modelValue', $event.target.value)
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
				$attrs && $attrs.type == 'file'
//					? 'form-control-file'
					? 'custom-file-input form-control'
					: $attrs && $attrs.type == 'range'
//						? 'form-control-range'
						? 'custom-range'
						: plaintext
							? 'form-control-plaintext'
							: 'form-control',
				size
					? 'form-control-' + size
					: null,
				row !== undefined
					? 'col'
					: null,

				$attrs && $attrs['is-invalid']
					? 'is-invalid'
					: null
			]"

			:type="$attrs && $attrs.type || 'text'"
		>
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
		'plaintext',			// FALSE|true

		'feedback-tooltips'		// FALSE|true
	],
	computed: {
		vue3() {
			return Vue.version >= '3.0';
		}
	}
	//	readonly
	//	type
	//	data-browse
}
</script>
