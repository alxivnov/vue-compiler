<template>
	<table>
		<tr>
			<btn @click.prevent="click">btn</btn>

			<modal id="modal" title="Modal" scrollable centered fade @shown="shown" @hidden="hidden">
				<span>{{ vModal }}</span>

				<template #footer>
					<btn btn-style="secondary" data-dismiss="modal" data-bs-dismiss="modal">Close</btn>
				</template>
			</modal>
		</tr>
		<tr>
			<test />
		</tr>
		<tr>
			<import-from />
		</tr>
		<tr>
			<import-func />
		</tr>
		<tr>
			<form-input v-model="vInput">form-input:</form-input>
			<span>{{ vInput }}</span>
		</tr>
		<tr>
			<form-select v-model="vSelect" :options="{ '5th' : 'Fifth', '6th': 'Sixth', '7th': 'Seventh' }">
				form-select:
				<template #options>
					<option>1st</option>
					<option>2nd</option>
					<option>3rd</option>
					<option>4th</option>
				</template>
				<!-- <template #option="{ option }">
					<option :value="option">
						{{ option }}
					</option>
				</template> -->
			</form-select>
			<span>{{ vSelect }}</span>
		</tr>
		<tr>
			<form-check v-model="vCheck">
				form-check
			</form-check>
			<span>{{ vCheck }}</span>
		</tr>
		<tr>
			<form-radio-group v-model="vRadio" name="vRadioInline" :options="{ '1st': 'form-check 1', '2nd': 'form-check 2' }" inline>
				Inline
			</form-radio-group>
			<form-radio-group v-model="vRadio" name="vRadio" :options="{ '1st': 'form-check 1', '2nd': 'form-check 2' }">
				<template #option="{ option }">
					{{ option }} form-check
				</template>
			</form-radio-group>
			<span>{{ vRadio }}</span>
		</tr>
		<tr>
			<form-input type="file" @change="file">
				{{ 'Select file' }}
			</form-input>
			<span>{{ vFile }}</span>
		</tr>
		<tr>
			{{ expDef.text }}
		</tr>
		<tr>
			{{ modExp.text }}
		</tr>
		<tr>
			<some />
		</tr>
		<tr v-for="(obj, i) in truthy" :key="i">
			<td v-for="(val, j) in Object.values(obj)" :key="j">
				{{ val }}
			</td>
		</tr>
	</table>
</template>

<script src="page-junk.js" />
