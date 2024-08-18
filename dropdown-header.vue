<script>
export default {
	functional: true,
	props: [
		'level'		// 1|2|3|4|5|6
	],
	render: Vue.version < '3.0' && Vue.component
		? function (createElement, context, children) {		// v2
			return createElement(
				'h' + (context.props.level || 6),
				{
					class: 'dropdown-header'
				},
				children || context.slots().default
			)
		}
		: function () {										// v3
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
