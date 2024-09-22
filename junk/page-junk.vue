<template>
	<table>
		<tbody>
		<tr>
			<td>
				<extends-js></extends-js>
			</td>
			<td>
				<extends-vue></extends-vue>
			</td>
		</tr>
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
			<td>
				<with-wrapper :if="true">
					<score-badge :value="50" />
				</with-wrapper>
			</td>
			<td>
				<with-wrapper :if="false">
					<score-badge :value="99" />
				</with-wrapper>
			</td>
			<td>
				<composition-api></composition-api>
			</td>
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
			<td>
			<form-input v-model="vInput">form-input:</form-input>
			</td>
			<td>
			<span>{{ vInput }}</span>
			</td>
		</tr>
		<tr>
			<td>
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
			</td>
			<td>
			<span>{{ vSelect }}</span>
			</td>
		</tr>
		<tr>
			<td>
			<form-check v-model="vCheck">
				form-check
			</form-check>
			</td>
			<td>
			<span>{{ vCheck }}</span>
			</td>
		</tr>
		<tr>
			<td>
			<form-radio-group v-model="vRadio" name="vRadioInline" :options="{ '1st': 'form-check 1', '2nd': 'form-check 2' }" inline>
				Inline
			</form-radio-group>
			<form-radio-group v-model="vRadio" name="vRadio" :options="{ '1st': 'form-check 1', '2nd': 'form-check 2' }">
				<template #option="{ option }">
					{{ option }} form-check
				</template>
			</form-radio-group>
			</td>
			<td>
			<span>{{ vRadio }}</span>
			</td>
		</tr>
		<tr>
			<td>
			<form-input type="file" @change="file">
				{{ 'Select file' }}
			</form-input>
			</td>
			<td>
			<span>{{ vFile }}</span>
			</td>
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
	</tbody>
	</table>
</template>

<script src="page-junk.js" />
