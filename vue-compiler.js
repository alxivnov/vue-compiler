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
			slot: regexp('_t\\("(.*?)"\\)', 'g'),
			src: regexp('<(template|script)[ ]*src=(?:\'|"|`)([^\'"`]*)(?:\'|"|`).*>', 'gs'),
			template: regexp('<template([^>]*)>(.*)<\/template>', 'gs'),
			script: regexp('<script[^>]*>(.*?)(?:export\\s+default|module.exports\\s+=)\\s+{(.*)}.*?<\/script>', 'gs'),
			export: regexp('(.*?)(?:export\\s+default|module.exports\\s+=)\\s+{(.*)}', 'gms'),
			import: regexp('(?:^|\\r\\n)\\s*import(?:\\s+([^\'"`].*?)\\s+from\\s+|\\s+)(?:\'|"|`)(.*?)(?:\'|"|`);?', 'gms'),
			absolute: regexp('\\bimport\\(([^())]+)\\)', 'g')
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

		download: function (url, mixins) {
			return fetch(url)
				.then(function (res) { return res.text() })
				.then(function (text) {
					return VueCompiler.assemble(text).then(function (text) {
						var template = VueCompiler.regexp.template.find(text, true);
						var script = VueCompiler.regexp.script.find(text, true);
						//
//						console.log('vue_component_definition', url, script);
						if (!template && !script)
							script = VueCompiler.regexp.export.find(text, true);

						let hasTemplate = !!template && template.length > 2;
						let hasScript = !!script && script.length > 2;

						if (!hasTemplate && !hasScript)
							return { template: '<span>' + text + '</span>' };//text;

						let absoluteURL = VueCompiler.absolute(url, document.baseURI);

						let imps = hasScript ? VueCompiler.regexp.import.findAll(script[1], true) : [];
						imps.push(null);
						let ctx = hasScript
							? {
								init: script[1].replace(VueCompiler.regexp.import, '').replace(VueCompiler.regexp.absolute, 'VueCompiler.download(VueCompiler.absolute($1, "' + absoluteURL + '"), mixins)'),
								main: script[2].replace(VueCompiler.regexp.absolute, 'VueCompiler.download(VueCompiler.absolute($1, "' + absoluteURL + '"), mixins)'),
								defs: [],
								js: ''
							}
							: {
								defs: [],
								js: ''
							};
						//
//						console.log('imps', imps, js);
						return imps.reduce(function (promise, imp) {
							return promise.then(function (context) {
								return imp == null
									? new Promise(function (resolve, reject) {
										let js = context.js != null ? context.js + context.init + '({' + context.main + '})' : '({})';
										//
//										console.log(/*'js', url,*/ js/*, script*/);
										try {
											let temp = eval(js);
											if (hasTemplate) {
												temp.template = template[2];
												temp.functional = template[1].includes('functional');

												if (temp.functional) {
													let res = Vue.compile(temp.template);
													let fn = res.render.toString()
														.replace('anonymous(', '(_h, _vm')
														.replace('with(this)', 'with(_vm)')
														.replace(VueCompiler.regexp.slot, 'slots().$1');
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
									})
									: imp.length > 2
										? VueCompiler.download(VueCompiler.absolute(imp[2], absoluteURL), mixins).then(function (def) {
											if (def instanceof Object) {
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
//												console.log('def', imp, name);
												context.js += 'let ' + name + ' = context.defs[\'' + imp[2] + '\'];\r\n';
											} else {
												context.js += def + '\r\n';
											}

											return context;
										})
										: Promise.resolve(context);
							});
						}, Promise.resolve(ctx));
					});
				});
		},

		assemble: function (text) {
			let srcs = VueCompiler.regexp.src.findAll(text, true);

			return srcs.reduce(function (promise, src) {
				return promise.then(function (text) {
					return fetch(src[2])
						.then(function (res) { return res.text(); })
						.then(function (cont) {
							return text.replace(src[0], '<' + src[1] + '>\r\n' + cont + '\r\n</' + src[1] + '>');
						});
				});
			}, Promise.resolve(text));
		}
	};
}());
