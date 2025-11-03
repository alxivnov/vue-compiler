<script>
// eslint-disable-next-line n/no-unsupported-features/es-syntax
export default {
	// functional: true,
	props: ['if'],
	render: function (h, ctx) {
		// remove unnecessary text nodes
		const vue3 = Vue.version >= '3.0';
		const children = vue3
			? this.$slots.default()
			: ((ctx && ctx.children) || this.$slots.default).filter(vnode => vnode.tag);
		const wrapper = ((ctx && ctx.props) || this).if;

		// eslint-disable-next-line no-empty
		if (children.length === 0) {

		} else if (children.length !== 1) {
			console.warn('This component accepts only one root node in its slot');

			return null;
		} else {
			const firstChild = wrapper ? children[0] : children[0].children || children/* Vue 3 */;
			if (typeof firstChild === 'object' && !Array.isArray(firstChild)) {
				// const fn = Object.values(firstChild).find(v => typeof v === 'function');
				// if (fn) return fn();
				// NOT FUNCTIONAL ON Vue3 - SEEMS LIKE WHERE CHILDREN ARE DEFINED WITH SLOT FUNCTIONS TO BE EVALUATED INSTEAD OF ALREADY EVALUATED ACTUAL CHILDREN
				return children;
			}
			return firstChild;
		}
		return children;
	}
};
</script>
