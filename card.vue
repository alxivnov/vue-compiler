<template functional>
	<div class="card">
		<div v-show="slots().header" class="card-header">
			<slot name="header"></slot>
		</div>

		<slot></slot>

		<div v-show="slots().footer" class="card-footer">
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script>
export default {
// card-link
// card-img-top
}
</script>