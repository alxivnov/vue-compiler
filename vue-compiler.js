let VueCompiler = (function () {
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
		regexp: {
			name: regexp('[^\\d\\w-]', 'g'),
			slot: regexp('_t\\("([^"]+?)"\\)', 'g'),
			src: regexp('<(template|script)[ ]*src=(?:\'|"|`)([^\'"`]*)(?:\'|"|`).*>', 'gs'),
			template: regexp('<template([^>]*)>(.*)<\/template>', 'gs'),
			script: regexp('<script([^>]*)>(.*?)(?:export\\s+default|module.exports\\s+=)\\s+(.*)<\/script>', 'gs'),
			export: regexp('(.*?)(?:export\\s+default|module.exports\\s+=)\\s+(.*)', 'gms'),
			import: regexp('(?:^)\\s*import(?:\\s+([^\'"`].*?)\\s+from\\s+|\\s+)(?:\'|"|`)(.*?)(?:\'|"|`);?', 'gms'),//|\\r\\n
			absolute: regexp('(\\(.*\\).*\\=\\>.*)import\\(([^())]+)\\)', 'g'),//regexp('\\bimport\\(([^())]+)\\)', 'g'),

			scopedSlot: regexp('_t\\("([^"]+?)",(.*)(?:,{(.*?)}\\)|([^}]\\)))', 'g'),

			tsType: regexp('type\\s+(\\S+)\\s*=.*(?:;|$)', 'gm'),
			tsInterface: regexp('interface\\s+(\\S+)\\s*{.*?}(?:;|$)', 'gms'),
			tsGeneric: regexp('function\\s+\\S+<(\\S+)>\\s*', 'gm'),

			metacharacters: regexp('([\\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)\\[\\{]{1})', 'gm')
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
				fn = fn.replace(prev, curr);
			}

			return fn;
		},

		global: {},

	import: function (components, mixins) {
		if (typeof (components) == 'string')
			components = [components];

		if (Array.isArray(components))
			components = components.reduce(function (prev, curr) {
				let name = curr
					.split('/')
					.slice(-1)[0]
					.split('.')
					.slice(0, -1)
					.map(function (el) {
						return el.replace(VueCompiler.regexp.name, '-');
					})
					.join('-');
				prev[name] = curr;
				return prev;
			}, {});

			let component = this.component;
			Object.keys(components).forEach(function (name) {

			/*
const test = Vue.defineAsyncComponent(() => new Promise((resolve, reject) => {
	resolve({
		template: '<h1>TEST</h1>'
	});
}));
			*/

				let url = VueCompiler.absolute(components[name], document.baseURI);
				let def = VueCompiler.download(components[name], mixins);
				if (name.startsWith('Base'))
					def.then(function (def) {
						VueCompiler.global[url] = def;
					}).catch(function (err) {
						delete VueCompiler.global[url];
					});

				if (Vue.defineAsyncComponent)
					component(name, Vue.defineAsyncComponent(function () { return def; }));
				else if (Vue.component)
					Vue.component(name, function (resolve, reject) {
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

		download: function (url, mixins) {
			let absoluteURL = VueCompiler.absolute(url, document.baseURI);

//			console.log('download', absoluteURL);
			if (VueCompiler.settings.cache && VueCompiler.cache[absoluteURL])
				return new Promise(function (resolve, reject) {
//					console.log('cache', absoluteURL);

					resolve(VueCompiler.cache[absoluteURL].temp);
				});

			return fetch(url)
				.then(function (res) { return res.ok ? res.text() : null })
				.then(function (text) {
					return VueCompiler.assemble(text, absoluteURL).then(function (text) {
						var template = VueCompiler.regexp.template.find(text, true);
						var script = VueCompiler.regexp.script.find(text, true);
						script = !!script && script.length > 3 ? { attr: script[1], init: script[2], main: script[3] } : null;
						//
//						console.log('vue_component_definition', url, template, script);
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

						let asyncImps = [];
						let syncImps = [];
						imps.forEach(function (imp) {
							if (VueCompiler.settings.async && imp[2].search(VueCompiler.settings.async) > -1)
								asyncImps.push(imp);
							else
								syncImps.push(imp);
						});

						let ctx = { defs: {}, mixins, ver: Vue.component ? 2 : Vue.defineAsyncComponent ? 3 : 0 };
						if (hasScript) {
							var replaceValue = 'VueCompiler.download(VueCompiler.absolute($2, \'' + absoluteURL + '\'), context.mixins)';

							if (ctx.ver == 3)
								replaceValue = 'Vue.defineAsyncComponent(function () { return ' + replaceValue + '; })';
							else
								replaceValue = '$1' + replaceValue;

							ctx.init = script.init.replace(VueCompiler.regexp.absolute, replaceValue);
							ctx.main = script.main.replace(VueCompiler.regexp.absolute, replaceValue);

							asyncImps.forEach(function (imp) {
								let asyncURL = VueCompiler.absolute(imp[2], absoluteURL);
								var asyncReplace = 'function () { return VueCompiler.download(\'' + asyncURL + '\', context.mixins); }';
								if (ctx.ver == 3)
									asyncReplace = 'Vue.defineAsyncComponent(' + asyncReplace + ')';
								asyncReplace = 'VueCompiler.global[\'' + asyncURL + '\'] || ' + asyncReplace;

								ctx.init = ctx.init.replace(imp[0], 'const ' + imp[1] + ' = ' + asyncReplace + ';');
							});
						}
						//
//						console.log('imps', absoluteURL, imps, ctx.init);
						let last = function (context) {
							return new Promise(function (resolve, reject) {
								//
//								console.log(/*'js', url,*/ js/*, script*/, context);
								let name = absoluteURL.split('/').slice(-1)[0] || 'VueCompiler.js';
								let func = context.main
									? '"use strict";' + (context.init || '') + 'return(' + (context.main.replace(/[\s;]+$/, '') || '{}') + ')'
									: null;
								try {
//									let func = '(function(){' + context.init + 'return ' + context.main + '})';
//									let temp = context.main ? eval(func + '//# sourceURL=' + name)() : {};
									var temp = func
										? Function('context', func + '//# sourceURL=' + name)(context)
										: {};
									if (hasTemplate) {
//										temp.template = template[2];
										temp.functional = template[1].includes('functional');

										let html = template[2];
										if (context.ver == 3) {
											temp.template = temp.functional
												? html
//													.replace('v-bind="data.attrs"', 'v-bind="this.$attrs"')
													.replace('listeners', '{}')
													.replace(/data\.attrs/g, 'this.$attrs')
													.replace(/data\./g, 'this.$data.')
													.replace(/props\./g, 'this.')
													.replace(/slots\(\)/g, 'this.$slots')
												: html;
										} else {
											if (temp.functional) {
												if (temp.computed)
													Object.keys(temp.computed).forEach(key => {
														let func = temp.computed[key].toString();
														html = html.replace(regexp(key, 'gm'), (func.startsWith('function') ? '(' : '(function ') + func + ')()');
													});

												let res = Vue.compile(html);
												let fn = VueCompiler.scopedSlot(res.render.toString()
													.replace('anonymous(', '(_h, _vm')
													.replace('with(this)', 'with(_vm)')
													.replace(VueCompiler.regexp.slot, 'slots()["$1"]'));

//												temp.render = eval('(' + fn + ')' + '//# sourceURL=' + name + '.js');
												temp.render = Function('_h', '_vm', fn.substring(fn.indexOf('{') + 1, fn.lastIndexOf('}') - 1) + '//# sourceURL=' + name + '.js');
												temp.staticRenderFns = res.staticRenderFns;
//												delete temp.template;
											} else {
												temp.template = html;
											}
										}

										temp.mixins = context.mixins;
									}

									if (VueCompiler.settings.cache) {
										VueCompiler.cache[absoluteURL] = {
											temp: temp,
											time: new Date()
										};

//										console.log('cached', absoluteURL);
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
						let promises = syncImps.filter(function (imp) {
							return imp.length > 2;
						}).map(function (imp) {
							return function (context) {
								let impURL = VueCompiler.absolute(imp[2], absoluteURL);
								return VueCompiler.download(impURL, context.mixins).then(function (def) {
									if (def instanceof Object || def == null) {
										context.defs[impURL] = def;
										let name = imp[1] || imp[2]
											.split('/')
											.slice(-1)[0]
											.split('.')
											.slice(0, -1)[0]
											.split('-')
											.map(function (s, i) {
												return /*i > 0 ?*/ s.slice(0, 1).toUpperCase() + s.slice(1) /*: s*/;
											})
											.join('');
										//
//										console.log('def', imp, name, def);
										def = 'let ' + name + ' = context.defs[\'' + impURL + '\'];';
									}

									context.init = context.init.replace(imp[0], def);

									return context;
								});
							};
						});
						promises.push(last);
						return VueCompiler.sequence(promises, ctx);
					});
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
						.then(function (res) { return res.ok ? res.text() : null; })
						.then(function (cont) {
							return text.replace(src[0], '<' + src[1] + '>\r\n' + (cont || '') + '\r\n</' + src[1] + '>');
						});
				});
			}, Promise.resolve(text));
		},

		createApp(options, components, settings) {
			Object.assign(this.settings, settings);

			var app = null;

			if (Vue.component) {
				if (components)
					this.import(components, settings && settings.mixin);

				app = new Vue(options);
			} else if (Vue.defineAsyncComponent) {
				app = Vue.createApp(
					typeof (options.data) == 'function'
						? options
						: Object.assign({}, options, { data: function () { return options.data; } })
				);

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
