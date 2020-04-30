<template>
	<form>
		<span v-for="key in Object.keys(controls || {})" :key="key">
			<form-select :id="key" :name="key" v-model="data[key]" :disabled="!controls[key].enabled" v-if="controls[key].options">
				{{ controls[key].label }}
				<template #options>
					<option v-for="val in controls[key].options" :key="val">{{ val }}</option>
				</template>
			</form-select>
			<img :id="key"
				:src="controls[key].model ? typeof (controls[key].model) == 'function' ? controls[key].model(data) : data[controls[key].model] : controls[key].default"
				:alt="controls[key].alt"
				:height="controls[key].height"
				:width="controls[key].width"
				v-else-if="controls[key].control == 'img'"
			>
			<form-input :id="key" :name="key" v-model="data[key]" :disabled="!controls[key].enabled" v-else-if="typeof (controls[key]) == 'object'">
				{{ controls[key].label }}
			</form-input>
		</span>

		<!-- {{ JSON.stringify(data) }} -->
	</form>
</template>

<script>
export default {
	props: {
		controls: Object
	},
	data() {
		return {
			data: null
		};
	},
	watch: {
		controls() {
			this.data = Object.keys(this.controls || {}).reduce((obj, key) => {
				obj[key] = typeof (this.controls[key]) == 'object' ? this.controls[key].default : this.controls[key];
				return obj;
			}, {});
		}
	}
}
</script>