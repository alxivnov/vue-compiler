<template>
	 <div class="col">
		<btn @click.prevent="setup">Load</btn>
		<component v-for="(c, i) in Object.keys(components)" :key="i" class="row" :is="components[`test-${i + 1}`]" v-bind="pp" />
	 </div>
</template>

<script>
export default {
	data() {
		return {
			components: {},
			pp: { some: 'abc' }
		}
	},
	mounted() {

	},
	methods: {
		setup() {
			let path = '/junk/:name.vue';
//			let path = '/dnsintegration/vue/:name'
			console.log('load');
			let comps = [
				{ $comp: { url: path.replace(':name', 'test-1') } },
				{ $comp: { url: path.replace(':name', 'test-2') } },
				{ $comp: { url: path.replace(':name', 'test-3') } }
			];

			this.components = comps
				.reduce((comp, def) => {
					let url = def.$comp.url || def.$comp;
					let key = url.split('/').slice(-1)[0].split('.')[0];
					console.log(key);
					if (!comp[key])
						comp[key] = () => import(url);

					return comp;
				}, { markRaw: true });
			// .reduce((prev, curr) => {
			// 	prev[curr.url] = () => import(`/junk/${curr.url}.vue`);
			// 	return prev;
			// }, {});
		}
	}
}
</script>
