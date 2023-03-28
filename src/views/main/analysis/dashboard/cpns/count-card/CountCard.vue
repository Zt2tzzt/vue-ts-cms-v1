<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CountUp } from 'countup.js'

const props = withDefaults(
	defineProps<{
		amount?: string
		title?: string
		tips?: string
		number1: number
		number2: number
		subtitle?: string
	}>(),
	{
		title: '商品总销量',
		tips: '所有的商品总销量',
		number1: 589989,
		number2: 589989,
		subtitle: '商品总销量'
	}
)

// 创建 countup 实例对象
const count1Ref = ref<HTMLElement>()
const count2Ref = ref<HTMLElement>()

const countOption = {
	prefix: props.amount === 'saleroom' ? '￥' : ''
}

onMounted(() => {
	const countup1 = new CountUp(count1Ref.value!, props.number1, countOption)
	const countup2 = new CountUp(count2Ref.value!, props.number2, countOption)
	countup1.start()
	countup2.start()
})
</script>

<template>
	<div class="count-card">
		<!-- 头部标题 -->
		<div class="header">
			<span class="title">{{ title }}</span>
			<el-tooltip :content="tips" placement="top" effect="dark">
				<el-icon><Warning /></el-icon>
			</el-tooltip>
		</div>

		<!-- 数字 -->
		<div class="content">
			<span ref="count1Ref">{{ number1 }}</span>
		</div>

		<!-- 底部副标题和数字 -->
		<div class="footer">
			<span>{{ subtitle }}</span>
			<span ref="count2Ref">{{ number2 }}</span>
		</div>
	</div>
</template>

<style scoped lang="less">
.count-card {
	display: flex;
	flex-direction: column;
	padding: 0 20px;
	height: 130px;
	background-color: #fff;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

	.header {
		display: flex;
		height: 36px;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.45);
		justify-content: space-between;
		align-items: flex-end;
	}

	.content {
		display: flex;
		align-items: center;
		flex: 1;
		margin-left: 0;
		font-size: 26px;
		color: rgba(0, 0, 0, 0.85);
	}

	.footer {
		display: flex;
		height: 38px;
		line-height: 38px;
		font-size: 14px;
		letter-spacing: 1px;
		color: rgba(0, 0, 0, 0.85);
		border-top: 1px solid #f0f0f0;
	}
}
</style>
