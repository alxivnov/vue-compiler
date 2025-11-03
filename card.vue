<template>
	<div
		:class="[
			bs5 && (collapse || accordion !== undefined) ? 'accordion-item' : 'card',
			height !== undefined && height !== false && 'h-' + height,
			align !== undefined && align !== false && 'text-' + align,
			textColor !== undefined && textColor !== false && 'text-' + textColor,
			bgColor !== undefined && bgColor !== false && 'bg-' + bgColor,
			borderColor !== undefined && borderColor !== false && 'border-' + borderColor
		]"
	>
		<div
			v-show="$slots.header"
			:class="[
				bs5 && (collapse || accordion !== undefined) ? 'accordion-header' : 'card-header',
				headerTextColor !== undefined && headerTextColor !== false && 'text-' + headerTextColor,
				headerBgColor !== undefined && headerBgColor !== false && 'bg-' + headerBgColor,
				headerBorderColor !== undefined && headerBorderColor !== false && 'border-' + headerBorderColor
			]"

			:id="collapse && collapse + '-heading' + (accordion != null ? '-' + accordion : '')"
		>
			<div
				:class="[
					bs5 && (collapse || accordion !== undefined) && 'accordion-button',

					nav !== undefined && nav !== false && 'nav',
					nav == 'tabs' && 'nav-tabs card-header-tabs',
					nav == 'pills' && 'nav-pills card-header-pills',

					/*collapse && accordion !== undefined && accordion*/!show && 'collapsed'
				]"

				X-class="btn btn-link btn-block text-left"
				X-type="button"

				:data-bs-toggle="collapse && 'collapse'"
				:data-bs-target="collapse && '#' + collapse + '-collapse' + (accordion != null ? '-' + accordion : '')"

				:data-toggle="collapse && 'collapse'"
				:data-target="collapse && '#' + collapse + '-collapse' + (accordion != null ? '-' + accordion : '')"
				:aria-expanded="/*collapse && accordion !== undefined && !accordion*/show"
				:aria-controls="collapse && collapse + '-collapse' + (accordion != null ? '-' + accordion : '')"

				:role="nav !== undefined && nav !== false ? 'tablist' : collapse ? 'button' : null"
			>
				<slot name="header"></slot>
			</div>
		</div>

		<slot></slot>
		<div
			v-show="$slots.content"

			:class="[
				bs5 && (collapse || accordion !== undefined) && 'accordion-collapse',

				noGutters !== undefined && noGutters !== false && 'row no-gutters g-0',

				collapse && 'collapse',
				/*collapse && accordion !== undefined && !accordion*/show && 'show',

				nav !== undefined && nav !== false && 'tab-content'
			]"

			:id="collapse && collapse + '-collapse' + (accordion != null ? '-' + accordion : '')"
			:aria-labelledby="collapse && collapse + '-heading' + (accordion != null ? '-' + accordion : '')"
			:data-parent="collapse && accordion != null && '#' + collapse || null"

			:data-bs-parent="collapse && accordion != null && '#' + collapse || null"
		>
			<div v-if="bs5 && (collapse || accordion !== undefined)" class="accordion-body">
				<slot name="content"></slot>
			</div>
			<slot v-else name="content"></slot>
		</div>

		<div v-show="$slots.footer" :class="[
			'card-footer',
			footerTextColor !== undefined && footerTextColor !== false && 'text-' + footerTextColor,
			footerBgColor !== undefined && footerBgColor !== false && 'bg-' + footerBgColor,
			footerBorderColor !== undefined && footerBorderColor !== false && 'border-' + footerBorderColor
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