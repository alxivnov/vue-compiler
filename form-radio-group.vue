<template functional>
	<div :class="{ 'row ml-0': !bs5 && props.inline !== undefined && props.inline !== false }">
		<label class="me-3" :class="props.inline !== undefined && props.inline !== false ? 'col-form-label' : 'form-label'" v-show="slots().default">
			<slot></slot>

			<span v-show="data.attrs && data.attrs.required !== undefined" class="text-danger">*</span>
		</label>

		<div
			class="form-check custom-control custom-radio"
			:class="{ 'form-check-inline custom-control-inline': props.inline !== undefined && props.inline !== false }"

			v-for="(option, i) in (Array.isArray(props.options) ? props.options : Object.keys(props.options))"
			:key="i"
		>
			<input
				class="form-check-input custom-control-input"
				type="radio"
				:name="data.attrs && (data.attrs.name || data.attrs.id) || data.model && data.model.expression || 'radio'"
				:id="(data.attrs && (data.attrs.name || data.attrs.id) || data.model && data.model.expression || 'radio') + '-' + i"
				:value="Array.isArray(props.options) ? i : option"

				v-bind="{
					...data.attrs,

//					Vue 3
					...(data.attrs
						? data.attrs.modelValue !== undefined
							? {
								checked: data.attrs.modelValue == (Array.isArray(props.options) ? i : option),
								onChange: $event => $emit('update:modelValue', (Array.isArray(props.options) ? i : option))
							}
							: {
								checked: data.model.value == (Array.isArray(props.options) ? i : option)
							}
						: {})
				}"

				v-on="{
					...listeners,
					...(data.model
						? { input: $event => (Array.isArray(listeners.input) ? listeners.input : [ listeners.input ]).forEach(el => el(Array.isArray(props.options) ? i : option)) }
						: {})
				}"
			>
			<label class="form-check-label custom-control-label" :for="(data.attrs && (data.attrs.name || data.attrs.id) || data.model && data.model.expression || 'radio') + '-' + i">
				<slot name="option" :option="Array.isArray(props.options) ? i : option">
					{{ Array.isArray(props.options) ? option : props.options[option] }}
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
		}
	}
}
</script>
