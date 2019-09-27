<template functional>
	<div
		:class="[
			/**/props.btnStyle == 'link'
				? null
				: /**/'btn-group',
			props.dropdownDirection == 'up'
				? 'dropup'
				: props.dropdownDirection == 'right'
					? 'dropright'
					: props.dropdownDirection == 'left'
						? 'dropleft'
						: 'dropdown'
		]"
	>

		<a
			href="#"
			role="button"

			v-bind="data.attrs"
			v-on="listeners"
			
			:type="props.btnType == 'submit' ? 'submit' : null/*'button'*/"
			:class="{
				'btn': /**/props.btnStyle == 'link' ? false : /**/true,
				['btn-'
					+ (props.outline !== undefined && props.outline !== false ? 'outline-' : '')
					+ (props.btnStyle ? props.btnStyle : 'primary')]: true,
				'btn-sm': props.size == 'sm',
				'btn-lg': props.size == 'lg',
				'btn-block': props.block !== undefined && props.block !== false,
				'active': props.state == 'active',

				'dropdown-toggle': slots().dropdown/**/ && props.btnStyle != 'link'/**/,
				'dropdown-toggle-split': slots().dropdown && !props.fas && !slots().default,
				'disabled': props.state == 'disabled' || data.attrs && data.attrs.disabled !== undefined && data.attrs.disabled !== false
			}"

			:data-toggle="slots().dropdown ? 'dropdown' : null" aria-haspopup="true" aria-expanded="false"
		>
			<span
				:v-show="props.fas"
				:class="{
					'fas': props.fas,
					['fa-' + props.fas]: props.fas,
					'fa-fw': true,

					'mr-1': props.fas && slots().default,
				}"
			></span>
			<slot>
				<!--<span v-show="!fas" class="sr-only">Toggle Dropdown</span>-->
			</slot>
		</a>

		<div
			v-if="slots().dropdown"
			:class="{
				'dropdown-menu': true,
				['dropdown-menu-'
					+ (props.dropdownAlignmentSize ? props.dropdownAlignmentSize + '-' : '')
					+ (props.dropdownAlignment ? props.dropdownAlignment : 'left')]: true,
			}"
		>
			<slot name="dropdown"></slot>
		</div>
	</div>
</template>

<script>
export default {
	inheritAttrs: false,
	props: [
		'btnType',					// BUTTON|submit
		'btnStyle',					// PRIMARY|secondary|success|danger|warning|info|light|dark|link
		'outline',					// true|FALSE
		'size',						// sm|lg
		'block',					// true|FALSE
		'state',					// active|disabled

		'fas',						// font awesome

		'dropdownDirection',		// up|right|left
		'dropdownAlignment',		// right|LEFT
		'dropdownAlignmentSize',	// sm|md|lg|xl
	]
}
</script>
