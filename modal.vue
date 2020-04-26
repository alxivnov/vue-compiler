<template functional>
	<transition appear @appear="
		$('#' + (data.attrs.id || 'modal'))
			.on('show.bs.modal', function (e) {
				if (listeners.show)
					listeners.show(e);
			})
			.on('shown.bs.modal', function (e) {
				if (listeners.shown)
					listeners.shown(e);
			})
			.on('hide.bs.modal', function (e) {
				if (listeners.hide)
					listeners.hide(e);
			})
			.on('hidden.bs.modal', function (e) {
				if (listeners.hidden)
					listeners.hidden(e);
			})
	">
		<div
			:class="{
				'modal': true,
				'fade': props.fade !== undefined && props.fade !== false
			}"
			tabindex="-1"
			role="dialog"

			:aria-labelledby="(data.attrs.id || 'modal') + '-label'"
			aria-hidden="true"

			v-bind="data.attrs"

			:show="$('#' + (data.attrs.id || 'modal')).modal(props.show ? 'show' : 'hide')"
		>
			<div
				:class="{
					'modal-dialog': true,
					'modal-dialog-scrollable': props.scrollable !== undefined && props.scrollable !== false,
					'modal-dialog-centered': props.centered !== undefined && props.centered !== false,

					'modal-sm': props.size == 'sm',
					'modal-lg': props.size == 'lg',
					'modal-xl': props.size == 'xl',
				}"
				role="document"
			>
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" :id="(data.attrs.id || 'modal') + '-label'">{{ props.title }}</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<!--<span aria-hidden="true">-->&times;<!--</span>-->
						</button>
					</div>
					<div class="modal-body">
						<slot></slot>
					</div>
					<div class="modal-footer">
						<slot name="footer"></slot>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
// <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
export default {
	props: [
		'title',
		'scrollable',			// FALSE|true
		'centered',				// FALSE|true
		'fade',					// FALSE|true
		'size',					// sm|UNDEFINED|lg|xl

		'show',					// FALSE|true
	]
}
</script>