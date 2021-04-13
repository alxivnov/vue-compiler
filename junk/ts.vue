<template>
	<span>TypeScript</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	setup() {
		type Type = 'one' | 'two';

		interface Interface {
			some: boolean
		};

		function func2<T>(i: T): T[] {
			let some: T[] = [];
			return [i, i];
		}

		function func(input: string): string[] {
			let local: number = 1;
			return [local, input];
		}

		let some = {} as I;
		let other = Object as PropType<I>;
	},
})
</script>
