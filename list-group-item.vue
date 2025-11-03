<template>
	<a
		:href="href || '#'"
		:class="[
			'list-group-item',
			active !== undefined && active !== false && 'active',
			disabled !== undefined && disabled !== false && 'disabled',
			'list-group-item-action',
			fill !== undefined && fill !== false && 'flex-fill',
			['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].includes(context) && (
				'list-group-item-' + context
			),
			badge !== undefined && badge !== false && 'd-flex',						// badge
			badge !== undefined && badge !== false && 'justify-content-between',	// badge
			badge !== undefined && badge !== false && 'align-items-center'			// badge
		]"
		:data-toggle="toggle"

		:data-bs-toggle="toggle"

		v-bind="Object.fromEntries(Object.entries($attrs).filter(([name]) => !(name.startsWith('on') && name.length > 2)))"
		v-on="$listeners"
	>
		<slot></slot>
		<span v-show="badge" class="badge badge-primary badge-pill">{{ badge }}</span>
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