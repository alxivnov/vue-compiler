// https://vuejs.org/v2/guide/render-function.html#Functional-Components
// https://v3.vuejs.org/guide/migration/introduction.html#breaking-changes
const VueCompiler = (function () {
	function regexp(pattern, flags) {
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
		while (reg = this.exec(string))
			regs.push(reg);

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

	return {
		Vue: typeof (Vue) == 'undefined' ? undefined : Vue,

		regexp: {
			name: regexp('[^\\d\\w-]', 'g'),
			slot: regexp('_t\\("([^"]+?)"\\)', 'g'),
			src: regexp('<(template|script)[ ]*src=(?:\'|"|`)([^\'"`]*)(?:\'|"|`).*>', 'gs'),
			template: regexp('<template([^>]*)>(.*)<\/template>', 'gs'),
			script: regexp('<script([^>]*)>(.*?)(export\\s+default|module\.exports\\s+=|import\\s+([\\w\\s{},]+)\\s+from\\s+\'vue\')\\s+(.*)<\/script>', 'gs'),
			export: regexp('(.*?)(?:export\\s+default|module.exports\\s+=)\\s+(.*)', 'gms'),
			import: regexp('(?:^)\\s*(?:await\s+)?import(?:\\s+([^\'"`].*?)\\s+from\\s+|\\s+)(?:\'|"|`)(.*?)(?:\'|"|`);?', 'gms'),//|\\r\\n
//			awaitimport: regexp('(?:^)\\s*const\\s+([^\'"`].*?)\\s*=\\s*await\\s+import\\(\\s*(?:\'|"|`)(.*?)(?:\'|"|`)\\s*\\);?', 'gms'),//|\\r\\n
			absolute: regexp('(\\([^()=>]*\\)\\s*\\=\\>\\s*)import\\(([^())]+)\\)', 'g'),//regexp('\\bimport\\(([^())]+)\\)', 'g'),

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
			createElement(type, props, children) {
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
				return VueCompiler.Vue.h(type, vue3, children);
			},
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
						target[propertyName] = value;
					},
					$delete: (target, propertyName) => {
						delete target[propertyName];
					},
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

	import: function (components, mixins) {
		if (typeof (components) == 'string')
			components = [components];

		if (Array.isArray(components))
			components = components.reduce(function (prev, curr) {
				let name = VueCompiler.componentName(curr);
				prev[name] = curr;
				return prev;
			}, {});

			let component = this.component;
			Object.keys(components).forEach(function (name) {

			/*
const test = VueCompiler.Vue.defineAsyncComponent(() => new Promise((resolve, reject) => {
	resolve({
		template: '<h1>TEST</h1>'
	});
}));
			*/

				let url = VueCompiler.absolute(components[name], document.baseURI);

				let comp = function (name, url, def) {
				if (name.startsWith('Base'))
					def.then(function (def) {
						VueCompiler.global[url] = def;
					}).catch(function (err) {
						delete VueCompiler.global[url];
					});

				if (VueCompiler.Vue/*component*/.version < '3.0')
					VueCompiler.Vue.component(name, function (resolve, reject) {
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
				else if (VueCompiler.Vue.defineAsyncComponent)
					component(name, VueCompiler.Vue.defineAsyncComponent(function () { return def; }));
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
											return VueCompiler.template(absoluteURL, text, mixins);
										});
									comp(name, absoluteURL, def);
								});
					});
				} else {
					let def = VueCompiler.download(components[name], mixins);

					comp(name, url, def);
				}
			});
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

		download: function (url, mixins, thisArg = this) {
			let absoluteURL = VueCompiler.absolute(url, document.baseURI);

//			console.log('download', absoluteURL);
			if (VueCompiler.settings.cache && VueCompiler.cache[absoluteURL])
				return new Promise(function (resolve, reject) {
//					console.log('cache', absoluteURL);

					resolve(VueCompiler.cache[absoluteURL].temp);
				});

			return fetch(url)
				.then(function (res) {
					return res.ok ? res.text() : null;
				})
				.then(function (text) {
					return VueCompiler.template(absoluteURL, text, mixins, thisArg);
				});
		},

		template: function (absoluteURL, text, mixins, thisArg = this) {
			return VueCompiler.assemble(text, absoluteURL).then(function (text) {
				let isHTML = /^\s*</.test(text);
				var template = isHTML && VueCompiler.regexp.template.find(text, true);
				var script = isHTML && VueCompiler.regexp.script.find(text, true);
				script = !!script && script.length > 3 ? { attr: script[1], init: script[2], comp: script[4], main: script[5] } : null;
				//
//				console.log('vue_component_definition', url, template, script);
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

				if (!hasTemplate && !hasScript) {
					let json = JSON.tryParse(text);

					return json === undefined ? text ? { template: '<span>' + text + '</span>' } : null : json;//text;
				}

				let imps = hasScript ? VueCompiler.regexp.import.findAll(script.init, true) : [];
//				if (hasScript && imps.length === 0)
//					imps = VueCompiler.regexp.awaitimport.findAll(script.init, true);

				let asyncImps = [];
				let syncImps = [];
				imps.forEach(function (imp) {
					if (VueCompiler.settings.async && imp[2].search(VueCompiler.settings.async) > -1)
						asyncImps.push(imp);
					else
						syncImps.push(imp);
				});
				// TODO: extends
				// if (imps.some(imp => imp[0].includes('/core/vue/base-dashboard-widget')) || asyncImps.length) {
				// 	console.log(VueCompiler.settings.async, /*imps, */asyncImps/*, syncImps*/);
				// }

				let ver = VueCompiler.Vue./*component*/version < '3.0'
					? 2
					: VueCompiler.Vue.defineAsyncComponent
						? 3
						: 0;
				let ctx = {
					defs: {},
					mixins: ver == 3
						? [
							VueCompiler.vue2.mixin,
							...(mixins || []),
						]
						: mixins,
					ver,
					thisArg
				};
				if (hasScript) {
					var replaceValue = 'VueCompiler.download(VueCompiler.absolute($2, \'' + absoluteURL + '\'), context.mixins, context.thisArg)';

					// if (ctx.ver == 3)
					// 	replaceValue = 'VueCompiler.Vue.defineAsyncComponent(function () { return ' + replaceValue + '; })';
					// else
						replaceValue = '$1' + replaceValue;

					ctx.init = script.init.replace(VueCompiler.regexp.absolute, replaceValue);
					ctx.main = script.main.replace(VueCompiler.regexp.absolute, replaceValue);
					ctx.attr = script.attr;
					ctx.comp = script.comp;

					if (ctx.ver == 3)
						ctx.main = ctx.main.replace(/\$emit\('input',/g, `$emit('update:modelValue',`);

					asyncImps.forEach(function (imp) {
						let asyncURL = VueCompiler.absolute(imp[2], absoluteURL);
						var asyncReplace = 'function () {'
							// + 'try {'
							+ 'return VueCompiler.download(\''
							+ asyncURL
							+ '\', context.mixins, context.thisArg);'
							// + ' } catch (err) { console.log("'
							// + asyncURL
							// + '", err); throw err; }'
							+ '}';
						if (ctx.ver == 3)
							asyncReplace = 'VueCompiler.Vue.defineAsyncComponent(' + asyncReplace + ')';
						asyncReplace = 'VueCompiler.global[\'' + asyncURL + '\'] || ' + asyncReplace;

						ctx.init = ctx.init.replace(imp[0], 'const ' + imp[1] + ' = ' + asyncReplace + ';');
						// TDOD: extends
						// if (imp[0].includes('/core/vue/base-dashboard-widget')) {
						// 	console.log('asyncImps', 'const ' + imp[1] + ' = ' + asyncReplace + ';');
						// }
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
							? '\nconst ' + (context.comp || 'Vue') + ' = VueCompiler.Vue;'
							: '';
						let name = VueCompiler.componentName(absoluteURL) || 'VueCompiler.js';
						var func = context.main
							? '"use strict";'
								// + '\ntry {'
								+ esm
								+ (context.init || '')
								+ 'return('
								+ (setup
									? '{setup(){\n' + '\nconst ' + (context.comp || 'Vue') + ' = VueCompiler.Vue;'
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
						// if (name == 'page-test') {
						// 	console.log('comp', name, absoluteURL, func);
						// }
						try {
//							let func = '(function(){' + context.init + 'return ' + context.main + '})';
//							let temp = context.main ? eval(func + '//# sourceURL=' + name)() : {};
							var temp = func
								? Function('context', func + '//# sourceURL=' + name).call(context.thisArg, context)
								: {};
							if (hasTemplate) {
//								temp.template = template[2];
								temp.functional = template[1].includes('functional');

								let html = template[2];
								if (context.ver == 3) {
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
											.replace(/\$scopedSlots(.(\w+)|\[.+])/g, '$slots$1');
									temp.template = temp.template
										.replace(/@hook:(\w+)="/g, '@vue:$1="')
										.replace(/:value="/g, ':model-value="')
										.replace(/<(input|textarea|select|option.+):model-value="/g, '<$1:value="')
										.replace(/@input="/g, '@update:model-value="')
										// .replace(/:value="(.+)"\s+@input="(.+)"/g, ':model-value="$1" @update:model-value="$2"')
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

										let res = VueCompiler.Vue.compile(html);
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

							if (context.ver == 3) {
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
											let to = VueCompiler.Vue.defineAsyncComponent(from);
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

							if (typeof (temp.data) == 'function')
								temp.data = VueCompiler.tryCall(temp.data, name);
							if (typeof (temp.mounted) == 'function')
								temp.mounted = VueCompiler.tryCall(temp.mounted, name);

							if (VueCompiler.settings.cache) {
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

							console.log('eval', err, name, func);

							reject(err);
						}
					});
				};
				let context = ctx;//
				let promises = syncImps.filter(function (imp) {
					return imp.length > 2;
				}).map(function (imp) {
//					return function (context) {
						let impURL = VueCompiler.absolute(imp[2], absoluteURL);
						return VueCompiler.download(impURL, context.mixins, context.thisArg).then(function (def) {
							if (def instanceof Object || def == null) {
								context.defs[impURL] = def;
								let name = imp[1] || VueCompiler.componentName(imp[2], true);
								//
//								console.log('def', imp, name, def);
								def = 'let ' + name + ' = context.defs[\'' + impURL + '\'];';
							}
							// TODO: extends
							// if (impURL.includes('/core/vue/base-dashboard-widget'))
							// 	console.log('imp', absoluteURL, impURL, def);

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

			this.Vue = typeof (Vue) == 'undefined'
				? settings.Vue && settings.Vue[Symbol.toStringTag] == 'Module'
					? { ...settings.Vue }
					: settings.Vue
				: Vue;

			var app = null;

			let plugins = Array.isArray(options.use) ? options.use : options.use ? [ options.use ] : [];
			if (this.Vue./*component*/version < '3.0') {
				plugins.forEach(plugin => this.Vue.use(plugin));

				if (components)
					this.import(components, settings && settings.mixin);

				app = new this.Vue(options);
			} else if (this.Vue.defineAsyncComponent) {
				app = this.Vue.createApp(
					typeof (options.data) == 'function'
						? options
						: Object.assign({}, options, { data: function () { return options.data; } })
				);

				this.Vue.component = (name, component) => {
					let components = app && app._context && app._context.components || {};
					if (components[name])
						return name;

					if (typeof (component) == 'function')
						components[name] = this.Vue.defineAsyncComponent(component);
					else
						app.component(name, component);
					return name;
				};
				this.Vue.set = this.vue2.mixin.methods.$set;
				this.Vue.delete = this.vue2.mixin.methods.$delete;
				this.Vue.extend = () => console.error('extend() deleted in Vue 3.', arguments);
				this.Vue.directive = app.directive;//() => console.error('directive() deleted in Vue 3.', arguments);
				this.Vue.filter = () => console.error('filter() deleted in Vue 3.', arguments);
				this.Vue.use = () => app.use; //console.error('use() deleted in Vue 3.', arguments);
				this.Vue.mixin = () => app.mixin;//console.error('mixin() deleted in Vue 3.', arguments);
				this.Vue.compile = () => console.error('compile() deleted in Vue 3.', arguments);
				this.Vue.observable = () => console.error('observable() deleted in Vue 3.', arguments);

				plugins.forEach(plugin => app.use(plugin));

				app.import = this.import.bind(app);
				if (components)
					app.import(components, settings && settings.mixin);

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
