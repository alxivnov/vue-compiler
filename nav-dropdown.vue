<template functional>
	<li class="nav-item dropdown">
		<a class="nav-link dropdown-toggle" href="#" :id="(data.attrs && data.attrs.id || 'dropdown') + '-menu'" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			<slot></slot>
		</a>
		<div class="dropdown-menu" :aria-labelledby="(data.attrs && data.attrs.id || 'dropdown') + '-menu'">
			<slot name="dropdown"></slot>
		</div>
	</li>
</template>