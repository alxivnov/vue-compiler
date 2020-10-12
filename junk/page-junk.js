//console.log('CONTEXT', context.defs);

import 'java-script.js';
import exp_def from 'export-default.js';
import { prop } from 'module-exports.js';

import FormInput from '../form-input.vue';
const FormSelect = () => import('../form-select.vue');

import ImportFrom from 'import-from.vue';
const ImportFunc = () => import('import-func.vue');
console.log('ImportFrom', ImportFrom);
console.log('ImportFunc', ImportFunc);

const func = (resolve, reject) => {
	resolve({
		template: '<h1>TEST</h1>'
	});
};
const test = Vue.component
	? func
	: Vue.defineAsyncComponent(() => new Promise(func));

import some from 'html.html';

//console.log(func);

export default {
	components: {
		'form-input': FormInput,
		'form-select': FormSelect,
		'some': some,

		'import-from': ImportFrom,
		'import-func': ImportFunc,
		'test': test
	},
	props: [
		'prop'
	],
	data() {
		return {
			vInput: 'Some',
			vSelect: '3rd',

//			jsText: text,
//			jsFunc: func(),
			expDef: exp_def.func(),
			modExp: prop,
			truthy: null
		};
	},
	mounted() {
		console.log('mounted()');

		this.truthy = [undefined, null, true, false, 0, 1, '', 'a', {}, { a: 1 }, [], [1, "a"]].map(val => {
			let json = val === undefined
				? 'undefined'
				: JSON.stringify(val);
			let parse = val === undefined
				? ''
				: JSON.parse(json);

			console.log('val', val);

			return {
				val,
				json,
				parse,
				truthy: !!val,
				true: val == true
			};
		});

		console.log('truthy', this.truthy);
	},
	methods: {
		click() {
			console.log('Button clicked');
		}
	}
}