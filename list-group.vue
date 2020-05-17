<template functional>
	<ul :class="['list-group', props.flush != null && 'list-group-flush']">
		<li class="list-group-item" v-for="(item, i) in props.items" :key="i">
			<slot :item="item">
				{{ item }}
			</slot>
		</li>
	</ul>
</template>

<script>
export default {
	props: [
		'items',		// []
		'flush'
	]
}
</script>