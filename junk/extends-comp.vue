<template>
	<span>{{ computedText }}</span>
</template>

<script>
import ExtendsBase from './extends-base.js';

export default {
	extends: ExtendsBase,
	data() {
		return {
			name: 'COMP.VUE'
		};
	},
	mounted() {
		console.log('mounted comp.vue');
	}
};
</script>
