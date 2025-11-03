<template>
	<div>
		<div class="row">
			<div class="col">
				<UniForm v-model="json" :hor="true" _size="lg" :fields="fields" @submit="submit">
				</UniForm>
			</div>
			<div class="col">
				<UniForm v-model="json" hor="2" size="sm" readonly="plaintext">
					Readonly:
				</UniForm>
				<div class="mt-3">
					<code><pre>{{ JSON.stringify(json, undefined, 4) }}</pre></code>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import UniForm from './uni-form.vue';

let sub_fields = {
	row: {			// row
		col: [		// col
			{
				key: 'sub_number',
				type: 'number',
				$label: 'Number',

				$hor: 'auto'
			},
			{
				key: 'sub_string',
				type: 'string',
				$label: 'String',

				// $hor: true
			},
			{
				key: 'sub_boolean',
				type: 'boolean',
				$label: 'Boolean',

				$hor: false
			},
		],
		sub_null: {
			// key: 'prop_null',
			// type: 'number',
			options: {
				one: 1,
				two: 2,
			},
			// default: 2,
			$label: 'null',
			$hor: 2
		},
		sub_undefined: {
			// key: 'prop_undefined',
			// type: Boolean,
			// default: false,
			$default: true,
			$label: 'undefined',
			$hor: 'auto'
		}
	}
};

let fields = [
	/*md*/`
### Header 3

* some
- thing
+ else
---
1. one
2. two

_This_ text __should__ appear *formatted* according **to** the [spec](https://daringfireball.net/projects/markdown/syntax){target="_blank"}.
`,
	null,	// ?
	0,		// ?
	100,	// ?
	(data) => {
		alert(JSON.stringify(data, undefined, 4));
	},
	null,
	{
		key: 'prop_boolean',
		type: 'boolean',
		$hor: false
	},
	{
		key: 'prop_number',
		options: [
			123,
			234,
			345
		],
		$hor: false
	},
	{
		key: 'prop_string',
		type: 'string',
		options: {
			'abc 123': '123',
			'bcd 234': '234',
			'cde 345': '345'
		},
		$hor: false
	},
	{
		key: 'prop_object',
		type: 'object',
		$label: false,							// TODO: Hide labels & collapse indicators if $label = false
		$fields: sub_fields
	},
	{
		key: 'prop_null',
		type: 'object',
		$label: true,
		$fields: sub_fields
	},
	// [true, false]							// TODO: Add support for Done, Cancel buttons
];

export default {
	components: {
		UniForm
	},
	data() {
		return {
			json: undefined,
			fields
		};
	},
	mounted() {
		setTimeout(() => {
			this.json = {
				prop_boolean: true,
				prop_number: 234,
				prop_string: '345',
				prop_object: {				// TODO: Fix aditing null as v-model and property
					sub_number: 124,
					sub_string: '125',
					sub_boolean: false,
					sub_null: null,
					sub_undefined: undefined,
				},
				prop_null: null,
				prop_undefined: undefined,
			};
		}, 300);
	},
	methods: {
		submit() {
			alert(JSON.stringify(this.json, undefined, 4));
		},

		interface(value) {
			if (typeof (value) == 'bigint') {
				return BigInt;
			} else if (typeof (value) == 'boolean') {
				return Boolean;
			} else if (typeof (value) == 'function') {
				return Function;
			} else if (typeof (value) == 'number') {
				return Number;
			} else if (typeof (value) == 'object') {
				if (value == null) {
					return null;
				} else if (value instanceof Array) {
					return Array;
				} else if (value instanceof Date) {
					return Date;
				} else if (value instanceof Error) {
					return Error;
				} else if (value instanceof Promise) {
					return Promise;
				} else {
					return Object;
				}
			} else if (typeof (value) == 'string') {
				return String;
			} else if (typeof (value) == 'symbol') {
				return Symbol;
			} else if (typeof (value) == 'undefined') {
				return undefined;
			}
		}
	}
}
</script>
