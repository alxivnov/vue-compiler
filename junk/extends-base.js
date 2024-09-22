export default {
	template: /*html*/`
	<span>{{ computedText }}</span>
	`,
	props: [
		'text'
	],
	data() {
		return {
			name: 'BASE.JS'
		};
	},
	computed: {
		computedText() {
			return this.text || this.name;
		}
	},
	mounted() {
		console.log('mounted base.js');
	}
};
