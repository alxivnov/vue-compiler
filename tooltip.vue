<template>
	<span
		data-toggle="tooltip"
		:title="title"
		:data-placement="placement"
		:data-html="html !== undefined && html !== false"

		data-bs-toggle="tooltip"
		:data-bs-placement="placement"
		:data-bs-html="html !== undefined && html !== false"
	>
		<slot></slot>
	</span>
</template>

<script>
export default {
	props: [
		'title',
		'placement',	// TOP|right|bottom|left
		'html',			// FALSE|true
	],
}
</script>