<template>
	<div :class="{ 'row ml-0': !bs5 && inline !== undefined && inline !== false }">
		<label class="me-3" :class="inline !== undefined && inline !== false ? 'col-form-label' : 'form-label'" v-show="$slots.default">
			<slot></slot>

			<span v-show="$attrs && $attrs.required !== undefined" class="text-danger">*</span>
		</label>

		<div
			class="form-check custom-control custom-radio"
			:class="{ 'form-check-inline custom-control-inline': inline !== undefined && inline !== false }"

			v-for="(option, i) in (Array.isArray(options) ? options : Object.keys(options || {}))"
			:key="i"
		>
			<input :value="Array.isArray(options) ? i : option"
				class="form-check-input custom-control-input"
				type="radio"
				:name="$attrs && ($attrs.name || $attrs.id) || $data.model && $data.model.expression || 'radio'"
				:id="($attrs && ($attrs.name || $attrs.id) || $data.model && $data.model.expression || 'radio') + '-' + i"

				v-bind="{
					...$attrs,

//					Vue 3
					...($attrs
						? vue3//$attrs.modelValue !== undefined
							? {
								checked: $attrs.modelValue == (Array.isArray(options) ? i : option),
								onChange: $event => $emit('update:modelValue', (Array.isArray(options) ? i : option))
							}
							: {
								checked: $data.model.value == (Array.isArray(options) ? i : option)
							}
						: {})
				}"

				v-on="{
					...$listeners,
					...($data.model
						? { input: $event => (Array.isArray($listeners.input) ? $listeners.input : [ $listeners.input ]).forEach(el => el(Array.isArray(options) ? i : option)) }
						: {})
				}"
			>
			<label class="form-check-label custom-control-label" :for="($attrs && ($attrs.name || $attrs.id) || $data.model && $data.model.expression || 'radio') + '-' + i">
				<slot name="option" :option="Array.isArray(options) ? i : option">
					{{ Array.isArray(options) ? option : options[option] }}
				</slot>
			</label>
		</div>
	</div>
</template>

<script>
export default {
	inheritAttrs: false,

	props: [
		'inline',

		'options'				//
	],
	computed: {
		bs5() {
			return !!bootstrap.Modal.getInstance;
		},
		vue3() {
			return Vue.version >= '3.0';
		}
	}
}
</script>
