<template>
	<canvas ref="qr"></canvas>
</template>

<script>
// https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js


export default {
	props: [ 'data' ],
	watch: {
		data(newValue, oldValue) {
//			console.log(newValue, oldValue, this.$refs.qr, this.$refs.qr.qrious);

			this.$refs.qr.qrious.set({
				value: newValue
			});
		}
	},
	mounted() {
		let el = this.$refs.qr//document.getElementById('qr');
//		console.log('el', el);
		let qr = new QRious({
			element: el,
//			value: 'https://github.com/neocotic/qrious'
		});
//		console.log('qr', qr);
	}
}
</script>