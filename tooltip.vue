<template functional>
	<span
		data-toggle="tooltip"
		:title="props.title"
		:data-placement="props.placement"
		:data-html="props.html !== undefined && props.html !== false"
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