// https://vuejs.org/v2/guide/render-function.html#Functional-Components
// https://v3.vuejs.org/guide/migration/introduction.html#breaking-changes
const VueCompiler = (function () {
	function regexp(pattern, flags) {
		if (Array.isArray(pattern)) {
			pattern = pattern.join('|');
		}

		return new RegExp(
			flags.includes('s')
				? pattern.replace(/\./g, '[\\s\\S]')
				: pattern,
			flags.replace('s', '')
		);
	}

	RegExp.prototype.find = function (string, reset) {
		if (reset)
			this.lastIndex = 0;

		return this.exec(string);
	};
	RegExp.prototype.findAll = function (string, reset) {
		if (reset)
			this.lastIndex = 0;

		let regs = [];

		var reg = null;
		while (reg = this.exec(string)) {
			regs.push(reg);
		}

		return regs;
	};
	JSON.tryParse = function (string) {
		try {
			return JSON.parse(string);
		} catch {
			return undefined;
		}
	};

//	if (Vue.component)						// v2
//		Vue.import = importComponents;
//	else									// v3
//		Vue.prototype.import = importComponents;

	// const LOG_COMP_NAME = 'page-rest';
	return {
		// Vue: typeof (Vue) == 'undefined' ? undefined : Vue,

		regexp: {
			name: regexp('[^\\d\\w-]', 'g'),
			slot: regexp('_t\\("([^"]+?)"\\)', 'g'),
			src: regexp('<(template|script)[ ]*src=(?:\'|"|`)([^\'"`]*)(?:\'|"|`).*>', 'gs'),
			template: regexp('<template([^>]*)>(.*)<\/template>', 'gs'),
			script: regexp('<script([^>]*)>(.*?)(export\\s+default|module\.exports\\s*=|import\\s+([\\w\\s{},]+)\\s+from\\s+\'vue\')\\s+(.*)<\/script>', 'gs'),
			export: regexp('(.*?)(?:export\\s+default|module\.exports\\s*=)\\s+(.*)', 'gms'),
			import: regexp([
				'(?:^)\\s*(?:await\\s+)?import(?:\\s+(?<name>[^\'"`].*?)\\s+from\\s+|\\s+)(?:\'|"|`)(?<url>.*?)(?:\'|"|`);?',
				'(?:^\\s*)(?:const|let|var)\\s+(?<name>\\w+)\\s*=\\s*import\\((?:\'|"|`)(?<url>.*?)(?:\'|"|`)\\);?'
			], 'gms'),//|\\r\\n
//			awaitimport: regexp('(?:^)\\s*const\\s+([^\'"`].*?)\\s*=\\s*await\\s+import\\(\\s*(?:\'|"|`)(.*?)(?:\'|"|`)\\s*\\);?', 'gms'),//|\\r\\n
			absolute: regexp('(\\([^()=>]*\\)\\s*\\=\\>\\s*)?import\\(([^())]+)\\)', 'g'),//regexp('\\bimport\\(([^())]+)\\)', 'g'),

			scopedSlot: regexp('_t\\("([^"]+?)",(?:function\\(\\){return )*(.*]|null)(?:})*(?:\\)$|,{(.*)}\\)$)', 'g'),//regexp('_t\\("([^"]+?)",(.*)(?:,{(.*?)}\\)|((?=[^}])\\)))', 'g'),

			tsType: regexp('type\\s+(\\S+)\\s*=.*(?:;|$)', 'gm'),
			tsInterface: regexp('interface\\s+(\\S+)\\s*{.*?}(?:;|$)', 'gms'),
			tsGeneric: regexp('function\\s+\\S+<(\\S+)>\\s*', 'gm'),

			metacharacters: regexp('([\\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)\\[\\{]{1})', 'gm')
		},

		vue2: {
			// emitter: typeof (TinyEmitter) == 'function' ? new TinyEmitter() : undefined,

			listeners(attrs) {
				return Object.keys(attrs)
					.filter((key) => key.startsWith('on') && typeof (attrs[key]) == 'function')
					.reduce((listeners, key) => ({ ...listeners, [key[2].toLowerCase() + key.substring(3)]: attrs[key] }), {});
			},
			// createElement(type, props, children) {
			// 	let vue3 = {
			// 		...props,

			// 		...(props.attrs || {}),
			// 		attrs: undefined,

			// 		...(props.domProps || {}),
			// 		domProps: undefined,

			// 		...Object.keys(props.on || {})
			// 			.reduce((listeners, key) => ({ ...listeners, ['on' + key[0].toUpperCase() + key.substring(1)]: props.on[key] }), {}),
			// 		on: undefined,
			// 	};
			// 	return VueCompiler.Vue.h(type, vue3, children);
			// },
			mixin: {
				computed: {
					$listeners() {
						return VueCompiler.vue2.listeners(this.$attrs || {});
					},
					_uid() {
						return this.$ && this.$.uid
							|| this._ && this._.uid;
					}
				},
				methods: {
					$on: () => {
						console.error('$on instance method is removed in Vue 3.');
					},
					$off: () => {
						console.error('$off instance method is removed in Vue 3.');
					},
					$once: () => {
						console.error('$once instance method is removed in Vue 3.');
					},
					$set: (target, propertyName, value) => {
						console.error('$set instance method is removed in Vue 3.');
						// target[propertyName] = value;
					},
					$delete: (target, propertyName) => {
						console.error('$delete instance method is removed in Vue 3.');
						// delete target[propertyName];
					},
					// $createElement: (...args) => {
					// 	return VueCompiler.vue2.createElement(...args);
					// }
				}
			}
		},

		tsStripper(param) {
			param = Array.isArray(param) ? param : [param];

			let matches = param.flatMap(el => {
				let t = VueCompiler.regexp.tsType.findAll(el);
				let i = VueCompiler.regexp.tsInterface.findAll(el);
				let g = VueCompiler.regexp.tsGeneric.findAll(el);

				return t.concat(i).concat(g);
			});

			let pattern = ':\\s*(?:boolean|number|string|T)(\\[\\s*\\])?|\\s*as\\s+[\\w\\<\\>]+';
			pattern = pattern.replace(/T/gm, matches.map(el => el[1]).join('|'));
			pattern = pattern + '|' + matches.map(el => el[0].startsWith('function') ? '<' + el[1] + '>' : el[0].replace(VueCompiler.regexp.metacharacters, '\\$1')).join('|');
			console.log('pattern', pattern);
			return regexp(pattern, 'gm');
		},


		tryCall(fn, message) {
			// return fn;
			if (typeof (fn) == 'function') {
				return function (...args) {
					try {
						return fn.call(this, ...args);
					} catch (err) {
						console.error(message, err);

						throw err;
					}
				}
			} else {
				return fn;
			}
		},

		scopedSlot: function (fn) {
			var start = -1;
			while ((start = fn.indexOf('_t')) > -1) {
				var end = start + 3;

				var count = 1;
				while (count) {
					if (fn[end] == '(')
						count++;
					else if (fn[end] == ')')
						count--;
					end++;
				}

				let prev = fn.substring(start, end);
				let curr = prev.replace(VueCompiler.regexp.scopedSlot, '(scopedSlots["$1"] ? scopedSlots["$1"]({$3}) : $2)');
//				console.log('scopedSlot', /*fn,*/ prev, curr, VueCompiler.regexp.scopedSlot.find(prev));
				fn = fn.replace(prev, curr);
			}

			return fn;
		},

		global: {},

		componentName(url, camel) {
			var name = url
				.split('/')
				.slice(-1)[0]
			name = name.includes('.')
				? name
					.split('.')
					.slice(0, -1)
				: [name];
			name = name
				.flatMap(function (el) {
					return el.split(/[-_]/);
				})
				.map(function (el) {
					let val = el.replace(VueCompiler.regexp.name, '-');
					return camel ? val.slice(0, 1).toUpperCase() + val.slice(1) : val;
				})
				.join(camel ? '' : '-');
			return name;
		},

	import: function (components, settings) {
		if (typeof (components) == 'string')
			components = [components];

		if (Array.isArray(components))
			components = components.reduce(function (prev, curr) {
				let name = VueCompiler.componentName(curr);
				prev[name] = curr;
				return prev;
			}, {});

			let component = this.component;
			return Object.keys(components).reduce(function (imported, name) {

			/*
const test = VueCompiler.Vue.defineAsyncComponent(() => new Promise((resolve, reject) => {
	resolve({
		template: '<h1>TEST</h1>'
	});
}));
			*/

				let url = VueCompiler.absolute(components[name], document.baseURI);

				let comp = function (name, url, def) {
				// if (name.startsWith('Base'))
				// 	def.then(function (def) {
				// 		VueCompiler.global[url] = def;
				// 	}).catch(function (err) {
				// 		delete VueCompiler.global[url];
				// 	});

				if (settings.Vue/*component*/.version < '3.0') {
					settings.Vue.component(name, function (resolve, reject) {
						let val = VueCompiler.global[url];
						if (val)
							resolve(val);
						else
							def
								.then(function (def) {
									resolve(def);
								})
								.catch(function (err) {
									reject(err);
								});
					});
				} else if (settings.Vue.defineAsyncComponent) {
					let comp = settings.Vue.defineAsyncComponent(function () { return def; });

					return typeof (component) == 'function'
						? component(name, comp)
						: comp;
				}
				};

				if (name.startsWith('Bundle')) {
					return fetch(url)
						.then(function (res) {
							return res.ok ? res.formData() : null;
						})
						.then(function (form) {
							if (form instanceof FormData)
								[...form.keys()].forEach(function (name) {
									let file = form.get(name);
									let absoluteURL = `${url.split('?')[0]}/${name}`;
									let def = file.text()
										.then(function (text) {
											return VueCompiler.template(absoluteURL, text, { ...settings, isComp: true, compName: name });
										});
									comp(name, absoluteURL, def);
								});
					});
				} else {
					// console.log('Vue???', settings);
					let def = VueCompiler.download(components[name], { ...settings, compName: name });

					imported[name] = comp(name, url, def);
				}

				return imported;
			}, {});
		},

		absolute: function (url, base) {
			let abs = new URL(url, base);
//			console.log('URL', url, base, abs.href);
			return abs.href;
		},

		sequence: function (arr, context) {
			return arr.reduce(function (prev, curr) {
				return prev.then(function (ctx) {
					return typeof (curr) == 'function'
						? curr(ctx)
						: curr;
				});
			}, Promise.resolve(context));
		},

		settings: {},
		cache: {},

		download: function (url, settings, thisArg = this) {
			let _cache = settings?.cache || VueCompiler.settings.cache;

			let absoluteURL = VueCompiler.absolute(url, document.baseURI);

			if (typeof (LOG_COMP_NAME) == 'string' && absoluteURL.includes(LOG_COMP_NAME)) {
				console.trace(absoluteURL);
			}

//			console.log('download', absoluteURL);
			if (_cache && VueCompiler.cache[absoluteURL])
				return new Promise(function (resolve, reject) {
//					console.log('cache', absoluteURL);

					resolve(VueCompiler.cache[absoluteURL].temp);
				});

		const VUE_HEADERS = [
			'application/vue',
			'text/vue'
		];

			return fetch(
				url,
				{ headers: { 'Accept': `${VUE_HEADERS.join(',')},application/json,multipart/form-data,text/*` } }
			)
				.then(function (res) {
					if (res.ok) {
						let type = res.headers.get('Content-Type') || '';

						if (type.includes('application/json')) {
							return res.json();
						} else {
							return res.text()
								.then(function (text) {
									return VUE_HEADERS.some(header => type.startsWith(header)) || url.includes('/vue/') || url.endsWith('.vue')
										? VueCompiler.template(absoluteURL, text, { ...settings, isComp: true }, thisArg)
										: type.startsWith('application/javascript')	// Obsolete as of RFC 9239 https://www.ietf.org/rfc/rfc9239.pdf
											|| type.startsWith('text/javascript') || url.endsWith('.js')
											? VueCompiler.template(absoluteURL, text, { ...settings, isComp: false }, thisArg)
											: text;
								});
						}
					}
				});
		},

		template: function (absoluteURL, text, settings, thisArg = this) {
			let { compName, isComp, mixins } = settings;
			let vue2 = settings?.vue2 || VueCompiler.settings.vue2;
			let _async = settings?.async || VueCompiler.settings.async;
			let _cache = settings?.cache || VueCompiler.settings.cache;

			return VueCompiler.assemble(text, absoluteURL).then(function (text) {
				let isHTML = /^\s*</.test(text);
				var template = isHTML && VueCompiler.regexp.template.find(text, true);
				var script = isHTML && VueCompiler.regexp.script.find(text, true);
				script = !!script && script.length > 3 ? { attr: script[1], init: script[2], comp: script[4], main: script[5] } : null;
				//
//				console.log('vue_component_definition', absoluteURL, template, script);
				if (!template && !script) {
					script = VueCompiler.regexp.export.find(text, true);
					script = !!script && script.length > 2 ? { attr: '', init: script[1], main: script[2] } : null;
				}

				let hasTemplate = !!template && template.length > 2;
				let hasScript = !!script;//!!script && script.length > 2;

				if (!!script && script.attr.includes('lang="ts"')) {
					let stripper = VueCompiler.tsStripper([script.init, script.main]);
					script.init = script.init.replace(stripper, '');
					script.main = script.main.replace(stripper, '');

					let defineComponent = 'defineComponent';
					if (script.main.startsWith(defineComponent))
						script.main = script.main.substring(defineComponent.length);
				}

				let ver = settings.Vue./*component*/version < '3.0'
					? 2
					: settings.Vue.defineAsyncComponent
						? 3
						: 0;
				let ctx = {
					defs: {},
					isComp,
					mixins: vue2 && ver == 3
						? [
							VueCompiler.vue2.mixin,
							...(mixins || []),
						]
						: mixins,
					ver,
					thisArg,
					Vue: typeof (Vue) == 'undefined'
						? settings.Vue
						: Vue
				};

				if (!hasTemplate && !hasScript) {
					return Function('context', text + '//# sourceURL=' + absoluteURL).call(ctx.thisArg, ctx);

					let json = JSON.tryParse(text);

					return json === undefined ? text ? { template: '<span>' + text + '</span>' } : null : json;//text;
				}

				let imps = hasScript ? VueCompiler.regexp.import.findAll(script.init, true) : [];
//				if (hasScript && imps.length === 0)
//					imps = VueCompiler.regexp.awaitimport.findAll(script.init, true);

				let asyncImps = [];
				let syncImps = [];
				imps.forEach(function (imp) {
					if (_async
						&& (_async === true || imp.groups.url.search(_async) > -1)
						&& script.main.search(new RegExp('(?:,|{|^)\\s*extends:\\s*' + imp.groups.name + '\\s*(?:,|}|$)')) == -1)
						asyncImps.push(imp);
					else
						syncImps.push(imp);
				});

				if (hasScript) {
					var replaceValue = 'VueCompiler.download(VueCompiler.absolute($2, \''
						+ absoluteURL
						+ '\'), '
						// Vue???
						+ (isComp ? '{ ...context, isComp: false }' : '{}')
						+ ', context.thisArg)';

					// if (ctx.ver == 3)
					// 	replaceValue = 'VueCompiler.Vue.defineAsyncComponent(() => ' + replaceValue + ')';
					// else
						replaceValue = '$1' + replaceValue;

					ctx.init = script.init.replace(VueCompiler.regexp.absolute, replaceValue);
					ctx.main = script.main.replace(VueCompiler.regexp.absolute, replaceValue);
					ctx.attr = script.attr;
					ctx.comp = script.comp;

					if (vue2 && isComp && ctx.ver == 3) {
						ctx.main = ctx.main.replace(/\$emit\('input',/g, `$emit('update:modelValue',`);
					}

					if (typeof (LOG_COMP_NAME) == 'string' && absoluteURL.includes(LOG_COMP_NAME)) {
						console.log(absoluteURL, ctx.main);
					}

					asyncImps.forEach(function (imp) {
						let asyncURL = VueCompiler.absolute(imp.groups.url, absoluteURL);
						var asyncReplace = 'function () {'
							// + 'try {'
							+ 'return VueCompiler.download(\''
							+ asyncURL
							+ '\', { ...context, isComp: false }, context.thisArg);'
							// + ' } catch (err) { console.log("'
							// + asyncURL
							// + '", err); throw err; }'
							+ '}';
						if (/*vue2 &&*/ isComp && ctx.ver == 3) {
							asyncReplace = 'context.Vue.defineAsyncComponent(' + asyncReplace + ')';
						// asyncReplace = 'VueCompiler.global[\'' + asyncURL + '\'] || ' + asyncReplace;
						}

						ctx.init = ctx.init.replace(imp[0], 'const ' + imp.groups.name + ' = ' + asyncReplace + ';');
					});
				}
				//
//				console.log('imps', absoluteURL, imps, ctx.init);
				let last = function (context) {
					return new Promise(function (resolve, reject) {
						//
//						console.log(/*'js', url, js, script, */context);
						let setup = context.attr && context.attr.includes('setup');
						let esm = setup || context.comp || typeof (Vue) == 'undefined'
							? 'const ' + (context.comp || 'Vue') + ' = context.Vue;\n'
							: '';
						let name = compName || VueCompiler.componentName(absoluteURL) || 'VueCompiler.js';
						var func = context.main
							? '"use strict";\n'
								// + '\ntry {'
								+ esm
								+ (context.init || '')
								+ 'return('
								+ (setup
									? '{setup(){\n' + '\nconst ' + (context.comp || 'Vue') + ' = context.Vue;'
									: '')
								+ (context.main.replace(/[\s;]+$/, '') || '{}')
								+ (setup
									? '\nreturn{'
										+ /^(?:const|let|var|(function))\s+(\w+)/gm
											.findAll(context.main)
											.map(prop => prop[2])
											.join(',')
										+ '}}}'
									: '')
								+ ')'
								// + '\n} catch (err) { console.error("'
								// + name
								// + '", err); throw err; }'
							: null;
						// if (name == 'extends-comp' || name == 'score-badge' || name == 'composition-api') {
						// 	console.log('comp', name, absoluteURL, func);
						// }
						try {
//							let func = '(function(){' + context.init + 'return ' + context.main + '})';
//							let temp = context.main ? eval(func + '//# sourceURL=' + name)() : {};
							var temp = func
								? Function('context', func + '//# sourceURL=' + absoluteURL).call(context.thisArg, context)
								: {};

							if (context.isComp) {
								if (!temp.name) {
									temp.name = name;
								}

							if (hasTemplate) {
//								temp.template = template[2];
								temp.functional = template[1].includes('functional');

								let html = template[2];
								if (vue2 && context.ver == 3) {
									temp.template = temp.functional
										? html
//											.replace('v-bind="data.attrs"', 'v-bind="$attrs"')
											.replace(/listeners/g, /*'{}'*/'$listeners')
											.replace(/data\.attrs/g, '$attrs')
											.replace(/data\./g, '$data.')
											.replace(/props\./g, '')
											.replace(/slots\(\)/g, '$slots')
											.replace(/\$scopedSlots/g, '$slots')
										: html
											.replace(/\$scopedSlots(.(\w+)|\[.+\])/g, '$slots$1');
									temp.template = temp.template
										.replace(/@hook:(\w+)="/g, '@vue:$1="')
										.replace(/<(?!(component|input|textarea|select|option)\s+)([^<]*?):value="/g, '<$1$2:modelValue="')
										// .replace(/:value="/g, ':modelValue="')
										// .replace(/<(input|textarea|select|option)([\s\S]*?):modelValue="/g, '<$1$2:value="')
										.replace(/<(?!(component|input|textarea)\s+)([^<]*?)@input="/g, '<$1$2@update:modelValue="')
										// .replace(/@input="/g, '@update:modelValue="')
										// .replace(/<(input|textarea)([\s\S]*?)@update:modelValue="/g, '<$1$2@input="')
										// .replace(/:value="(.+)"\s+@input="(.+)"/g, ':modelValue="$1" @update:modelValue="$2"')
										// .replace(/\$attrs\.value/g, `$attrs.modelValue`);
								} else {
									if (temp.functional) {
										if (temp.computed)
											Object.keys(temp.computed).forEach(key => {
												let func = temp.computed[key]
													.toString()
													.replace(/this\.\$attrs\./g, 'data.attrs.')
													.replace(/this\.\$props\./g, 'props.')
													.replace(/this\./g, 'props.');
												html = html.replace(regexp(key, 'gm'), (func.startsWith('function') ? '(' : '(function ') + func + ')()');
											});

										let res = settings.Vue.compile(html);
										let fn = VueCompiler.scopedSlot(res.render.toString()
											.replace('anonymous(', '(_h, _vm')
											.replace('with(this)', 'with(_vm)')
											.replace(VueCompiler.regexp.slot, 'slots()["$1"]'));

										func = fn.substring(fn.indexOf('{') + 1, fn.lastIndexOf('}') - 1);
//										temp.render = eval('(' + fn + ')' + '//# sourceURL=' + name + '.js');
										temp.render = Function('_h', '_vm', func + '//# sourceURL=' + name + '.js');
										temp.staticRenderFns = res.staticRenderFns;
//										delete temp.template;
									} else {
										temp.template = html;
									}
								}

								temp.mixins = context.mixins;
							}

							if (vue2 && context.ver == 3) {
								if (temp.render) {
									let fn = temp.render.toString();
									let match = /render\s*(?::\s*(?:function\s*)*)*\(\s*(\w+)\s*(?:,\s*(\w+)\s*)?(?:,\s*(\w+)\s*)?\)\s*(=>\s*)*\{/.exec(fn);
									if (match) {
										let args = match.slice(1).filter(arg => arg);
										func = fn.substring(fn.indexOf('{') + 1, fn.lastIndexOf('}') - 1);
										temp.render = Function(...args, `${match[1]} = VueCompiler.vue2.createElement;\n` + (temp.functional && match[2] ? `${match[2]} = this;\n` : '') + func + '//# sourceURL=' + name + '.js');
									}
								}

								if (typeof (temp.components) == 'object') {
									Object.keys(temp.components)
										.filter(comp => typeof (temp.components[comp]) == 'function' && comp.name != 'AsyncComponentWrapper')
										.forEach(comp => {
											let from = temp.components[comp];
											let to = settings.Vue.defineAsyncComponent(from);
											temp.components[comp] = to;
										});
								}

								if (Array.isArray(temp.props) && temp.props.includes('value')
									|| temp.props && typeof (temp.props) == 'object' && temp.props.value) {
									if (Array.isArray(temp.props)) {
										temp.props.splice(temp.props.indexOf('value'), 1, 'modelValue');
									} else {
										temp.props.modelValue = temp.props.value;
										delete temp.props.value;
									}

									let value = function () {
										return this.modelValue || this.$attrs.value;
									};

									if (temp.computed) {
										temp.computed.value = value;
									} else {
										temp.computed = { value };
									}
								}
							}

							if (typeof (LOG_COMP_NAME) == 'string' && absoluteURL.includes(LOG_COMP_NAME)) {
								console.log(name, func, temp.template);
							}

							if (typeof (temp.data) == 'function')
								temp.data = VueCompiler.tryCall(temp.data, name);
							if (typeof (temp.mounted) == 'function')
								temp.mounted = VueCompiler.tryCall(temp.mounted, name);

							}

							if (_cache) {
								VueCompiler.cache[absoluteURL] = {
									temp: temp,
									time: new Date()
								};

//								console.log('cached', absoluteURL);
							}

							resolve(temp);
						} catch (err) {
							err.name = name;
							err.func = func;

							console.log('eval', err, err.line, name, func);

							reject(err);
						}
					});
				};
				let context = ctx;//
				let promises = syncImps.filter(function (imp) {
					return imp.length > 2;
				}).map(function (imp) {
//					return function (context) {
						let impURL = VueCompiler.absolute(imp.groups.url, absoluteURL);
						return VueCompiler.download(impURL, { ...settings, isComp: false, mixins: context.mixins }, context.thisArg).then(function (def) {
							// if (def instanceof Object || def == null) {
								context.defs[impURL] = def;
								let name = imp.groups.name || VueCompiler.componentName(imp.groups.url, true);
								//
//								console.log('def', imp, name, def);
								def = 'let ' + name + ' = context.defs[\'' + impURL + '\'];';
							// }

							context.init = context.init.replace(imp[0], def);

							return context;
						});
//					}
				});
				return Promise.allSettled(promises).then(function () {
					return last(context);
				});
// 				promises.push(last);
// 				return VueCompiler.sequence(promises, ctx);
			});
		},

		assemble: function (text, base) {
			let srcs = VueCompiler.regexp.src.findAll(text, true);

			return srcs.reduce(function (promise, src) {
				return promise.then(function (text) {
					let url = base
						? VueCompiler.absolute(src[2], base)
						: src[2];
//					console.log('assemble', base, url, text);
					return fetch(url)
						.then(function (res) {
							return res.ok ? res.text() : null;
						})
						.then(function (cont) {
							return text.replace(src[0], '<' + src[1] + '>\n' + (cont || '') + '\n</' + src[1] + '>');
						});
				});
			}, Promise.resolve(text));
		},

		createApp(options, components, settings) {
			Object.assign(this.settings, settings);

			const VUE = typeof (Vue) == 'undefined'
				? settings.Vue && settings.Vue[Symbol.toStringTag] == 'Module'
					? { ...settings.Vue }
					: settings.Vue
				: Vue;

			var app = null;

			let plugins = Array.isArray(options.use) ? options.use : options.use ? [ options.use ] : [];
			if (VUE./*component*/version < '3.0') {
				plugins
					.map(plugin => Array.isArray(plugin) ? plugin : [plugin])
					.forEach(plugin => VUE.use(...plugin));

				if (components)
					this.import(components, { mixins: options && options.mixins || settings && settings.mixins, Vue: VUE });

				app = new VUE(options);
			} else if (VUE.defineAsyncComponent) {
				app = VUE.createApp(
					typeof (options.data) == 'function'
						? options
						: Object.assign({}, options, { data: function () { return options.data; } })
				);

				VUE.component = (name, component) => {
					throw new Error('component() deletetes in Vue 3.')
					let components = app && app._context && app._context.components || {};
					if (components[name])
						return name;

					if (typeof (component) == 'function')
						components[name] = VUE.defineAsyncComponent(component);
					else
						app.component(name, component);
					return name;
				};
				VUE.set = this.vue2.mixin.methods.$set;
				VUE.delete = this.vue2.mixin.methods.$delete;
				VUE.extend = () => console.error('extend() deleted in Vue 3.', arguments);
				VUE.directive = app.directive;//() => console.error('directive() deleted in Vue 3.', arguments);
				VUE.filter = () => console.error('filter() deleted in Vue 3.', arguments);
				VUE.use = () => app.use; //console.error('use() deleted in Vue 3.', arguments);
				VUE.mixin = () => app.mixin;//console.error('mixin() deleted in Vue 3.', arguments);
				VUE.compile = () => console.error('compile() deleted in Vue 3.', arguments);
				VUE.observable = () => console.error('observable() deleted in Vue 3.', arguments);

				plugins
					.map(plugin => Array.isArray(plugin) ? plugin : [plugin])
					.forEach(plugin => app.use(...plugin));

				app.import = this.import.bind(app);
				if (components)
					app.import(components, { mixins: options && options.mixins || settings && settings.mixins, Vue: VUE });

				if (options.el)
					app.mount(options.el);
			}

			return app;
		}
	};
}());

if (typeof (module) === 'object' && module && module.exports) {
	module.exports = VueCompiler;
}
