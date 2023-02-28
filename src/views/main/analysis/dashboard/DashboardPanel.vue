<script setup lang="ts" name="dashboard">
import { PieEchart, MapEchart, RoseEchart, LineEchart, BarEchart } from '@/components/page-echarts'
import useAnalysisStore from '@/stores/main/analysis/analysis'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import ChartCard from './cpns/chart-card/ChartCard.vue'
import CountCard from './cpns/count-card/CountCard.vue'

const analysisStore = useAnalysisStore()
analysisStore.fetchAnalysisDataAction()

const { goodsAmountList, goodsCategoryCount, goodsCategorySale, goodsCategoryFavor, goodsAddressSale } =
	storeToRefs(analysisStore)

const showGoodsCategoryCount = computed(() =>
	goodsCategoryCount.value.map(itme => ({
		name: itme.name,
		value: itme.goodsCount
	}))
)

const showgoodsCategorySale = computed(() => ({
	labels: goodsCategorySale.value.map(item => item.name),
	values: goodsCategorySale.value.map(item => item.goodsCount)
}))

const showgoodsCategoryFavor = computed(() => ({
	labels: goodsCategoryFavor.value.map(item => item.name),
	values: goodsCategoryFavor.value.map(item => item.goodsFavor)
}))

const showGoodsAddressSale = computed(() =>
	goodsAddressSale.value.map(item => ({
		name: item.address,
		values: item.count
	}))
)
</script>

<template>
	<div class="dashboard">
		<!-- 数字卡片 -->
		<el-row :gutter="10">
			<template v-for="item of goodsAmountList" :key="item.amount">
				<el-col :span="6" :xs="24" :sm="12" :md="8" :lg="6">
					<CountCard v-bind="item"></CountCard>
				</el-col>
			</template>
		</el-row>

		<!-- 图表 -->
		<el-row :gutter="10">
			<el-col :span="7">
				<ChartCard header="饼图">
					<PieEchart :pie-data="showGoodsCategoryCount"></PieEchart>
				</ChartCard>
			</el-col>
			<el-col :span="10">
				<ChartCard header="地图">
					<MapEchart :map-data="showGoodsAddressSale"></MapEchart>
				</ChartCard>
			</el-col>
			<el-col :span="7">
				<ChartCard header="玫瑰图">
					<RoseEchart :rose-data="showGoodsCategoryCount"></RoseEchart>
				</ChartCard>
			</el-col>

			<el-col :span="12">
				<ChartCard header="折线图">
					<LineEchart v-bind="showgoodsCategorySale"></LineEchart>
				</ChartCard>
			</el-col>
			<el-col :span="12">
				<ChartCard header="柱状图">
					<BarEchart v-bind="showgoodsCategoryFavor"></BarEchart>
				</ChartCard>
			</el-col>
		</el-row>
	</div>
</template>

<style scoped>
.el-col {
	margin-bottom: 10px;
}
</style>
