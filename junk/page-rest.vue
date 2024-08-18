<template>
	<span>
		<form action="/core/api/import" methods="post" @submit.prevent="submit">
            <div class="form-row row">
				<form-select id="inputState" v-model="method" col="auto">
					<template #options>
						<option selected>GET</option>
						<option>POST</option>
					</template>
				</form-select>
				<form-input placeholder="URL" v-model="url" col />
                <div class="col-auto text-right">
					<btn @click.prevent="submit">
                        {{ $loc('Request') }}
                    </btn>
                </div>
            </div>

            <form-row>
                <form-textarea col v-model="body" id="body" name="body" placeholder="Body" cols="30" rows="36" spellcheck="false" />
                <form-textarea col v-model="response" id="response" name="response" placeholder="Response" cols="30" rows="36" spellcheck="false" />
            </form-row>
        </form>
    </span>
</template>

<script>
const get_cookie = (key) => {
	if (!key) { return; }

	const reg = new RegExp(`${ key.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&') }=(.*?)(?:;|$)`);
	const res = reg.exec(document.cookie);
	return res && res.length > 1 ? res[1] : null;
};

const set_cookie = (key, val, opt) => {
	if (typeof (opt) !== 'object') {
		opt = {
			...(typeof (opt) === 'number'
				? { 'max-age': opt }
				: { expires: opt }),
			secure: document.location.protocol === 'https:',
			httpOnly: false
		};
	}
	// new browser API // https://developer.mozilla.org/en-US/docs/Web/API/CookieStore
	// eslint-disable-next-line no-constant-condition
	if (window.cookieStore && false) { // Doesn't work in Chrome!
		return window.cookieStore.set(Object.fromEntries(Object.entries(opt).reduce((p, c) => c ? [ ...p, c ] : p, [ [ 'name', key ], [ 'value', val ] ])));
		// console.log('set_cookie', document.cookie, opt, document.location.protocol);
	} else { // old API
		const cookie = key + '=' + (val != null ? val : '') +// + '; secure; HttpOnly' + (expires ? '; expires=' + expires : '');
			(opt
				? Object.keys(opt).reduce((o, k) => {
					const v = opt[k];
					if (!v) { return o; }
					o += ';' + k + '=' + v;
					return o;
				}, '')
				: '');
		// eslint-disable-next-line unicorn/no-document-cookie
		document.cookie = cookie;
		// console.log('set_cookie', cookie, opt, document.location.protocol);
	}
};

export default {
    data() {
		return {
            method: get_cookie('rest:method') || 'GET',
            url: get_cookie('rest:url') || '/core/diag',
            body: get_cookie('rest:body'),
            response: null
		};
	},
	methods: {
		$loc() {
			return [...arguments].join(' ');
		},

		submit() {
			var data = this.body;
			var type = 'text/plain';
			try {
				data = JSON.stringify(Function('return ' + this.body)())//JSON.stringify(JSON.parse(this.body));
				type = 'application/json'
			} catch { }

			this.response = '';

			let body = this.method == 'POST'
				? data
				: undefined;
			let opts = {
				method: this.method,
//				mode: 'no-cors',
				headers: {
					'Content-Type': type
				},
				body
			};
			set_cookie('rest:method', this.method);
			set_cookie('rest:url', this.url);
			set_cookie('rest:body', body);
			// console.log('fetch', this.url, /*body,*/ opts);
			fetch(this.url, /*body,*/ opts).then((res) => {
				return (res.headers.get('Content-Type') || '').includes('json')
					? res.json()
					: (res.headers.get('Content-Disposition') || '').includes('attachment')
						? res.blob().then((blob) => {
							let a = document.createElement("a");

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
							? res.formData().then((form) => Promise.all([...form.entries()].map(arr => arr[1].name ? arr[1].text().then(text => ({ name: arr[0], value: { name: arr[1].name, text } })) : { name: arr[0], value: arr[1] })).then(all => [res.headers.get('Content-Type'), ...all]))
							: res.text();
			}).then((data) => {
//				console.log('$req', data);

				if (data instanceof Element) {
					data.click();
					window.URL.revokeObjectURL(data.href);
					this.response = data.download;

					return;
				}

				this.response = data instanceof Object ? JSON.stringify(data, undefined, 4) : data
			}).catch((err) => {
				console.error(err);
			});
        }
    }
}
</script>

