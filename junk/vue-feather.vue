<template>
	<span />
</template>

<script>
/**
 * COPYRIGHT © Chen Fengyuan
 *
 * Original source
 * https://github.com/fengyuanchen/vue-feather
 *
 * License: MIT © Chen Fengyuan
 * Check the license @ https://github.com/fengyuanchen/vue-feather/blob/master/LICENSE
 */

const feather = window.feather;

/**
 * DOCS
 *
 * https://github.com/fengyuanchen/vue-feather/blob/master/src/README.md
 */

export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: 'Feather',
	props: {
		animation: {
			type: String,
			default: undefined
		},
		animationSpeed: {
			type: String,
			default: undefined
		},
		fill: {
			type: String,
			default: 'none'
		},
		size: {
			type: [ Number, String ],
			default: 24
		},
		stroke: {
			type: String,
			default: 'currentColor'
		},
		strokeLinecap: {
			type: String,
			default: 'round'
		},
		strokeLinejoin: {
			type: String,
			default: 'round'
		},
		strokeWidth: {
			type: [ Number, String ],
			default: 2
		},
		tag: {
			type: String,
			default: 'i'
		},
		type: {
			type: String,
			required: true,
			validator (type) {
				if (!feather.icons[type]) {
					throw new Error(`"${ type }" is not an available icon type.`);
				}
				return true;
			}
		}
	},
	render (createElement) {
		if (Vue./*component*/version >= '3.0') {	// Vue 3
			createElement = (type, props, children) => {
				let vue3 = {
					...props,

					...(props.attrs || {}),
					attrs: undefined,

					...(props.domProps || {}),
					domProps: undefined,

					...Object.keys(props.on || {})
						.reduce((listeners, key) => ({ ...listeners, ['on' + key[0].toUpperCase() + key.substring(1)]: props.on[key] }), {}),
					on: undefined,
				};
				// Vue???
				return Vue.h(type, vue3, children);
			};
		}

		const {
			animation, animationSpeed, size, type, tag, $listeners, fill, stroke, strokeLinecap, strokeLinejoin, strokeWidth
		} = this;
		const icon = feather.icons[type];
		return createElement(
			tag,
			{
				attrs: {
					'data-name': type,
					'data-tags': icon ? icon.tags : '',
					'data-type': type
				},
				class: {
					feather: true,
					[`feather--${ type }`]: type,
					[`feather--${ animation }`]: animation,
					[`feather--${ animationSpeed }`]: animationSpeed
				},
				on: $listeners
			},
			[
				icon
					? createElement(
						'svg',
						{
							attrs: {
								...Object.keys(icon.attrs)
									.filter(attr => attr !== 'class')
									.reduce((obj, attr) => {
										obj[attr] = icon.attrs[attr];
										return obj;
									}, {}),

								'fill': fill,
								'height': size,
								'stroke': stroke,
								'stroke-linecap': strokeLinecap,
								'stroke-linejoin': strokeLinejoin,
								'stroke-width': strokeWidth,
								'width': size
							},
							class: [ icon.attrs.class, 'feather__content' ],
							domProps: {
								innerHTML: icon.contents
							}
						}
					)
					: ''
			]
		);
	}
}
</script>
