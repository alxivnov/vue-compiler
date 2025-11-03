<template>
	<nav :class="{
		'navbar': true,
		['navbar-expand' + (typeof(expand) == 'string' && expand.length ? '-' + expand : '')]: expand !== undefined,

		['navbar-' + (theme || 'light')]: true,
		['bg-' + (color || theme || 'light')]: color || theme || 'light',

		[stick ? 'fixed-' + stick : 'sticky-top']: stick !== undefined,
	}">
		<div class="container-fluid">

		<a
			class="navbar-brand"
			href="/"
			v-if="$slots.brand"
		>
			<slot name="brand"></slot>
		</a>

		<button
			class="navbar-toggler"
			type="button"
			data-toggle="collapse"
			:data-target="'#' + ($attrs && $attrs.id || 'navbar') + '-collapse'"
			:aria-controls="($attrs && $attrs.id || 'navbar') + '-collapse'"
			aria-expanded="false"
			aria-label="Toggle navigation"

			data-bs-toggle="collapse"
			:data-bs-target="'#' + ($attrs && $attrs.id || 'navbar') + '-collapse'"
		>
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" :id="($attrs && $attrs.id || 'navbar') + '-collapse'">
			<div class="navbar-nav mr-auto me-auto">
				<slot></slot>
			</div>

			<form class="form-inline d-flex">
				<slot name="form"></slot>
			</form>

			<span class="navbar-text">
				<slot name="text"></slot>
			</span>
		</div>

		</div>
	</nav>
</template>

<script>
export default {
	props: [
		'expand',			// FALSE|true|sm|md|lg|xl
		'theme',			// LIGHT|dark
		'color',			// primary|secondary|success|danger|warning|info|LIGHT|dark
		'stick',			// top|bottom|null
	]
}
</script>
