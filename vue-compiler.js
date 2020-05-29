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

	return {
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
				Vue.component(name, function (resolve, reject) {
					VueCompiler.download(components[name], mixins)
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

						if (!hasTemplate && !hasScript)
							return text ? { template: '<span>' + text + '</span>' } : null;//text;

						let absoluteURL = VueCompiler.absolute(url, document.baseURI);

						let imps = hasScript ? VueCompiler.regexp.import.findAll(script[1], true) : [];
						let ctx = hasScript
							? {
								init: script[1].replace(VueCompiler.regexp.absolute, 'VueCompiler.download(VueCompiler.absolute($1, "' + absoluteURL + '"), mixins)'),
								main: script[2].replace(VueCompiler.regexp.absolute, 'VueCompiler.download(VueCompiler.absolute($1, "' + absoluteURL + '"), mixins)'),
								defs: {}
							}
							: {
								defs: {}
							};
						//
//						console.log('imps', imps);
						let last = function (context) {
							return new Promise(function (resolve, reject) {
								let js = context.main ? '(function(){' + context.init + '\r\nreturn ' + context.main + '}())' : '({})';
								//
//								console.log(/*'js', url,*/ js/*, script*/, context);
								try {
									let name = absoluteURL.split('/').slice(-1)[0] || 'VueCompiler.js';
									let temp = eval(js + '//# sourceURL=' + name);
									if (hasTemplate) {
										temp.template = template[2];
										temp.functional = template[1].includes('functional');

										if (temp.functional) {
											let res = Vue.compile(temp.template);
											let fn = VueCompiler.scopedSlot(res.render.toString()
												.replace('anonymous(', '(_h, _vm')
												.replace('with(this)', 'with(_vm)')
												.replace(VueCompiler.regexp.slot, 'slots()["$1"]'));

											temp.render = eval('(' + fn + ')');
											temp.staticRenderFns = res.staticRenderFns;
											delete temp.template;
										}

										temp.mixins = mixins;
									}

									resolve(temp);
								} catch (err) {
									err.js = js;

									console.log('eval', err, err.lineNumber, js);

									reject(err);
								}
							});
						};
						let promises = imps.filter(function (imp) {
							return imp.length > 2;
						}).map(function (imp) {
							return function (context) {
								return VueCompiler.download(VueCompiler.absolute(imp[2], absoluteURL), mixins).then(function (def) {
									if (def instanceof Object || def == null) {
										context.defs[imp[2]] = def;
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
										def = 'let ' + name + ' = context.defs[\'' + imp[2] + '\'];';
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
