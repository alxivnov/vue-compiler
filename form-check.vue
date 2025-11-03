<template>
	<div :class="col !== undefined
		? col
			? 'col-' + col
			: 'col'
		: null">
		<div :class="[

			'form-check',
			formSwitch ? 'form-switch' : null,
			inline ? 'form-check-inline' : null,

			'custom-control',
			type == 'radio'
				? 'custom-radio'
				: formSwitch
					? 'custom-switch'
					: 'custom-checkbox',
			inline ? 'custom-control-inline' : null,
/*
			col !== undefined
				? col
					? 'col-' + col
					: 'col'
				: null
*/
		]">
			<input
				v-bind="{
					...$attrs,

//					Vue 3
					...($attrs
						? vue3//$attrs.modelValue !== undefined
							? {
								checked: type == 'radio' ? ($attrs.modelValue == ($attrs.value || htmlValue)) : $attrs.modelValue,
								onChange: $event => $emit('update:modelValue', type == 'radio' ? ($attrs.value || htmlValue) : $event.target.checked)
							}
							: {
								checked: type == 'radio' ? ($data.model.value == htmlValue) : $attrs.value
							}
						: {})
				}"

				v-on="{
					...$listeners,
					...($data.model
						? { input: $event => (Array.isArray($listeners.input) ? $listeners.input : [ $listeners.input ]).forEach(el => el(type == 'radio' ? htmlValue : $event.target.checked)) }
						: {})
				}"
				:id="$attrs && ($attrs.id || $attrs.name) || $data.model && $data.model.expression || 'check'"
				:name="$attrs && ($attrs.name || $attrs.id) || $data.model && $data.model.expression || 'check'"

				:class="{
					'form-check-input': true,
					'custom-control-input': true,
					'position-static': !$slots.default
				}"

				:type="type || 'checkbox'"
			>

			<label :for="$attrs && ($attrs.id || $attrs.name) || $data.model && $data.model.expression || 'check'" v-show="$slots.default" class="form-check-label custom-control-label">
				<slot></slot>
			</label>
		</div>
	</div>
</template>

<script>
export default {
	inheritAttrs: false,

	props: [
		'html-value',

		'type',		// CHECKBOX|radio

		'col',		// auto|...

		'inline',	// FALSE|true

		'form-switch'	// FALSE|true
	],
	computed: {
		vue3() {
			return Vue.version >= '3.0';
		}
	}

	//	disabled
}
</script>
