<script>
// eslint-disable-next-line n/no-unsupported-features/es-syntax
export default {
	functional: true,
	props: ['if'],
	render: function (h, ctx) {
		// remove unnecessary text nodes
		const vue2 = Vue.version < '3.0';
		const children = vue2
			? (ctx && ctx.children || this.$slots.default).filter(vnode => vnode.tag)
			: this.$slots.default();
		const wrapper = (ctx && ctx.props || this).if;

		if (children.length === 0) {
			return undefined;
		} else if (children.length !== 1) {
			console.warn('This component accepts only one root node in its slot');

			return null;
		} else {
			return wrapper ? children[0] : children[0].children || children/*Vue 3*/;
		}
	}
};
</script>
