function vue_import_components(components) {
	if (typeof (components) == 'string')
		components = [components];
	
	if (Array.isArray)
		components = components.reduce(function (prev, curr) {
			let name = curr
				.split('/')
				.slice(-1)[0]
				.split('.')
				.slice(0, -1)
				.map(function (el) {
					return el.replace(/[^\d\w-]/, '-');
				})
				.join('-');
			prev[name] = curr;
			return prev;
		}, {});
	
	Object.keys(components).forEach(function (name) {
		Vue.component(name, function (resolve, reject) {
			fetch(components[name])
				.then(res => res.text())
				.then(text => {
					let template = /<template([^>]*)>[\s]*(.*)<\/template>/gs.exec(text);
					let script = /<script[^>]*>[^}]*export[\s]*default[\s]*{[\s]*(.*)}[\s]*<\/script>/gs.exec(text);
			
					if (!template || template.length < 3)
						return;
					
					let temp = script && script.length > 1 ? eval('({' + script[1] + '})') : {};
					if (template && template.length > 2) {
						temp.template = template[2];
						temp.functional = template[1].includes('functional');
					}

					if (temp.functional) {
						let res = Vue.compile(temp.template);
						let fn = res.render.toString()
							.replace('anonymous(', '(_h, _vm')
							.replace('with(this)', 'with(_vm)')
							.replace(/_t\("(.*?)"\)/g, 'slots().$1');
						temp.render = eval('(' + fn + ')');
						temp.staticRenderFns = res.staticRenderFns;
						delete temp.template;
					}

					resolve(temp);
				})
				.catch(function (err) {
					console.log(err);
					reject(err);
				});
		});
	});
}
