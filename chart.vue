<template>
	<div>
		<canvas ref="canvas" width="100%" height="100%"></canvas>
	</div>
</template>

<script>
// https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js
// https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.css
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
				options: {
					...options,
					onClick: this.onClick,
					onHover: this.onHover
				}
			});
		},
		onClick(event) {
			this.$emit('click', event, this.chart);
		},
		onHover(event) {
			this.$emit('hover', event, this.chart);
		}
	}
}
</script>
