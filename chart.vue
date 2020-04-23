<template>
	<canvas ref="canvas" width="100%" height="100%"></canvas>
</template>

<script>
export default {
	props: [
		'type',
		'data',
		'options'
	],
	watch: {
		type(newValue, oldValue) {
			console.log('type', newValue, oldValue);

			this.render(newValue, this.data, this.options);
		},
		data(newValue, oldValue) {
			console.log('data', newValue, oldValue);

			this.render(this.type, newValue, this.options);

		},
		options(newValue, oldValue) {
			console.log('options', newValue, oldValue);

			this.render(this.type, this.data, newValue);
		}
	},
	data() {
		return {
			chart: null
		}
	},
	methods: {
		render(type, data, options) {
			if (this.chart)
				this.chart.destroy();

			this.chart = new Chart(this.$refs.canvas, {
				type: type,
				data: data,
				options: { ...options, onClick: this.onClick }
			});
		},
		onClick(event) {
			this.$emit('click', event, this.chart);
		}
	}
}
</script>
