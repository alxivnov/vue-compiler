import ExtendsBase from './extends-base.vue';

export default {
	template: /*html*/`
	<span>{{ computedText }}</span>
	`,
	extends: ExtendsBase,
	data() {
		return {
			name: 'COMP.JS'
		};
	},
	mounted() {
		console.log('mounted comp.js');
	}
};
