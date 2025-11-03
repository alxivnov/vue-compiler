<template>
	<uni-form
		v-model="data"
		:fields="fields"
		_class="font-monospace"
		_data-bs-theme="$theme"
	></uni-form>
</template>

<script>
// import UniForm from './uni-form.vue';
// const UniForm = import('./uni-form.vue');

const Send = function (data) {
	var { method, url, reqBody: body } = data;
	var type = 'text/plain';
	try {
		let js = Function('return ' + body)();
		if (typeof (js) != 'number') {
			body = JSON.stringify(js);
			type = 'application/json';
		}
	} catch { }

	if (typeof (set_cookie) == 'function') {
		this.$setCookie('rest:method', method);
		this.$setCookie('rest:url', url);
		if (!url?.includes('/crypto/') && !url?.includes('/query/') && !url?.endsWith('/query') && !body?.includes('postgresql://')) {
			this.$setCookie('rest:body', body);
		}
	}

	data['reqHeaders'] = '';
	data['resHeaders'] = '';
	data['resBody'] = '';

		let headers = {
			'Content-Type': type
		};
		let opt = {
			// _raw: true,

			method,
			//				mode: 'no-cors',
			headers,
			body: method == 'POST'
				? body
				: undefined
		};

		console.log('fetch', url, opt, this.$req, data)
	let req = typeof (this.$req) == 'function'
		? this.$req(url, method == 'POST' ? body : undefined, { ...opt, _raw: true })
		: Promise.resolve(new Request(url, opt));
	return req.then((req) => {
		data.reqHeaders = [...req.headers.entries()
			.filter(([field, value]) => value !== undefined)
			.map(([field, value]) => `${field}: ${value}`)]
			.join('\n');

		// console.log('fetch', url, req);

		return fetch(req);
	}).then((res) => {
		// console.log('fetch: headers', res.headers.get('Content-Type'));

		data.resHeaders = [...res.headers.entries()
			.map(([field, value]) => `${field}: ${value}`)]
			.join('\n');

		return (res.headers.get('Content-Type') || '').includes('json')
			? res.json()
			: (res.headers.get('Content-Disposition') || '').includes('attachment')
				? res.blob().then((blob) => {
					let a = document.createElement('a');

					let file = window.URL.createObjectURL(blob);
					let dist = res.headers.get('Content-Disposition')
						.split(';')
						.reduce((prev, curr) => {
							let arr = curr.split('=');
							prev[arr[0].trim()] = arr[1] && (arr[1].startsWith('"') && arr[1].endsWith('"') && arr[1].substring(1, arr[1].length - 1)) || arr[1];
							return prev;
						}, {});

					a.href = file;
					a.download = dist.filename;

					return a;
				})
				: (res.headers.get('Content-Type') || '').includes('form')
					? res.formData()
						.then((form) => Promise.all([
							...form.entries()
						].map(arr => arr[1].name
							? arr[1].text().then(text => ({
								name: arr[0],
								value: {
									name: arr[1].name,
									text
								}
							}))
							: {
								name: arr[0],
								value: arr[1]
							}))
							.then(all => [
								res.headers.get('Content-Type'),
								...all
							]))
					: res.text();
	}).then((body) => {
		// console.log('fetch: body', body);

		if (body instanceof Element) {
			body.click();
			window.URL.revokeObjectURL(body.href);
			data.resBody = body.download;

			return;
		}

		data.resBody = body instanceof Object
			? JSON.stringify(body, undefined, 4)
			: body;
	}).catch((err) => {
		console.error(err);
	});
};

const fields = [									// TODO: Remove Quasar's padding from fieldset
	{												// TDOD: {row/col} + horizontal/inline/no-label
		method: {
			options: [
				'GET',
				'POST'
			],
			$label: false,
			$col: 'auto',
		},
		url: {
			$default: '/',
			$label: false,
			// $col: true,
		},
		Send
	},
	{
		reqBody: {
			type: 'string',
			$label: false,
			$rows: 25,								// TODO: h-100
		},
		resBody: {
			type: 'string',
			$label: false,
			$readonly: true,
			$rows: 25,
		}
	},
	{
		reqHeaders: {
			type: 'string',
			$label: false,
			$readonly: true,
			$rows: 5,

		},
		resHeaders: {
			type: 'string',
			$label: false,
			$readonly: true,
			$rows: 5,
		}
	}
];

export default {
	components: {
		UniForm: typeof (UniForm) == 'undefined'
			? Vue.defineAsyncComponent(() => import('../uni-form.vue'))
			: UniForm
	},
	data() {
		return {
			data: typeof (get_cookie) == 'function'
				? {
					method: this.$getCookie('rest:method') || 'GET',
					url: this.$getCookie('rest:url') || '/core/diag',
					reqBody: this.$getCookie('rest:body'),
					resBody: ''
				}
				: {
					method: 'GET',
					url: '/diag',
					reqBody: '',
					resBody: ''
				},
			fields
		};
	}
};
</script>
