<template functional>
	<!-- <div :class="props.col !== undefined && props.col !== false ? props.col.length ? ('col-' + props.col) : 'col' : null"> -->
		<div :class="[
			'card-body',
			props.overlay !== undefined && props.overlay !== false && 'card-img-overlay'
		]">
			<h5 v-show="props.title" class="card-title">{{ props.title }}</h5>
			<h6 v-show="props.subtitle" class="card-subtitle">{{ props.subtitle }}</h6>
			<p v-show="props.text" class="card-text">{{ props.text }}</p>
			<a v-for="(link, i) in props.links && Object.keys(props.links)" :key="i" :href="props.links[link]" class="card-link">{{ link }}</a>
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