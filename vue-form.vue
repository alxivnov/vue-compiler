<template>
	<div>

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
		:is="indent || isRow ? 'fieldset' : 'form'"
		class="collapse"
		:class="{
			row: isRow,
			show: !collapse
		}"
		:id="collapse_id"
	>
		<div
			v-for="field in fields"
			:key="field?.key"
			:class="{
				[spacing]: !isRow,
				col: isRow,
				row: isCol && !(field?.type == 'object' && model[field.key]) && !(typeof (field) == 'string'),

				'ps-3': indent
			}"
		>
			<!-- TODO: Support mapping to multiple values or null / undefined in select -->
			<template v-if="field?.select">
				<label
					:for="field.id"
					:class="isCol ? [`col-${col}`, resize('col-form-label')] : 'form-label'"
				>
					{{ field.label || field.key }}
				</label>
				<select
					:id="field.id"
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
			<template v-else-if="field?.type == 'boolean'">
				<label
					v-if="isCol"
					:for="field.id"
					:class="isCol ? [`col-${col}`, resize('col-form-label')] : 'form-label'"
				>
					{{ field.label || field.key }}
				</label>
				<div
					class="form-check"
					:class="{
						col: isCol,
						[offset]: isCol
					}"
				>
					<input
						:id="field.id"
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
						{{ field.label || field.key }}
					</label>
				</div>
			</template>
			<template
				v-else-if="field?.type == 'number' || field?.type == 'string'"
			>
				<label
					:for="field.id"
					:class="isCol ? [`col-${col}`, resize('col-form-label')] : 'form-label'"
				>
					{{ field.label || field.key }}
				</label>
				<input
					:id="field.id"
					:type="field.type == 'string' ? 'text' : field.type"
					:class="{
						[resize('form-control')]: true,
						col: isCol
					}"
					:placeholder="field.placeholder || field.label || field.key"
					v-model="model[field.key]"
					:disabled="disabled"
					:readonly="readonly"
				>
			</template>
			<vue-form
				v-else-if="field?.type == 'object' && model[field.key]"
				v-model="model[field.key]"
				:schema="field.schema"
				:col="col"
				:size="size"
				:disabled="disabled"
				:readonly="readonly"
				:collapse="(indent || 0) > 2"

				:indent="(indent || 0) + 1"
			>
				{{ ' ' + (field.label || field.key) }}
			</vue-form>
			<vue-form
				v-else-if="Array.isArray(field)"
				v-model="model"
				:schema="field"
				col="auto"
				:size="size"
				:disabled="disabled"
				:readonly="readonly"
			>
			</vue-form>
			<div
				v-else-if="typeof (field) == 'string'"
				v-html="markdown(field)"
			>
			</div>
		</div>
		<button
			type="submit"
			class="btn btn-primary"
			:class="offset"
			v-if="!indent && !readonly && ($listeners.submit || $attrs.onSubmit)"
			@click.prevent="$emit('submit', this.data)"
		>
			Submit
		</button>
	</component>

	</div>
</template>

<script>
export default {
	name: 'vue-form',
	props: {
		// debug: Boolean,

		value: [Object, Array],
		schema: Array,

		col: [Number, String],
		size: String,
		disabled: Boolean,
		readonly: [Boolean, String],
		collapse: [Boolean, String],

		indent: Number,
	},
	data() {
		return {
			_schema: null,

			expanded: !this.collapse,
		};
	},
	computed: {
		isCol() {
			return this.col && !this.isRow;
		},
		isRow() {
			return this.col == 'auto';
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

		fields() {
			if (this._schema) {
				return this._schema;
			}

			this._schema = this.schema
				? this.schema//.filter(field => field && field.key)
				: this.value
					? Object.keys(this.value).map((key) => {
						let id = key + '_' + (this._uid || this._.uid);
						let type = typeof (this.value[key]);
						// let label = key;

						return {
							id,
							key,
							// label,
							type,
						};
					})
					: [];

			return this._schema;
		},
		model() {
			return this.value || {};
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
