<!--
<tab-content>
	<tab-pane id="" active>
</tab-content>
-->

<template functional>
	<div
		:class="[
			'list-group',
			props.flush !== undefined && props.flush !== false && 'list-group-flush',
			props.horizontal !== undefined && props.horizontal !== false && ('list-group-horizontal' + (
				['sm', 'md', 'lg', 'xl'].includes(props.horizontal) ? ('-' + props.horizontal) : ''
			))
		]"
		v-bind="data.attrs"
		v-on="listeners"
	>
		<slot v-for="(item, i) in props.items" :item="item">
			<a :key="i" class="list-group-item">
				{{ item }}
			</a>
		</slot>
	</div>
</template>

<script>
export default {
	props: [
		'items',		// []
		'flush',
		'horizontal'	// undefined|sm|md|lg|xl
	]
}
</script>