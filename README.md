# Vue Compiler
Script that enables usage of Vue.js Single File Components directly in browser. https://alxivnov.github.io/vue-compiler/

```shell
docker run \
	--log-driver local \
	--name vue-compiler-9999 \
	--publish=9999:8000 \
	--volume ~/Documents/vue-compiler:/usr/src/app \
	--workdir /usr/src/app \
	--detach \
	--interactive \
	--tty \
	php:5.6.40-alpine \
	php -S 0.0.0.0:8000
```