<template>
	<div
		:class="[
			row !== undefined
				? 'row'
				: col !== undefined
					? 'col' + (col ? '-' + col : '')
					: null,

			/**/btnStyle == 'link'
				? null
				: /**/'btn-group',
			dropdownDirection == 'up'
				? 'dropup'
				: dropdownDirection == 'right'
					? 'dropright'
					: dropdownDirection == 'left'
						? 'dropleft'
						: $slots.dropdown
							? 'dropdown'
							: null
		]"
	>

		<a
			:href="$attrs && $attrs.href ? $attrs.href : '#'"
			role="button"

			v-bind="Object.fromEntries(Object.entries($attrs).filter(([name]) => !(name.startsWith('on') && name.length > 2)))"
			v-on="$listeners"

			:type="btnType == 'submit' ? 'submit' : null/*'button'*/"
			:class="{
				'btn': /**/btnStyle == 'link' ? false : /**/true,
				['btn-'
					+ (outline !== undefined && outline !== false ? 'outline-' : '')
					+ (btnStyle ? btnStyle : 'primary')]: true,
				'btn-sm': size == 'sm',
				'btn-lg': size == 'lg',
				'btn-block': block !== undefined && block !== false,

				'active': state == 'active' || $attrs && $attrs.active !== undefined && $attrs.active !== false,
				'disabled': state == 'disabled' || $attrs && $attrs.disabled !== undefined && $attrs.disabled !== false,

				'dropdown-toggle': $slots.dropdown/**/ && btnStyle != 'link'/**/,
				'dropdown-toggle-split': $slots.dropdown && !fas && !$slots.default
			}"

			:data-toggle="$slots.dropdown ? 'dropdown' : popoverTitle || popoverContent ? 'popover' : null"
			aria-haspopup="true"
			aria-expanded="false"

			:title="popoverTitle"
			:data-content="popoverContent"
			:data-placement="popoverPlacement"

			:data-bs-toggle="$slots.dropdown ? 'dropdown' : popoverTitle || popoverContent ? 'popover' : null"
			:data-bs-content="popoverContent"
			:data-bs-placement="popoverPlacement"
		>
			<i
				v-if="bi"
				:class="{
					'bi': true,
					['bi-' + bi]: true
				}"
			></i>
			<span
				v-else-if="fas"
				:class="{
					'fas': fas,
					['fa-' + fas]: fas,
					'fa-fw': true,

					'mr-1 me-1': fas && $slots.default,
				}"
			></span>
			<slot>
				<!--<span v-show="!fas" class="sr-only">Toggle Dropdown</span>-->
			</slot>
		</a>

		<div
			v-if="$slots.dropdown"
			:class="{
				'dropdown-menu': true,
				['dropdown-menu-'
					+ (dropdownAlignmentSize ? dropdownAlignmentSize + '-' : '')
					+ (dropdownAlignment ? dropdownAlignment : 'left')]: true,
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
		'col',						// auto|...
		'row',						// true|FALSE

		'btnType',					// BUTTON|submit
		'btnStyle',					// PRIMARY|secondary|success|danger|warning|info|light|dark|link
		'outline',					// true|FALSE
		'size',						// sm|lg
		'block',					// true|FALSE
		'state',					// active|disabled
//		active						// FALSE|true
//		disabled					// FALSE|true

		'bi',						// Bootstrap Icons
		'fas',						// Font Awesome

		'dropdownDirection',		// up|right|left
		'dropdownAlignment',		// right|LEFT
		'dropdownAlignmentSize',	// sm|md|lg|xl

		'popoverTitle',
		'popoverContent',
		'popoverPlacement',			// TOP|right|bottom|left
	]
}
</script>
