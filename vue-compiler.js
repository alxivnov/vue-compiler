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

	return {
		app: null,

		regexp: {
			name: regexp('[^\\d\\w-]', 'g'),
			slot: regexp('_t\\("([^"]+?)"\\)', 'g'),
			src: regexp('<(template|script)[ ]*src=(?:\'|"|`)([^\'"`]*)(?:\'|"|`).*>', 'gs'),
			template: regexp('<template([^>]*)>(.*)<\/template>', 'gs'),
			script: regexp('<script[^>]*>(.*?)(?:export\\s+default|module.exports\\s+=)\\s+(.*)<\/script>', 'gs'),
			export: regexp('(.*?)(?:export\\s+default|module.exports\\s+=)\\s+(.*)', 'gms'),
			import: regexp('(?:^)\\s*import(?:\\s+([^\'"`].*?)\\s+from\\s+|\\s+)(?:\'|"|`)(.*?)(?:\'|"|`);?', 'gms'),//|\\r\\n
			absolute: regexp('\\bimport\\(([^())]+)\\)', 'g'),

			scopedSlot: regexp('_t\\("([^"]+?)",(.*),(.*?)\\)', 'g')
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
				let curr = prev.replace(VueCompiler.regexp.scopedSlot, '(scopedSlots["$1"] ? scopedSlots["$1"]($3) : $2)');
				fn = fn.replace(prev, curr);
			}

			return fn;
		},

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

			Object.keys(components).forEach(function (name) {
				let def = VueCompiler.download(components[name], mixins);

				if (VueCompiler.app)
//					VueCompiler.app.component(name, Vue.defineAsyncComponent(def));
					VueCompiler.app.component(name, Vue.defineAsyncComponent(() => new Promise((resolve, reject) => {
						def
							.then(function (def) {
								resolve(def);
							})
							.catch(function (err) {
								reject(err);
							});
					})));
				else
					Vue.component(name, function (resolve, reject) {
						return def
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

		download: function (url, mixins) {
			return fetch(url)
				.then(function (res) { return res.ok ? res.text() : null })
				.then(function (text) {
					return VueCompiler.assemble(text).then(function (text) {
						var template = VueCompiler.regexp.template.find(text, true);
						var script = VueCompiler.regexp.script.find(text, true);
						//
//						console.log('vue_component_definition', url, template, script);
						if (!template && !script)
							script = VueCompiler.regexp.export.find(text, true);

						let hasTemplate = !!template && template.length > 2;
						let hasScript = !!script && script.length > 2;

						if (!hasTemplate && !hasScript) {
							let json = JSON.tryParse(text);

							return json === undefined ? text ? { template: '<span>' + text + '</span>' } : null : json;//text;
						}

						let absoluteURL = VueCompiler.absolute(url, document.baseURI);

						let imps = hasScript ? VueCompiler.regexp.import.findAll(script[1], true) : [];
						let ctx = { defs: {}, mixins };
						if (hasScript) {
							ctx.init = script[1].replace(VueCompiler.regexp.absolute, 'VueCompiler.download(VueCompiler.absolute($1, "' + absoluteURL + '"), context.mixins)');
							ctx.main = script[2].replace(VueCompiler.regexp.absolute, 'VueCompiler.download(VueCompiler.absolute($1, "' + absoluteURL + '"), context.mixins)');
						}
						//
//						console.log('imps', imps);
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

										if (VueCompiler.app) {
											temp.template = temp.functional
												? template[2]
													.replace('v-bind="data.attrs"', 'v-bind="$attrs"')
													.replace('v-on="listeners"', '')
													.replace(/props\./g, 'this.')
													.replace(/slots\(\)/g, 'this.$slots')
													.replace(/data\./g, 'this.$data.')
												: template[2];
										} else {
											if (temp.functional) {
												let res = Vue.compile(template[2]);
												let fn = VueCompiler.scopedSlot(res.render.toString()
													.replace('anonymous(', '(_h, _vm')
													.replace('with(this)', 'with(_vm)')
													.replace(VueCompiler.regexp.slot, 'slots()["$1"]'));

//												temp.render = eval('(' + fn + ')' + '//# sourceURL=' + name + '.js');
												temp.render = Function('_h', '_vm', fn.substring(fn.indexOf('{') + 1, fn.lastIndexOf('}') - 1) + '//# sourceURL=' + name + '.js');
												temp.staticRenderFns = res.staticRenderFns;
//												delete temp.template;
											} else {
												temp.template = template[2];
											}
										}

										temp.mixins = context.mixins;
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
						let promises = imps.filter(function (imp) {
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
//										console.log('def', imp, name);
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

		assemble: function (text) {
			let srcs = VueCompiler.regexp.src.findAll(text, true);

			return srcs.reduce(function (promise, src) {
				return promise.then(function (text) {
					return fetch(src[2])
						.then(function (res) { return res.ok ? res.text() : null; })
						.then(function (cont) {
							return text.replace(src[0], '<' + src[1] + '>\r\n' + (cont || '') + '\r\n</' + src[1] + '>');
						});
				});
			}, Promise.resolve(text));
		}
	};
}());
