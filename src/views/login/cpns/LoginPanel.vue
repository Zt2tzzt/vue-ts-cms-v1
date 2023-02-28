<script setup lang="ts">
import { localCache } from '@/utils/cache'
import { ref, watch } from 'vue'
import PanelAccount from './PanelAccount.vue'
import PanelPhone from './PanelPhone.vue'

const IS_REM_PWD = 'isRemPwd'

const isRemPwd = ref<boolean>(localCache.getCache(IS_REM_PWD) ?? false)
watch(isRemPwd, newVal => {
	localCache.setCache(IS_REM_PWD, newVal)
})

const activeName = ref('account')
const accountRef = ref<InstanceType<typeof PanelAccount>>()
const handleLoginBtnClick = () => {
	switch (activeName.value) {
		case 'account':
			accountRef.value?.loginAction(isRemPwd.value)
			break
		case 'phone':
			console.log('用户在进行手机登录')
			break
	}
}
</script>

<template>
	<div class="login-panel">
		<h1 class="title">ZT 后台管理系统</h1>

		<!-- tabs 区域，在帐号和手机登录之间切换。 -->
		<div class="tabs">
			<el-tabs type="border-card" stretch v-model="activeName">
				<!-- 1.账号登录的Pane -->
				<el-tab-pane name="account">
					<template #label>
						<div class="label">
							<el-icon><UserFilled /></el-icon>
							<span class="text">帐号登录</span>
						</div>
					</template>
					<PanelAccount ref="accountRef"></PanelAccount>
				</el-tab-pane>

				<!-- 2.手机登录的Pane -->
				<el-tab-pane name="phone">
					<template #label>
						<div class="label">
							<el-icon><Cellphone /></el-icon>
							<span class="text">手机登录</span>
						</div>
					</template>
					<PanelPhone></PanelPhone>
				</el-tab-pane>
			</el-tabs>
		</div>

		<!-- 底部区域 -->
		<div class="controls" v-show="activeName === 'account'">
			<el-checkbox v-model="isRemPwd" label="记住密码" size="large" />
			<el-link type="primary">忘记密码</el-link>
		</div>
		<el-button class="login-btn" type="primary" size="large" @click="handleLoginBtnClick"> 立即登录 </el-button>
	</div>
</template>

<style scoped lang="less">
.login-panel {
	width: 330px;
	margin-bottom: 150px;

	.title {
		text-align: center;
		margin-bottom: 15px;
	}

	.label {
		display: flex;
		align-items: center;
		justify-content: center;

		.text {
			margin-left: 5px;
		}
	}

	.controls {
		margin-top: 12px;
		display: flex;

		justify-content: space-between;
	}

	.login-btn {
		margin-top: 10px;
		width: 100%;
		// --el-button-size: 50px;
	}
}
</style>
