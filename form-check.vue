<template functional>
	<div :class="props.col !== undefined
		? props.col
			? 'col-' + props.col
			: 'col'
		: null">
		<div :class="[
/*
			'form-check': true,
			'form-check-inline': props.inline,
*/
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
							checked: data.attrs.modelValue,
							onChange: $event => $emit('update:modelValue', $event.target.checked)
						}
						: {
							checked: data.attrs.value
						}
					: {})
				}"

				v-on="{
					...listeners,
					...(data.model
						? { input: $event => (Array.isArray(listeners.input) ? listeners.input : [ listeners.input ]).forEach(el => el($event.target.checked)) }
						: {})
				}"
				:id="data.attrs && (data.attrs.id || data.attrs.name) || data.model && data.model.expression || 'check'"
				:name="data.attrs && (data.attrs.name || data.attrs.id) || data.model && data.model.expression || 'check'"

				:class="{
//					'form-check-input': true,
					'custom-control-input': true,
					'position-static': !slots().default
				}"

				:type="data.attrs && data.attrs.type || 'checkbox'"
			>

			<label :for="data.attrs && (data.attrs.id || data.attrs.name) || data.model && data.model.expression || 'check'" v-show="slots().default" class="custom-control-label"><!--class="form-check-label"-->
				<slot></slot>
			</label>
		</div>
	</div>
</template>

<script>
export default {
	inheritAttrs: false,

	props: [
		'type',		// CHECKBOX|radio

		'col',		// auto|...

		'inline',	// FALSE|true

		'switch'	// FALSE|true
	]

	//	disabled
}
</script>
