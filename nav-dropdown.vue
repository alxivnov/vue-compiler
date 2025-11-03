<template>
	<li class="nav-item dropdown">
		<a
			class="nav-link dropdown-toggle"
			href="#"
			:id="($attrs && $attrs.id || 'dropdown') + '-menu'"
			role="button"
			data-toggle="dropdown"
			aria-haspopup="true"
			aria-expanded="false"

			data-bs-toggle="dropdown"
		>
			<slot></slot>
		</a>
		<div class="dropdown-menu" :aria-labelledby="($attrs && $attrs.id || 'dropdown') + '-menu'">
			<slot name="dropdown"></slot>
		</div>
	</li>
</template>