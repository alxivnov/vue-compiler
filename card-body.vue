<template functional>
	<div class="card-body">
		<h5 v-show="props.title" class="card-title">{{ props.title }}</h5>
		<h6 v-show="props.subtitle" class="card-subtitle">{{ props.subtitle }}</h6>
		<p v-show="props.text" class="card-text">{{ props.text }}</p>

		<slot></slot>
	</div>
</template>

<script>
export default {
	props: [
		'title',
		'subtitle',
		'text'
	]
}
</script>