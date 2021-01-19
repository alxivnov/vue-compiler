<template>
	<div>
		<a href="https://github.com/alxivnov/vue-compiler/blob/master/page-card.vue" class="link">Source</a>

		<div id="grid" class="card-columns mt-3" :class="{ 'row': bs5 }">
			<div :class="{ 'col-4 mb-3': bs5 }">
				<card>
					<card-img :src="image" place="top"></card-img>
					<card-body :title="title" :text="text">
						<btn>{{ button }}</btn>
					</card-body>
				</card>
			</div>
			<div :class="{ 'col-4 mb-3': bs5 }">
				<card>
					<card-body>
						{{ body }}
					</card-body>
				</card>
			</div>
			<div :class="{ 'col-4 mb-3': bs5 }">
				<card>
					<card-body :title="title" :subtitle="subtitle" :text="text" :links="links"></card-body>
				</card>
			</div>
			<div :class="{ 'col-4 mb-3': bs5 }">
				<card-img :src="image" place="top"></card-img>
				<card>
					<card-body :text="text"></card-body>
				</card>
			</div>
		<!-- </div>
		<div class="row mt-3"> -->
			<div :class="{ 'col-4 mb-3': bs5 }">
				<card>
					<list-group :items="items" flush></list-group>
				</card>
			</div>
			<div :class="{ 'col-4 mb-3': bs5 }">
				<card border-color="primary" text-color="primary" header-bg-color="primary" header-border-color="primary" header-text-color="white">
					<template #header>
						{{ header }}
					</template>
					<list-group :items="items" flush></list-group>
				</card>
			</div>
			<div :class="{ 'col-4 mb-3': bs5 }">
				<card>
					<card-img :src="image" place="top"></card-img>
					<card-body :title="title" :text="text"></card-body>
					<div class="border-top border-bottom">
						<list-group :items="items" flush></list-group>
					</div>
					<card-body :links="links"></card-body>
				</card>
			</div>
			<div :class="{ 'col-4 mb-3': bs5 }">
				<card>
					<template #header>
						{{ header }}
					</template>
					<card-body :title="title" :text="text">
						<btn>{{ button }}</btn>
					</card-body>
				</card>
			</div>
		<!-- </div>
		<div class="row mt-3"> -->
			<div :class="{ 'col-4 mb-3': bs5 }">
				<card>
					<template #header>
						{{ header }}
					</template>
					<card-body :title="title" :text="text">
						<btn>{{ button }}</btn>
					</card-body>
					<template #footer>
						{{ footer }}
					</template>
				</card>
			</div>
			<div :class="{ 'col-4 mb-3': bs5 }">
				<card nav="tabs">
					<template #header>
						<a
							v-for="i in [1, 2, 3]"
							:key="i"

							:class="['nav-item', 'nav-link', i == 1 && 'active']"
							data-toggle="tab"
							:href="'#tabpanel-' + i"

							data-bs-toggle="tab"

							role="tab"
							:id="'tab-' + i"
							:aria-controls="'tabpanel-' + i"
							:aria-selected="i == 1"
						>
							{{ 'Tab ' + i }}
						</a>
					</template>
					<div
						v-for="i in [1, 2, 3]"
						:key="i"

						:class="['tab-pane', i == 1 && 'show', i == 1 && 'active']"
						:id="'tabpanel-' + i"

						role="tabpanel"
						:aria-labelledby="'tab-' + i"
					>
						<card-body :title="title + ' ' + i" :text="text">
							<btn>{{ button }}</btn>
						</card-body>
					</div>
				</card>
			</div>
			<div :class="{ 'col-4 mb-3': bs5 }">
				<card nav="pills">
					<template #header>
						<a
							v-for="i in [1, 2, 3]"
							:key="i"

							:class="['nav-item', 'nav-link', i == 1 && 'active']"
							data-toggle="pill"
							:href="'#pillpanel-' + i"

							data-bs-toggle="pill"

							role="tab"
							:id="'pill-' + i"
							:aria-controls="'pillpanel-' + i"
							:aria-selected="i == 1"
						>
							{{ 'Pill ' + i }}
						</a>
					</template>
					<div
						v-for="i in [1, 2, 3]"
						:key="i"

						:class="['tab-pane', i == 1 && 'show', i == 1 && 'active']"
						:id="'pillpanel-' + i"

						role="tabpanel"
						:aria-labelledby="'pill-' + i"
					>
						<card-body :title="title + ' ' + i" :text="text">
							<btn>{{ button }}</btn>
						</card-body>
					</div>
				</card>
			</div>
			<div :class="{ 'col-4 mb-3': bs5 }">
				<card>
					<card-body :title="title" :text="text"></card-body>
					<card-img :src="image" place="bottom"></card-img>
				</card>
			</div>
		<!-- </div>
		<div class="row mt-3"> -->
			<div :class="{ 'col-4 mb-3': bs5 }">
				<card bg-color="dark" text-color="white">
					<card-img :src="image"></card-img>
					<card-body overlay :title="title" :text="text"></card-body>
				</card>
			</div>
			<div :class="{ 'col-4 mb-3': bs5 }">
				<card no-gutters>
					<card-img col :src="v_image"></card-img>
					<card-body col :title="title" :text="text"></card-body>
				</card>
			</div>
			<!-- <div :class="col">
			</div>
			<div :class="col">
			</div> -->
		</div>

		<!-- <div class="row mt-3">
			<div :class="col"> -->
				<div class="card-group">
					<card v-for="i in [1, 2, 3, 4]" :key="i">
						<card-body :title="title" :text="text"></card-body>
						<template #footer>
							{{ 'Card №' + i }}
						</template>
					</card>
				</div>
			<!-- </div>
		</div> -->

		<div class="row mt-3">
			<div class="col">
				<div v-if="bs5" class="row row-cols-1 row-cols-md-5 g-4">
					<div class="col" v-for="i in [1, 2, 3, 4, 5]" :key="i">
						<card height="100">
							<card-body :title="title" :text="text">
								<div v-for="j in i" :key="j">
									<small class="text-muted">String №'{{ j }}</small>
								</div>
							</card-body>
							<!-- <template #footer>
								Card №{{ i }}
							</template> -->
						</card>
					</div>
				</div>
				<div v-else class="card-deck">
					<card v-for="i in [1, 2, 3, 4, 5]" :key="i">
						<card-body :title="title" :text="text">
							<div v-for="j in i" :key="j">
								<small class="text-muted">String №'{{ j }}</small>
							</div>
						</card-body>
						<!-- <template #footer>
							Card №{{ i }}
						</template> -->
					</card>
				</div>
			</div>
		</div>
		<div class="row mt-3">
			<div id="accordion" class="col accordion">
				<card v-for="i in [0, 1, 2]" :key="i" collapse="accordion" :accordion="i" :show="i == 2" header-text-color="primary">
					<template #header>
						<!-- <btn btn-style="link" block> -->
							{{ header + ' №' + (i + 1) }}
						<!-- </btn> -->
					</template>
					<card-body :title="title" :text="text"></card-body>
				</card>
			</div>
			<div class="col">
				<card collapse="collapse" :show="true" header-border-color="light" header-text-color="primary">
					<template #header>
						<!-- <btn btn-style="link" block> -->
							{{ header }}
						<!-- </btn> -->
					</template>
					<card-body :title="title" :text="text"></card-body>
				</card>
			</div>
		</div>
		<!--
			col
			tabs
			pills
		-->
	</div>
</template>

<script>
import card from './card.vue';
import cardBody from './card-body.vue';
import cardImg from './card-img.vue';
import cardLink from './card-link.vue';
import listGroup from './list-group.vue';
import listGroupItem from './list-group-item.vue';

export default {
	components: {
		'card': card,
		'card-body': cardBody,
		'card-img': cardImg,
		'card-link': cardLink,
		'list-group': listGroup,
		'list-group-item': listGroupItem
	},
	data() {
		return {
			button: 'Go somewhere',
			body: 'This is some text within a card body.',
			title: 'Card title',
			subtitle: 'Card subtitle',
			text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
			links: {
				'Card link': '#',
				'Another link': '#'
			},
			image: 'https://www.setxrm.com/wp-content/uploads/2019/12/photo-1518773553398-650c184e0bb3-980x590.jpg',
			v_image: 'https://s.tmimgcdn.com/scr/65900/responsive-bootstrap-4-perumnas-vol-2-update-yonetici-65956_65956-original.jpg',
			items: [
				'Cras justo odio',
				'Dapibus ac facilisis in',
				'Vestibulum at eros'
			],
			header: 'Featured',
			footer: '2 days ago'
		};
	},
	computed: {
		bs5() {
			return !!bootstrap.Modal.getInstance;
		}
	},
	mounted() {
		if (this.bs5)
//			this.$nextTick(function () {
			setTimeout(function () {
				let el = document.querySelector('#grid');
				let masonry = new Masonry(el, { percentPosition: true });
			}, 1000);
	}
}
</script>