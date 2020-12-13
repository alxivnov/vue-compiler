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
						: slots().dropdown
							? 'dropdown'
							: null
		]"
	>

		<a
			:href="data.attrs && data.attrs.href ? data.attrs.href : '#'"
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

				'active': props.state == 'active' || data.attrs && data.attrs.active !== undefined && data.attrs.active !== false,
				'disabled': props.state == 'disabled' || data.attrs && data.attrs.disabled !== undefined && data.attrs.disabled !== false,

				'dropdown-toggle': slots().dropdown/**/ && props.btnStyle != 'link'/**/,
				'dropdown-toggle-split': slots().dropdown && !props.fas && !slots().default
			}"

			:data-toggle="slots().dropdown ? 'dropdown' : props.popoverTitle || props.popoverContent ? 'popover' : null"
			aria-haspopup="true"
			aria-expanded="false"

			:title="props.popoverTitle"
			:data-content="props.popoverContent"
			:data-placement="props.popoverPlacement"

			:data-bs-toggle="slots().dropdown ? 'dropdown' : props.popoverTitle || props.popoverContent ? 'popover' : null"
			:data-bs-content="props.popoverContent"
			:data-bs-placement="props.popoverPlacement"
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
//		active						// FALSE|true
//		disabled					// FALSE|true

		'fas',						// font awesome

		'dropdownDirection',		// up|right|left
		'dropdownAlignment',		// right|LEFT
		'dropdownAlignmentSize',	// sm|md|lg|xl

		'popoverTitle',
		'popoverContent',
		'popoverPlacement',			// TOP|right|bottom|left
	]
}
</script>
