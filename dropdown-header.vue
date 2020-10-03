<script>
export default {
	functional: true,
	props: [
		'level'		// 1|2|3|4|5|6
	],
	render: Vue.component
		? function (createElement, context) {		// v2
			return createElement(
				'h' + (context.props.level || 6),
				{
					class: 'dropdown-header'
				},
				context.slots().default
			)
		}
		: function (props, context) {				// v3
			const { h } = Vue;

			return h(
				'h' + (this.level || 6),
				{
					class: 'dropdown-header'
				},
				this.$slots.default()
			);
		}
}
</script>
