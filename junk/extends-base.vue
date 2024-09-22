<template>
	<span>{{ computedText }}</span>
</template>

<script>
export default {
	props: [
		'text'
	],
	data() {
		return {
			name: 'BASE.VUE'
		};
	},
	computed: {
		computedText() {
			return this.text || this.name;
		}
	},
	mounted() {
		console.log('mounted base.vue');
	}
};
</script>
