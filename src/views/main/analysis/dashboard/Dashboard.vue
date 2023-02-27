<script setup lang="ts" name="dashboard">
import useAnalysisStore from '@/stores/main/analysis/analysis'
import { storeToRefs } from 'pinia'
import CountCard from './cpns/count-card/CountCard.vue'

const analysisStore = useAnalysisStore()
analysisStore.fetchAnalysisDataAction()

const { goodsAmountList, goodsCategoryCount, goodsCategorySale, goodsCategoryFavor, goodsCategoryAddressSale } =	storeToRefs(analysisStore)

</script>

<template>
	<div class="dashboard">
		<!-- 数字卡片 -->
		<el-row :gutter="10">
			<template v-for="item of goodsAmountList" :key="item.amount">
				<el-col :span="6" :xs="24" :sm="12" :md="8" :lg="6">
					<CountCard></CountCard>
				</el-col>
			</template>
		</el-row>
	</div>
</template>

<style scoped>
.dashboard {
}
</style>
