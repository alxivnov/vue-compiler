<template>
	<div>
		<a href="https://github.com/alxivnov/vue-compiler/blob/master/page-code.vue" class="link">Source</a>

		<pre class="bg-light border rounded mt-3">
			<code :class="{
				'font-weight-bold': font == 1,
				'font-italic': font == 2,

				'fw-bold': font == 1,
				'fst-italic': font == 2
			}">
				&lt;script src="./vue-compiler.js">&lt;/script>

				&lt;script>
					VueCompiler.import([
						'./btn.vue', './dropdown-divider.vue', './dropdown-header.vue', './dropdown-item.vue',
					]);
				&lt;/script>

				&lt;html>
					&lt;btn fas="cog" btn-style="success">
						Button
						&lt;template #dropdown>
							&lt;dropdown-header>Header&lt;/dropdown-header>
							&lt;dropdown-item @click="font = 1">First&lt;/dropdown-item>
							&lt;dropdown-item @click="font = 2">Second&lt;/dropdown-item>
							&lt;dropdown-divider>&lt;/dropdown-divider>
							&lt;dropdown-item @click="font = 0">Third&lt;/dropdown-item>
						&lt;/template>
					&lt;/btn>
				&lt;/html></code>
		</pre>
		<div class="text-center">
			<btn fas="cog" btn-style="success">
				Font
				<template #dropdown>
					<dropdown-header>Font</dropdown-header>
					<dropdown-item @click="font = 1">Bold</dropdown-item>
					<dropdown-item @click="font = 2">Italic</dropdown-item>
					<dropdown-divider></dropdown-divider>
					<dropdown-item @click="font = 0">Reset</dropdown-item>
				</template>
			</btn>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			font: 0
		};
	}
}
</script>