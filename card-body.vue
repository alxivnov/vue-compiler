<template>
	<!-- <div :class="col !== undefined && col !== false ? col.length ? ('col-' + col) : 'col' : null"> -->
		<div :class="[
			'card-body',
			overlay !== undefined && overlay !== false && 'card-img-overlay'
		]">
			<h5 v-show="title" class="card-title">{{ title }}</h5>
			<h6 v-show="subtitle" class="card-subtitle">{{ subtitle }}</h6>
			<p v-show="text" class="card-text">{{ text }}</p>
			<a v-for="(link, i) in links && Object.keys(links)" :key="i" :href="links[link]" class="card-link">{{ link }}</a>
			<slot></slot>
		</div>
	<!-- </div> -->
</template>

<script>
export default {
	props: [
		'title',		// string
		'subtitle',		// string
		'text',			// string
		'links',		// { title: url }

		'overlay',		// FALSE|true
		'col'
	]
}
</script>