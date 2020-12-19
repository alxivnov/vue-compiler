<template functional>
	<div :class="props.col !== undefined
		? props.col
			? 'col-' + props.col
			: 'col'
		: null">
		<div :class="[

			'form-check',
			props.switch ? 'form-switch' : null,
			props.inline ? 'form-check-inline' : null,

			'custom-control',
			props.type == 'radio'
				? 'custom-radio'
				: props.switch
					? 'custom-switch'
					: 'custom-checkbox',
			props.inline ? 'custom-control-inline' : null,
/*
			props.col !== undefined
				? props.col
					? 'col-' + props.col
					: 'col'
				: null
*/
		]">
			<input
				v-bind="{
					...data.attrs,

//				Vue 3
				...(data.attrs
					? data.attrs.modelValue !== undefined
						? {
							checked: props.type == 'radio' ? (data.attrs.modelValue == (data.attrs.value || props.htmlValue)) : data.attrs.modelValue,
							onChange: $event => $emit('update:modelValue', props.type == 'radio' ? (data.attrs.value || props.htmlValue) : $event.target.checked)
						}
						: {
							checked: props.type == 'radio' ? (data.model.value == props.htmlValue) : data.attrs.value
						}
					: {})
				}"

				v-on="{
					...listeners,
					...(data.model
						? { input: $event => (Array.isArray(listeners.input) ? listeners.input : [ listeners.input ]).forEach(el => el(props.type == 'radio' ? props.htmlValue : $event.target.checked)) }
						: {})
				}"
				:id="data.attrs && (data.attrs.id || data.attrs.name) || data.model && data.model.expression || 'check'"
				:name="data.attrs && (data.attrs.name || data.attrs.id) || data.model && data.model.expression || 'check'"

				:class="{
					'form-check-input': true,
					'custom-control-input': true,
					'position-static': !slots().default
				}"

				:type="props.type || 'checkbox'"
			>

			<label :for="data.attrs && (data.attrs.id || data.attrs.name) || data.model && data.model.expression || 'check'" v-show="slots().default" class="form-check-label custom-control-label">
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

		'switch'	// FALSE|true
	]

	//	disabled
}
</script>
