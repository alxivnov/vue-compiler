<!--
<tab-content>
	<tab-pane id="" active>
</tab-content>
-->

<template>
	<div
		:class="[
			'list-group',
			flush !== undefined && flush !== false && 'list-group-flush',
			horizontal !== undefined && horizontal !== false && ('list-group-horizontal' + (
				['sm', 'md', 'lg', 'xl'].includes(horizontal) ? ('-' + horizontal) : ''
			))
		]"
		v-bind="Object.fromEntries(Object.entries($attrs).filter(([name]) => !(name.startsWith('on') && name.length > 2)))"
		v-on="$listeners"
	>
		<slot v-for="(item, i) in items" :item="item">
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