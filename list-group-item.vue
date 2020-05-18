<template functional>
	<a
		:href="props.href || '#'"
		:class="[
			'list-group-item',
			props.active !== undefined && props.active !== false && 'active',
			props.disabled !== undefined && props.disabled !== false && 'disabled',
			'list-group-item-action',
			props.fill !== undefined && props.fill !== false && 'flex-fill',
			['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].includes(props.context) && (
				'list-group-item-' + props.context
			),
			props.badge !== undefined && props.badge !== false && 'd-flex',						// badge
			props.badge !== undefined && props.badge !== false && 'justify-content-between',	// badge
			props.badge !== undefined && props.badge !== false && 'align-items-center'			// badge
		]"
		:data-toggle="props.toggle"

		v-bind="data.attrs"
		v-on="listeners"
	>
		<slot></slot>
		<span v-show="props.badge" class="badge badge-primary badge-pill">{{ props.badge }}</span>
	</a>
</template>

<script>
export default {
	props: [
		'active',		// FALSE|true
		'disabled',		// FALSE|true
		'href',
		'fill',			// FALSE|true
		'context',		// primary|secondary|success|danger|warning|info|light|dark
		'badge',
		'toggle'		// list
	]
}
</script>