<script>
export default {
	functional: true,
	props: [
		'level'		// 1|2|3|4|5|6
	],
	render (createElement, context) {
		return createElement(
			'h' + context.props.level || 6,
			{
				class: 'dropdown-header'
			},
			context.slots().default
		);
	}
}
</script>
