<template>
	<!-- TODO: Replace with wrapper -->
	<div
		:class="{
			'w-100': isRow,	// Required for row layout
		}"
	>

	<a
		v-if="$slots.default"
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
		:is="indent || /*isRow*/layout ? 'fieldset' : 'form'"
		class="collapse"
		:class="{
			'px-0': layout,

			row: isRow,
			show: !collapse
		}"
		:id="collapse_id"
	>
		<div
			v-for="field in normFields"
			:key="field.key"
			:class="{
				[spacing]: !isRow,
				col: isRow,
				row: isCol && !(field.type == 'object' && model[field.key]) && !(typeof (field) == 'string'),

				'ps-3': indent
			}"
		>
			<template v-if="field.select">
				<label
					:for="field.id"
					:class="isCol ? [`col-${col}`, resize('col-form-label')] : 'form-label'"
				>
					{{ field.label }}
				</label>
				<!-- TODO: Test with col layout -->
				<select
					:id="field.id"
					:name="field.name"
					:class="resize('form-select')"
					v-model="model[field.key]"
					:disabled="disabled || readonly"
				>
					<option
						v-for="key in Object.keys(field.select)"
						:key="key"
						:value="field.select[key]"
					>
						{{ Array.isArray(field.select) ? field.select[key] : key }}
					</option>
				</select>
			</template>
			<template v-else-if="field.type == 'boolean'">
				<label
					v-if="isCol"
					:for="field.id"
					:class="isCol ? [`col-${col}`, resize('col-form-label')] : 'form-label'"
				>
					{{ field.label }}
				</label>
				<!-- TODO: Replace with wrapper -->
				<div :class="{ col: isCol }">

				<div
					class="form-check"
					:class="{
						// 'col': isCol,
						[offset]: isCol
					}"
				>
					<input
						:id="field.id"
						:name="field.name"
						type="checkbox"
						class="form-check-input"
						v-model="model[field.key]"
						:disabled="disabled || readonly"
					>
					<label
						v-if="!isCol"
						:for="field.id"
						class="form-check-label"
					>
						{{ field.label }}
					</label>
				</div>

				</div>
			</template>
			<template v-else-if="field.type == 'number' || field.type == 'string'">
				<label
					:for="field.id"
					:class="isCol ? [`col-${col}`, resize('col-form-label')] : 'form-label'"
				>
					{{ field.label }}
				</label>
				<!-- TODO: Replace with wrpapper -->
				<div :class="{ col: isCol }">

				<input
					:id="field.id"
					:name="field.name"
					:type="field.typeAttr"
					:class="{
						[resize('form-control')]: true,
						// col: isCol
					}"
					:placeholder="field.placeholder"
					v-model="model[field.key]"
					:disabled="disabled"
					:readonly="readonly"
				>

				</div>
			</template>
			<!--
				TODO: Fix defaults on creation
				TODO: Add support for textarea
				TODO: Add support for functions/buttons
				TODO: Add support for layout column sizes
				TODO: Add support for object as fields
				TODO: Remake REST in AnyForm/AnyPage
				TODO: Add support for files
				TODO: Add support for colors
				TODO: Add support for arrays
				TODO: Add support for custom components
			-->
			<template v-else-if="field.type == 'array'">
				<div
					v-for="(badge, i) in this.model[field.key] || []"
					:key="i"
					class="badge"
				>
					{{ badge }}
				</div>
			</template>
			<component
				v-else-if="field.comp"
				:id="field.id"
				:name="field.name"
				:is="field.comp"
				:props="field.props"
				v-model="field.key"
			>
			</component>
			<any-form
				v-else-if="field.type == 'object' && model[field.key]"
				v-model="model[field.key]"
				:fields="field.fields"
				:col="col"
				:size="size"
				:disabled="disabled"
				:readonly="readonly"
				:collapse="(indent || 0) > 2"

				:indent="(indent || 0) + 1"
			>
				{{ ' ' + field.label }}
			</any-form>
			<any-form
				v-else-if="field.fields"
				v-model="value"
				:fields="field.fields"
				:layout="layout == 'row' ? 'col' : 'row'"
				:size="size"
				:disabled="disabled"
				:readonly="readonly"
			>
			</any-form>
			<div
				v-else-if="field.html"
				v-html="field.html"
			>
			</div>
		</div>
		<button
			type="submit"
			class="btn btn-primary"
			:class="offset"
			v-if="!indent && !readonly && ($listeners.submit || $attrs.onSubmit)"
			@click.prevent="$emit('submit', value)"
		>
			Submit
		</button>
	</component>

	</div>
</template>

<script>
let flatten = (val) => {
	return Array.isArray(val)
		? val.flatMap(flatten)
		: [val];
};

export default {
	name: 'any-form',
	props: {
		// debug: Boolean,

		value: [Object, Array],
		fields: [Object, Array],

		col: [Number, String],
		size: String,
		disabled: Boolean,
		readonly: [Boolean, String],
		collapse: [Boolean, String],

		layout: String,
		indent: Number,
	},
	data() {
		return {
			_normFields: null,
			_normValue: null,

			expanded: !this.collapse,

			normProps: {
				// key: (field) => undefined,
				type: (field, value) => value == Boolean ? 'boolean'
					: value == Number ? 'number'
						: value == Object ? 'object'
							: value == String ? 'string'
								: field.default ? typeof (field.default)
									: value,
				default: (field) => field.type == 'boolean' ? false
					: field.type == 'number' ? 0
						: field.type == 'object' ? {}
							: field.type == 'string' ? ''
								: undefined,

				id: (field) => field.key + '_' + (this._uid || this._.uid),
				name: (field) => {
					return field.key;
				},
				label: (field) => field.key,
				placeholder: (field) => field.label || field.key,

				typeAttr: (field) => field.type == 'string' ? 'text' : field.type,
				// select: (field) => undefined,
				// schema: (field) => undefined,
			},
		};
	},
	computed: {
		isCol() {
			return this.col && !this.isRow;
		},
		isRow() {
			return this.layout == 'row';
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
			if (!this._normFields && (this.fields || this.value)) {
				let fields = this.fields
					? this.fieldsMap(this.fields, this.normField)
					: this.value
						? Object.entries(this.value)
							.filter(([key, val]) => val != null)
							.map(([key, val]) => this.normField({ key, type: typeof (val) }))
						: [];

				this._normFields = fields;
			}

			return this._normFields || [];
		},
		model() {
			if (!this._normValue && (this.value)) {
				let props = this.normFields
					.flatMap(flatten)
					.filter(field => field.key);

				this._normValue = Object.defineProperties({}, props.reduce((wrapper, field) => {
					// TODO: Replace _comp with _value
					wrapper[field.key] = {
						get() {
							return this._comp.value?.[field.key] != null
								? this._comp.value[field.key]
								: field.default;
						},
						set(value) {
							this._comp.value[field.key] = value;
						}
					};
					return wrapper;
				}, { _comp: { value: this } }));
			}

			return this._normValue || {};
		},

		collapse_id() {
			return 'collapse_' + (this._uid || this._.uid);
		},
	},
	mounted() {

	},
	methods: {
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

		markdown(string) {
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
					let regexp = /(?<format>(?:\*|_){1,2})(?<text>.*?)(?:(?:\*|_){1,2})|(?<img>!)?\[(?<text>.*?)\]\((?<url>.*?)\)/g;
					let words = [];
					let word = undefined;
					while (word = regexp.exec(text)) {
						words.push(word);
					}
					text = words.reverse().reduce((html, tag) => {
						let { img, url, format, text } = tag.groups;
						let op = html.slice(0, tag.index);
						let cl = html.slice(tag.index + tag[0].length);
						if (format) {
							return op
								+ (format.length > 1 ? '<strong>' : '<em>')
								+ text
								+ (format.length > 1 ? '</strong>' : '</em>')
								+ cl;
						} else if (img) {
							return op + `<img alt="${text}" src="${url}" />` + cl;
						} else {
							return op + `<a href="${url}">${text}</a>` + cl;
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
				return {
					html: '<p></p>'
				};
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
					html: this.markdown(field)
				};
			}
		},
		fieldsMap(fields, norm) {
			if (!Array.isArray(fields)) {
				fields = Object.entries(fields)
					.map(([key, val]) => val && typeof (val) == 'object' && !Array.isArray(val) ? { key, ...val } : val);
			}

			return fields
				.map((item) => {
					if (Array.isArray(item)) {
						return {
							fields: this.fieldsMap(item, norm)
						};
					} else if (typeof (norm) == 'function') {
						return norm(item);
					} else {
						return item;
					}
				})
				.filter((item) => item !== undefined);
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
