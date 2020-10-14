<template>
	<table>
		<tr>
			<btn @click.prevent="click">btn</btn>
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
			<form-select v-model="vSelect" :options="[ '5th', '6th', '7th' ]">
				form-select:
				<template #options>
					<option>1st</option>
					<option>2nd</option>
					<option>3rd</option>
					<option>4th</option>
				</template>
				<template #option="{ option }">
					<option :value="option">
						{{ option }}
					</option>
				</template>
			</form-select>
			<span>{{ vSelect }}</span>
		</tr>
		<tr>
			<form-check v-model="vCheck">
				form-check:
			</form-check>
			<span>{{ vCheck }}</span>
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
