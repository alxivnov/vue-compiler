<template>
	<!-- <transition appear> -->
		<div
			:class="{
				'modal': true,
				'fade': fade !== undefined && fade !== false
			}"
			tabindex="-1"
			role="dialog"

			:aria-labelledby="($attrs.id || 'modal') + '-label'"
			aria-hidden="true"

			v-bind="$attrs"
		>
<!--
			:show="$('#' + (data.attrs.id || 'modal')).modal(props.show ? 'show' : 'hide')"
-->
			<div
				:class="{
					'modal-dialog': true,
					'modal-dialog-scrollable': scrollable !== undefined && scrollable !== false,
					'modal-dialog-centered': centered !== undefined && centered !== false,

					'modal-sm': size == 'sm',
					'modal-lg': size == 'lg',
					'modal-xl': size == 'xl',
				}"
				role="document"
			>
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" :id="($attrs.id || 'modal') + '-label'">{{ title }}</h5>
						<button
							type="button"
							class="close"
							data-dismiss="modal"
							aria-label="Close"

							data-bs-dismiss="modal"
						>
							<!--<span aria-hidden="true">-->&times;<!--</span>-->
						</button>
					</div>
					<div class="modal-body">
						<slot></slot>
					</div>
					<div v-show="$slots.footer" class="modal-footer">
						<slot name="footer"></slot>
					</div>
				</div>
			</div>
		</div>
	<!-- </transition> -->
</template>

<script>
// script(src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous")

const modalEvents = [
	'show',
	'shown',
	'hide',
	'hidden'
];

export default {
	props: [
		'title',
		'scrollable',			// FALSE|true
		'centered',				// FALSE|true
		'fade',					// FALSE|true
		'size',					// sm|UNDEFINED|lg|xl

		'show',					// FALSE|true
	],
	mounted() {
		let el = $('#' + (this.$attrs.id || 'modal'));

		modalEvents.forEach(event => {
			let attr = 'on' + event.slice(0, 1).toUpperCase() + event.slice(1);
			let on = event + '.bs.modal';

			if (this.$listeners ? this.$listeners[event] : this.$attrs[attr])
				el.on(on, e => {
//					console.log(on);

					this.$emit(event, e);
				});
		});

		el.modal(this.$props.show !== undefined ? 'show' : 'hide');
	}
}
</script>