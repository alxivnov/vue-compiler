<template>
	<div class="my-3">
		<div class="row-X card-columns mt-3">
			<!-- <div class="col"> -->
				<card>
					<card-img :src="image" place="top"></card-img>
					<card-body :title="title" :text="text">
						<btn>{{ button }}</btn>
					</card-body>
				</card>
			<!-- </div>
			<div class="col"> -->
				<card>
					<card-body>
						{{ body }}
					</card-body>
				</card>
			<!-- </div>
			<div class="col"> -->
				<card>
					<card-body :title="title" :subtitle="subtitle" :text="text" :links="links"></card-body>
				</card>
			<!-- </div>
			<div class="col"> -->
				<card-img :src="image" place="top"></card-img>
				<card>
					<card-body :text="text"></card-body>
				</card>
			<!-- </div>
		</div>
		<div class="row mt-3">
			<div class="col"> -->
				<card>
					<list-group :items="items" flush></list-group>
				</card>
			<!-- </div>
			<div class="col"> -->
				<card border-color="primary" text-color="primary" header-bg-color="primary" header-border-color="primary" header-text-color="white">
					<template #header>
						{{ header }}
					</template>
					<list-group :items="items" flush></list-group>
				</card>
			<!-- </div>
			<div class="col"> -->
				<card>
					<card-img :src="image" place="top"></card-img>
					<card-body :title="title" :text="text"></card-body>
					<div class="border-top border-bottom">
						<list-group :items="items" flush></list-group>
					</div>
					<card-body :links="links"></card-body>
				</card>
			<!-- </div>
			<div class="col"> -->
				<card>
					<template #header>
						{{ header }}
					</template>
					<card-body :title="title" :text="text">
						<btn>{{ button }}</btn>
					</card-body>
				</card>
			<!-- </div>
		</div>
		<div class="row mt-3">
			<div class="col text-center"> -->
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
			<!-- </div>
			<div class="col"> -->
				<card nav="tabs">
					<template #header>
						<a
							v-for="i in [1, 2, 3]"
							:key="i"

							:class="['nav-item', 'nav-link', i == 1 && 'active']"
							data-toggle="tab"
							:href="'#tabpanel-' + i"

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
			<!-- </div>
			<div class="col"> -->
				<card nav="pills">
					<template #header>
						<a
							v-for="i in [1, 2, 3]"
							:key="i"

							:class="['nav-item', 'nav-link', i == 1 && 'active']"
							data-toggle="pill"
							:href="'#pillpanel-' + i"

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
			<!-- </div>
			<div class="col"> -->
				<card>
					<card-body :title="title" :text="text"></card-body>
					<card-img :src="image" place="bottom"></card-img>
				</card>
			<!-- </div>
		</div>
		<div class="row mt-3">
			<div class="col"> -->
				<card bg-color="dark" text-color="white">
					<card-img :src="image"></card-img>
					<card-body overlay :title="title" :text="text"></card-body>
				</card>
			<!-- </div>
			<div class="col"> -->
				<card no-gutters>
					<card-img col :src="v_image"></card-img>
					<card-body col :title="title" :text="text"></card-body>
				</card>
			<!-- </div>
			<div class="col">
			</div>
			<div class="col">
			</div> -->
		</div>
		<div class="row mt-3">
			<div class="col">
				<div class="card-group">
					<card v-for="i in [1, 2, 3, 4]" :key="i">
						<card-body :title="title" :text="text"></card-body>
						<template #footer>
							{{ 'Card №' + i }}
						</template>
					</card>
				</div>
			</div>
		</div>
		<div class="row mt-3">
			<div class="col">
				<div class="card-deck">
					<card v-for="i in [1, 2, 3, 4, 5]" :key="i">
						<card-body :title="title" :text="text">
							<small class="text-muted">{{ 'Card №' + i }}</small>
						</card-body>
					</card>
				</div>
			</div>
		</div>
		<div class="row mt-3">
			<div id="accordion" class="col accordion">
				<card v-for="i in [1, 2, 3]" :key="i" collapse="accordion" :accordion="i" header-text-color="primary">
					<template #header>
						<!-- <btn btn-style="link" block> -->
							{{ header + ' №' + i }}
						<!-- </btn> -->
					</template>
					<card-body :title="title" :text="text"></card-body>
				</card>
			</div>
			<div class="col">
				<card collapse="collapse" header-border-color="light" header-text-color="primary">
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
export default {
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
	}
}
</script>