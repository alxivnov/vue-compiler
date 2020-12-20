<template functional>
	<nav :class="{
		'navbar': true,
		['navbar-expand' + (typeof(props.expand) == 'string' && props.expand.length ? '-' + props.expand : '')]: props.expand !== undefined,

		['navbar-' + (props.theme || 'light')]: true,
		['bg-' + (props.color || props.theme || 'light')]: props.color || props.theme || 'light',

		[props.stick ? 'fixed-' + props.stick : 'sticky-top']: props.stick !== undefined,
	}">
		<div class="container-fluid">

		<a
			class="navbar-brand"
			href="/"
			v-if="slots().brand"
		>
			<slot name="brand"></slot>
		</a>

		<button
			class="navbar-toggler"
			type="button"
			data-toggle="collapse"
			:data-target="'#' + (data.attrs && data.attrs.id || 'navbar') + '-collapse'"
			:aria-controls="(data.attrs && data.attrs.id || 'navbar') + '-collapse'"
			aria-expanded="false"
			aria-label="Toggle navigation"

			data-bs-toggle="collapse"
			:data-bs-target="'#' + (data.attrs && data.attrs.id || 'navbar') + '-collapse'"
		>
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" :id="(data.attrs && data.attrs.id || 'navbar') + '-collapse'">
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
