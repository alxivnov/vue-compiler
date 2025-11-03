<template>
	<Wrap
		:if="isRow"
		:class="{
			'w-100': isRow,	// Required for nested layout
		}"
	>
	<a
		v-if="$slots.default && !(collapse === null)"
		class="btn-link ps-0"
		:class="{
			[resize('btn')]: true,
			[spacing]: true,
			[isCol ? resize('col-form-label') : 'form-label']: true,
			collapsed: collapse
		}"
		role="button"
		data-bs-toggle="collapse"
		:href="'#' + collapse_id"
		:aria-expanded="!collapse"
		:aria-controls="collapse_id"

		@click="toggle"
	>
		<span class="font-monospace">{{ expanded ? '-' : '+' }}</span>
		<slot></slot>
	</a>

	<component
		:is="indent || /*isRow*/nested ? 'fieldset' : 'form'"

		v-bind="$attrs"

		class="collapse"
		:class="{
			'pt-2': collapse === null,
			'px-0': nested,

			row: isRow,
			show: !collapse
		}"
		:id="collapse_id"
	>
		<div
			v-for="(field, i) in normFields || calcFields || []"
			:key="field.key"
			:class="{
				[spacing]: !isRow,
				[field.$col ? width(field.$col) : field.$btn ? 'col-auto' : 'col']: (field.$col || (isRow)),
				'ps-0': i && (field.$col || (isRow && !field.$hor)),
				row: isColField(field) && !(field.type == 'object' /*&& get(field)*/) && !(typeof (field) == 'string'),
				'mx-0': field.$btn,

				'ps-3': indent
			}"
		>
			<template v-if="field.options">
				<label
					v-if="field.$label !== false"
					:for="field.$id"
					:class="isColField(field) ? [width(field.$hor || hor), resize('col-form-label')] : 'form-label'"
				>
					{{ field.$label }}
				</label>
				<Wrap :if="!!isColField(field)" class="col">
					<select
						:id="field.$id"
						:name="field.$name"
						:class="resize('form-select')"
						__v-model="model[field.key]"
						:value="get(field)"
						@change="event => set(field, event)"
						:disabled="disabled || readonly || field.$disabled || field.$readonly"
					>
						<option
							v-for="key in Object.keys(field.options)"
							:key="key"
							:value="field.options[key]"
						>
							{{ Array.isArray(field.options) ? field.options[key] : key }}
						</option>
					</select>
				</Wrap>
			</template>
			<template v-else-if="field.type == 'boolean'">
				<label
					v-if="field.$label !== false && isColField(field)"
					:for="field.$id"
					:class="isColField(field) ? [width(field.$hor || hor), resize('col-form-label')] : 'form-label'"
				>
					{{ field.$label }}
				</label>
				<Wrap :if="!!isColField(field)" class="col">
					<div
						class="form-check"
						:class="{
							// 'col': isCol,
							[offset]: isColField(field)
						}"
					>
						<input
							:id="field.$id"
							:name="field.$name"
							type="checkbox"
							class="form-check-input"
							__v-model="model[field.key]"
							:checked="get(field)"
							@change="event => set(field, event)"
							:disabled="disabled || readonly || field.$disabled || field.$readonly"
						>
						<label
							v-if="field.$label !== false && !isColField(field)"
							:for="field.$id"
							class="form-check-label"
						>
							{{ field.$label }}
						</label>
					</div>
				</Wrap>
			</template>
			<template v-else-if="field.type == 'number' || field.type == 'string'">
				<label
					v-if="field.$label !== false"
					:for="field.$id"
					:class="isColField(field) ? [width(field.$hor || hor), resize('col-form-label')] : 'form-label'"
				>
					{{ field.$label }}
				</label>
				<Wrap :if="!!isColField(field)" class="col">
					<!-- textarea|input -->
					<component
						:is="field._tag"
						:id="field.$id"
						:name="field.$name"
						:type="field._attrType"
						:rows="field.$rows"
						:class="{
							[resize('form-control')]: true,
							// col: isCol
						}"
						:placeholder="field.$placeholder"
						__v-model="model[field.key]"
						:value="get(field)"
						@input="event => set(field, event)"
						:disabled="disabled || field.$disabled"
						:readonly="readonly || field.$readonly"
					>{{ field._tag == 'textarea' ? get(field) : undefined }}</component>
				</Wrap>
			</template>
			<!--
				Done: Add support for layout column sizes
				Done: Add support for object as fields
				Done: Fix prop_object.prop_null layout
				Done: Add support for textarea
				Done: Add support for functions/btns
				Done: Remake REST in UniForm/AnyPage
				Done: Fix defaults on creation
				Done: Add <wrap>
				Done: Remove row in cols in REST
				Done: Add cols in first row in REST

				TODO: Add support for direct change of values [v-model="true"]
				TODO: Add full height in textarea in REST
				TODO: Remove collapse indicator with $label=false

				TODO: Add support for files
				TODO: Add support for colors
				TODO: Add support for arrays [of forms]
				TODO: Add support for custom components
			-->
			<template v-else-if="field.type == 'array'">
				<div
					v-for="(badge, i) in get(field) || []"
					:key="i"
					class="badge"
				>
					{{ badge }}
				</div>
			</template>
			<!-- Done: Set col-auto if in row -->
			<button
				v-if="field.$btn"
				type="submit"
				class="btn btn-primary"
				@click.prevent="field.$click(modelValue)"
			>
				{{ field.$label }}
			</button>
			<component
				v-else-if="field.$comp"
				:id="field.$id"
				:name="field.$name"
				:is="field.$comp"
				:props="field.props"
				__v-model="field.key"
				:modelValue="get(field)"
				@update:modelValue="value => set(field, value)"
			>
			</component>
			<uni-form
				v-else-if="field.type == 'object' && (get(field) || field.$fields)"
				__v-model="model[field.key]"
				:modelValue="get(field)"
				@update:modelValue="value => set(field, value)"
				:fields="field.$fields"
				:hor="field.$hor || hor"
				:size="size"
				:disabled="disabled || field.$disabled"
				:readonly="readonly || field.$readonly"
				:collapse="field.$label === false ? null : (indent || 0) > 2"

				:indent="(indent || 0) + 1"
			>
				<!-- Done: Hide collapse indicator when $label = false -->
				{{ field.$label == true ? '' : field.$label == false ? undefined : (' ' + field.$label) }}
			</uni-form>
			<uni-form
				v-else-if="field.$fields"
				__v-model="value"
				:modelValue="modelValue"
				@update:modelValue="value => set(undefined, value)"
				:fields="field.$fields"
				:hor="field.$hor || hor"
				:nested="nested == 'row' ? 'col' : 'row'"
				:size="size"
				:disabled="disabled || field.$disabled"
				:readonly="readonly || field.$readonly"
			>
			</uni-form>
			<div
				v-else-if="field.$html"
				v-html="field.$html"
			>
			</div>
		</div>
		<button
			type="submit"
			class="btn btn-primary"
			:class="offset"
			v-if="!indent && !readonly && (/*$listeners.submit ||*/ $attrs.onSubmit)"
			@click.prevent="$emit('submit', modelValue)"
		>
			Submit
		</button>
	</component>
	</Wrap>
</template>

<script>
const flatten = (val) => {
	return Array.isArray(val)
		? val.flatMap(flatten)
		: [val];
};

const Wrap = {
	render(createElement) {
		let _if = this.$attrs.if;
		let tag = typeof (_if) == 'string'
			? _if.length
				? _if
				: undefined
			: _if
				? 'div'
				: undefined;

		let children = typeof (this.$slots.default) == 'function'
			? this.$slots.default()
			: this.$slots.default;

		if (typeof (createElement) == 'function') {
			return tag || children.length > 1
				? createElement(tag || 'div', children)
				: children[0];
		} else {
			return tag
				? Vue.h(tag, children)
				: children;
		}
	}
};

export default {
	name: 'uni-form',
	components: {
		Wrap
	},
	inheritAttrs: false,
	props: {
		// debug: Boolean,

		modelValue: [Object, Array],
		fields: [Object, Array],

		hor: [Boolean, Number, String],
		size: String,
		disabled: Boolean,
		readonly: [Boolean, String],
		collapse: [Boolean, String],

		nested: String,
		indent: Number,
	},
	data() {
		return {
			_normFields: null,

			expanded: !this.collapse,

			normProps: {
				// key: (field) => undefined,
				type: (field, value) => value == Boolean ? 'boolean'
					: value == Number ? 'number'
						: value == Object ? 'object'
							: value == String ? 'string'
								: field.default !== undefined ? typeof (field.default)
								: field.$default !== undefined ? typeof (field.$default)
									: field.options ? typeof (Object.values(field.options)[0])
										: value,
				$default: (field) => field.options ? Object.values(field.options)[0]
					: field.type == 'boolean' ? false
						: field.type == 'number' ? 0
							// : field.type == 'object' ? {}
								: field.type == 'string' ? ''
									: undefined,
				// options: (field) => undefined,

				$id: (field) => field.key + '_' + (/*this._uid ||*/ this._.uid),
				$name: (field) => {
					return field.key;
				},
				$label: (field) => field.key,
				$placeholder: (field, value) => value == true
					? (field.$label || field.key)
					: value,
				// $firlds: (field) => undefined,

				_tag: (field) => field.$rows > 1
					? 'textarea'
					: 'input',
				_attrType: (field) => field.type == 'string'
					? 'text'
					: field.type,
			},
		};
	},
	computed: {
		isCol() {
			return this.hor && !this.isRow;
		},
		isRow() {
			return this.nested == 'row';
		},
		offset() {
			return this.size == 'lg'
				? 'mt-3'
				: this.size == 'sm'
					? 'mt-1'
					: 'mt-2';
		},
		spacing() {
			return this.size == 'lg'
				? 'mb-3'
				: this.size == 'sm'
					? 'mb-1'
					: 'mb-2';
		},
		plaintext() {
			return this.readonly == 'plaintext'
				? 'form-control-plaintext'
				: undefined;
		},

		normFields() {
			return this.fields
				&& this.fieldsMap(this.fields, this.normField);
		},
		calcFields() {
			return this.modelValue
				&& Object.entries(this.modelValue)
					.filter(([key, val]) => val != null)
					.map(([key, val]) => this.normField({ key, type: typeof (val) }));
		},

		collapse_id() {
			return 'collapse_' + (/*this._uid ||*/ this._.uid);
		},
	},
	mounted() {

	},
	methods: {
		isColField(field) {
			if (field.$hor === false) {
				return false;
			}

			return !!(field.$hor || this.isCol);
		},
		width(width) {
			return width === true
				? 'col'
				: `col-${width}`;
		},
		resize(...classes) {
			return classes
				.map(_class => this.size == 'lg'
					? `${_class} ${_class}-lg`
					: this.size == 'sm'
						? `${_class} ${_class}-sm`
						: _class)
				.join(' ');
		},
		toggle() {
			this.expanded = !this.expanded;
		},

		get(field) {
			return this.modelValue?.[field.key] != null
				? this.modelValue[field.key]
				: field.default !== undefined
					? this.set(field, field.default)
					: field.$default;
		},
		set(field, event) {
			if (field) {
				let value = event instanceof Event
					? field.type == 'number'
						? (Number(event.target.value) || field.default || field.$default)
						: field.type == 'boolean'
							? Boolean(event.target.checked)
							: event.target.value
					: event;

				if (this.modelValue) {
					this.modelValue[field.key] = value;

					this.$emit('update:modelValue', this.modelValue);
				} else {
					this.$emit('update:modelValue', { [field.key]: value });
				}

				return value;
			} else {
				this.$emit('update:modelValue', event);
			}
		},

		markdown(string) {
			// if (string == '') {
			// 	return '<p></p>';
			// }

			let regexp = /^[\ \t]*(?:(?<hr>-{3,})|(?:(?:(?<h>#+)|(?<li>(?<ol>\d+\.)|(?<ul>\*|\+|-)))\s+)?(?<text>.+|\n))/gm;
			let source = string.trim();
			let lines = [];
			let line = undefined;
			while (line = regexp.exec(source)) {
				lines.push(line);
			}
			return lines
				.map((tag, i) => {
					let { h, hr, li, ol, ul, text } = tag.groups;
					let regexp = /(?<format>(?:\*|_){1,2})(?<text>.*?)(?:(?:\*|_){1,2})|(?<img>!)?\[(?<text>.*?)\]\((?<url>.*?)\)(?:{(?<attrs>[^}]*)})?/g;
					let words = [];
					let word = undefined;
					while (word = regexp.exec(text)) {
						words.push(word);
					}
					text = words.reverse().reduce((html, tag) => {
						let { img, url, format, text, attrs } = tag.groups;
						let op = html.slice(0, tag.index);
						let cl = html.slice(tag.index + tag[0].length);
						if (format) {
							return op
								+ (format.length > 1 ? '<strong>' : '<em>')
								+ text
								+ (format.length > 1 ? '</strong>' : '</em>')
								+ cl;
						} else if (img) {
							return op + `<img alt="${text}" src="${url}" ${attrs ? attrs.replace(/:(\w+)="/g, '$1="') + ' ' : ''}/>` + cl;
						} else {
							return op + `<a href="${url}"${attrs ? ' ' + attrs.replace(/:(\w+)="/g, '$1="') : ''}>${text}</a>` + cl;
						}
					}, text);

					if (h) {
						let min = Math.min(h.length, 6);
						return `<h${min}>${text}</h${min}>`;
					} else if (hr) {
						return `<hr></hr>`;
					} else if (li) {
						let op = i > 0 && lines[i - 1].groups.li ? '' : ol ? '<ol>' : '<ul>';
						let cl = i + 1 < lines.length && lines[i + 1].groups.li ? '' : ol ? '</ol>' : '</ul>';
						return `${op}<li>${text}</li>${cl}`;
					} else {
						return `<p>${text}</p>`;
					}
				})
				.join('');
		},
		normField(field) {
			if (field == null) {
				// return {
				// 	$html: '<p></p>'
				// };
			} else if (typeof (field) == 'object') {
				let keys = Object.keys(field);

				Object.keys(this.normProps)
					.forEach((key) => {
						let normFunc = this.normProps[key];
						if (normFunc.length > 1) {
							field[key] = normFunc(field, field[key]);
						} else if (!keys.includes(key)) {
							field[key] = normFunc(field);
						}
					});
				return field;
			} else if (typeof (field) == 'string') {
				return {
					$html: this.markdown(field)
				};
			} else if (typeof (field) == 'function') {
				return {
					$btn: true,
					// $col: 'auto',
					$label: field.name || 'Submit',
					$click: field.bind(this)
				};
			}
		},
		fieldsMap(fields, norm) {
			let isField = (val) => val
				&& typeof (val) == 'object'
				&& !Array.isArray(val)
				&& (val.type || val.options || val.default !== undefined || val.$default !== undefined || val.$btn || val.$fields || val.$html);
			let addKeys = (fields) => Object.entries(fields)
				.map(([key, val]) => isField(val) ? { key, ...val } : val);

			if (!Array.isArray(fields)) {
				fields = addKeys(fields);
			}

			let map = fields
				.map((item) => {
					if (Array.isArray(item)) {
						return {
							$fields: this.fieldsMap(item, norm)
						};
					} else if (item && typeof (item) == 'object' && !isField(item)) {
						return {
							$fields: this.fieldsMap(addKeys(item), norm)
						};
					} else if (typeof (norm) == 'function') {
						return norm(item);
					} else {
						return item;
					}
				})
				.filter((item) => item !== undefined);
			// console.log('fieldsMap', map);
			return map;
		}
	}
}
</script>


			<!-- <div>
				<label for="exampleFormControlTextarea1" class="form-label">Example textarea</label>
				<textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
				<div id="passwordHelpBlock" class="form-text">
					Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
				</div>

				<div class="mb-3">
					<label for="formFile" class="form-label">Default file input example</label>
					<input class="form-control" type="file" id="formFile">
				</div>
				<div class="mb-3">
					<label for="formFileMultiple" class="form-label">Multiple files input example</label>
					<input class="form-control" type="file" id="formFileMultiple" multiple>
				</div>
				<div class="mb-3">
					<label for="formFileDisabled" class="form-label">Disabled file input example</label>
					<input class="form-control" type="file" id="formFileDisabled" disabled>
				</div>
				<div class="mb-3">
					<label for="formFileSm" class="form-label">Small file input example</label>
					<input class="form-control form-control-sm" id="formFileSm" type="file">
				</div>
				<div>
					<label for="formFileLg" class="form-label">Large file input example</label>
					<input class="form-control form-control-lg" id="formFileLg" type="file">
				</div>

				<label for="exampleColorInput" class="form-label">Color picker</label>
				<input type="color" class="form-control form-control-color" id="exampleColorInput" value="#563d7c" title="Choose your color">
			</div> -->
