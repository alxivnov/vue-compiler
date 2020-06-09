<template functional>
	<div
		:class="[
			'card',
			props.align !== undefined && props.align !== false && 'text-' + props.align,
			props.textColor !== undefined && props.textColor !== false && 'text-' + props.textColor,
			props.bgColor !== undefined && props.bgColor !== false && 'bg-' + props.bgColor,
			props.borderColor !== undefined && props.borderColor !== false && 'border-' + props.borderColor
		]"
	>
		<div
			v-show="slots().header"
			:class="[
				'card-header',
				props.headerTextColor !== undefined && props.headerTextColor !== false && 'text-' + props.headerTextColor,
				props.headerBgColor !== undefined && props.headerBgColor !== false && 'bg-' + props.headerBgColor,
				props.headerBorderColor !== undefined && props.headerBorderColor !== false && 'border-' + props.headerBorderColor
			]"

			:id="props.collapse && props.collapse + '-heading' + (props.accordion !== undefined ? '-' + props.accordion : '')"
		>
			<div
				:class="[
					props.nav !== undefined && props.nav !== false && 'nav',
					props.nav == 'tabs' && 'nav-tabs card-header-tabs',
					props.nav == 'pills' && 'nav-pills card-header-pills'
				]"

				X-class="btn btn-link btn-block text-left collapsed"
				X-type="button"

				:data-toggle="props.collapse && 'collapse'"
				:data-target="props.collapse && '#' + props.collapse + '-collapse' + (props.accordion !== undefined ? '-' + props.accordion : '')"
				aria-expanded="false"
				:aria-controls="props.collapse && props.collapse + '-collapse' + (props.accordion !== undefined ? '-' + props.accordion : '')"

				:role="props.nav !== undefined && props.nav !== false ? 'tablist' : props.collapse ? 'button' : null"
			>
				<slot name="header"></slot>
			</div>
		</div>

		<div
			:class="[
				props.noGutters !== undefined && props.noGutters !== false && 'row no-gutters',

				props.collapse && 'collapse',

				props.nav !== undefined && props.nnav !== false && 'tab-content'
			]"

			:id="props.collapse && props.collapse + '-collapse' + (props.accordion !== undefined ? '-' + props.accordion : '')"
			:aria-labelledby="props.collapse && props.collapse + '-heading' + (props.accordion !== undefined ? '-' + props.accordion : '')"
			:data-parent="props.collapse && props.accordion !== undefined && '#' + props.collapse"
		>
			<slot></slot>
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
		'accordion'				// accordion id
	]
}
</script>