<template>
	<div>
		SLOT:
		<slot name="empty">
		</slot>
		<slot name="string">
			Str
		</slot>
		<slot name="tag">
			<p>Tag</p>
		</slot>
		<slot name="js">
			{{ 'JS' }}
		</slot>
		<slot name="mix">
			Mix: {{ 'JS' }}
		</slot>
		<slot name="prop1" :prop="{ some: 1 }">

		</slot>
		<slot name="prop2" :prop="{ some: 1 }">
			Prop2
		</slot>
	</div>
</template>

<script>
export default {
	props: [
		'prop'
	]
}
</script>