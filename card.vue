<template functional>
	<div
		:class="[
			bs5 && (props.collapse || props.accordion !== undefined) ? 'accordion-item' : 'card',
			props.height !== undefined && props.height !== false && 'h-' + props.height,
			props.align !== undefined && props.align !== false && 'text-' + props.align,
			props.textColor !== undefined && props.textColor !== false && 'text-' + props.textColor,
			props.bgColor !== undefined && props.bgColor !== false && 'bg-' + props.bgColor,
			props.borderColor !== undefined && props.borderColor !== false && 'border-' + props.borderColor
		]"
	>
		<div
			v-show="slots().header"
			:class="[
				bs5 && (props.collapse || props.accordion !== undefined) ? 'accordion-header' : 'card-header',
				props.headerTextColor !== undefined && props.headerTextColor !== false && 'text-' + props.headerTextColor,
				props.headerBgColor !== undefined && props.headerBgColor !== false && 'bg-' + props.headerBgColor,
				props.headerBorderColor !== undefined && props.headerBorderColor !== false && 'border-' + props.headerBorderColor
			]"

			:id="props.collapse && props.collapse + '-heading' + (props.accordion != null ? '-' + props.accordion : '')"
		>
			<div
				:class="[
					bs5 && (props.collapse || props.accordion !== undefined) && 'accordion-button',

					props.nav !== undefined && props.nav !== false && 'nav',
					props.nav == 'tabs' && 'nav-tabs card-header-tabs',
					props.nav == 'pills' && 'nav-pills card-header-pills',

					/*props.collapse && props.accordion !== undefined && props.accordion*/!props.show && 'collapsed'
				]"

				X-class="btn btn-link btn-block text-left"
				X-type="button"

				:data-bs-toggle="props.collapse && 'collapse'"
				:data-bs-target="props.collapse && '#' + props.collapse + '-collapse' + (props.accordion != null ? '-' + props.accordion : '')"

				:data-toggle="props.collapse && 'collapse'"
				:data-target="props.collapse && '#' + props.collapse + '-collapse' + (props.accordion != null ? '-' + props.accordion : '')"
				:aria-expanded="/*props.collapse && props.accordion !== undefined && !props.accordion*/props.show"
				:aria-controls="props.collapse && props.collapse + '-collapse' + (props.accordion != null ? '-' + props.accordion : '')"

				:role="props.nav !== undefined && props.nav !== false ? 'tablist' : props.collapse ? 'button' : null"
			>
				<slot name="header"></slot>
			</div>
		</div>

		<slot></slot>
		<div
			v-show="slots().content"

			:class="[
				bs5 && (props.collapse || props.accordion !== undefined) && 'accordion-collapse',

				props.noGutters !== undefined && props.noGutters !== false && 'row no-gutters g-0',

				props.collapse && 'collapse',
				/*props.collapse && props.accordion !== undefined && !props.accordion*/props.show && 'show',

				props.nav !== undefined && props.nav !== false && 'tab-content'
			]"

			:id="props.collapse && props.collapse + '-collapse' + (props.accordion != null ? '-' + props.accordion : '')"
			:aria-labelledby="props.collapse && props.collapse + '-heading' + (props.accordion != null ? '-' + props.accordion : '')"
			:data-parent="props.collapse && props.accordion != null && '#' + props.collapse || null"

			:data-bs-parent="props.collapse && props.accordion != null && '#' + props.collapse || null"
		>
			<div v-if="bs5 && (props.collapse || props.accordion !== undefined)" class="accordion-body">
				<slot name="content"></slot>
			</div>
			<slot v-else name="content"></slot>
		</div>

		<div v-show="slots().footer" :class="[
			'card-footer',
			props.footerTextColor !== undefined && props.footerTextColor !== false && 'text-' + props.footerTextColor,
			props.footerBgColor !== undefined && props.footerBgColor !== false && 'bg-' + props.footerBgColor,
			props.footerBorderColor !== undefined && props.footerBorderColor !== false && 'border-' + props.footerBorderColor
		]">
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script>
export default {
	props: [
		'img-top',				// url
		'align',				// center|right
		'nav',
		'no-gutters',			// FALSE|true
		'text-color',			// primary|secondary|success|danger|warning|info|light|dark|body|muted|white|black-50|white-50
		'bg-color',				// primary|secondary|success|danger|warning|info|light|dark|white|transparent
		'border-color',			// primary|secondary|success|danger|warning|info|light|dark|white
		'header-text-color',	// primary|secondary|success|danger|warning|info|light|dark|body|muted|white|black-50|white-50
		'header-bg-color',		// primary|secondary|success|danger|warning|info|light|dark|white|transparent
		'header-border-color',	// primary|secondary|success|danger|warning|info|light|dark|white
		'footer-text-color',	// primary|secondary|success|danger|warning|info|light|dark|body|muted|white|black-50|white-50
		'footer-bg-color',		// primary|secondary|success|danger|warning|info|light|dark|white|transparent
		'footer-border-color',	// primary|secondary|success|danger|warning|info|light|dark|white

		'collapse',				// collpase id
		'accordion',			// accordion id
		'show',					// FALSE|true

		'height',				// 25|50|75|100|auto
	],
	computed: {
		bs5() {
			return !!bootstrap.Modal.getInstance;
		}
	}
}
</script>