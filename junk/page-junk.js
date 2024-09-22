//console.log('CONTEXT', context.defs);

import 'java-script.js';
import exp_def from 'export-default.js';
import { prop } from 'module-exports.js';

import FormInput from '../form-input.vue';
const FormSelect = () => import('../form-select.vue');
const FormRadioGroup = () => import('../form-radio-group.vue');

import ImportFrom from 'import-from.vue';
const ImportFunc = () => import('import-func.vue');
console.log('ImportFrom', ImportFrom);
console.log('ImportFunc', ImportFunc);

const func = (resolve, reject) => {
	resolve({
		template: '<h1>TEST</h1>'
	});
};
const test = Vue.version < '3.0' && Vue.component
	? func
	: Vue.defineAsyncComponent(() => new Promise(func));

import some from 'html.html';

const Modal = () => import('../modal.vue');

//console.log(func);

// php -S 127.0.0.1:5000
// python -m http.server 8000
// python3 -m http.server 8000

export default {
	components: {
		'modal': Modal,

		'form-input': FormInput,
		'form-select': FormSelect,
		'form-radio-group': FormRadioGroup,
		'some': some,

		'import-from': ImportFrom,
		'import-func': ImportFunc,
		'test': test,

		ScoreBadge: () => import('./score-badge.vue'),
		'composition-api': () => import('./composition-api.vue'),

		ExtendsJs: () => import('./extends-comp.js'),
		ExtendsVue: () => import('./extends-comp.vue'),
	},
	props: [
		'prop'
	],
	data() {
		return {
			vInput: 'Some',
			vSelect: '5th',
			vCheck: true,
			vRadio: '2nd',
			vFile: null,
			vModal: '',

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

			if (window.jQuery) {
				$('#modal').modal('show');
			} else {
				let el = document.getElementById('modal');
				let modal = bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el);
				modal.show();
			}
		},
		shown() {
			this.vModal += ' shown';

			console.log('shown');
		},
		hidden() {
			this.vModal += ' hidden';

			console.log('hidden');
		},
		file($event) {
			this.vFile = $event.target.files.length && $event.target.files[0].name;
		}
	}
}
