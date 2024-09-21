<template>
	 <div class="col">
		<btn @click.prevent="setupComponents">Load</btn>
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
		setupComponents() {
			let path = '/junk/:name.vue';
//			let path = '/dnsintegration/vue/:name'
			console.log('load');
			let comps = [
				{ $comp: { url: path.replace(':name', 'test-1') } },
				{ $comp: { url: path.replace(':name', 'test-2') } },
				{ $comp: { url: path.replace(':name', 'test-3') } }
			];

			comps = comps
				.reduce((comp, def) => {
					let url = def.$comp.url || def.$comp;
					let key = url.split('/').slice(-1)[0].split('.')[0];
					console.log(key);
					if (!comp[key])
						comp[key] = Vue.component(key, () => import(url));

					return comp;
				}, { /*markRaw: true*/ });
			console.log('loaded', comps);
			this.components = typeof (Vue.markRaw) == 'function'
				// Vue 3
				? Vue.markRaw(comps)
				// Vue 2
				:comps
			// .reduce((prev, curr) => {
			// 	prev[curr.url] = () => import(`/junk/${curr.url}.vue`);
			// 	return prev;
			// }, {});
		}
	}
}
</script>
