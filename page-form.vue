<template>
	<div>
		<div class="row">
			<div class="col">
				<VueForm v-model="json" _size="lg" :schema="schema" @submit="submit">
				</VueForm>
			</div>
			<div class="col">
				<VueForm v-model="json" col="2" size="sm" readonly="plaintext">
					Readonly:
				</VueForm>
				<div class="mt-3">
					<code><pre>{{ JSON.stringify(json, undefined, 4) }}</pre></code>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import VueForm from './vue-form.vue';

let schema = [
	/*md*/`
### Header 3

* some
- thing
+ else
---
1. one
2. two

_This_ text __should__ appear *formatted* according **to** the [spec](https://daringfireball.net/projects/markdown/syntax).
`,
	null,	// ?
	true,	// ?
	false,	// ?
	0,		// ?
	100,	// ?
	{
		key: 'prop_boolean',
		type: 'boolean'
	},
	{
		key: 'prop_number',
		select: [
			123,
			234,
			345
		]
	},
	{
		key: 'prop_string',
		type: 'string',
		select: {
			'abc 123': '123',
			'bcd 234': '234',
			'cde 345': '345'
		}
	},
	{
		key: 'prop_object',
		type: 'object',
		schema: [
			[								// row
				{
					key: 'prop_number',
					type: 'number',
					label: 'Number',
					col: 2
				},
				{
					key: 'prop_string',
					type: 'string',
					label: 'String',
					col: true
				},
			],
			{
				key: 'prop_boolean',
				type: 'boolean',
				label: 'Boolean'
			},
		],
	}
];

export default {
	components: {
		VueForm
	},
	data() {
		return {
			json: {
				prop_boolean: true,
				prop_number: 234,
				prop_string: '345',
				prop_object: {
					prop_number: 124,
					prop_string: '124',
					prop_boolean: false,
				},
				prop_null: null,
				prop_undefined: undefined,
			},
			schema
		};
	},
	mounted() {

	},
	methods: {
		submit() {
			alert(JSON.stringify(this.json, undefined, 4))
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
