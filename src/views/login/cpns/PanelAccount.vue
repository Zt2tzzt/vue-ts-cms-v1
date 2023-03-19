<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormRules, ElForm } from 'element-plus'
import useLoginStore from '@/stores/login/login'
import type { IAccount } from '@/types'
import { localCache } from '@/utils/cache'

const CACHE_NAME = 'name'
const CACHE_PASSWORD = 'password'

// 1.定义account数据
const account = reactive<IAccount>({
	name: localCache.getCache(CACHE_NAME) ?? '',
	password: localCache.getCache(CACHE_PASSWORD) ?? ''
})

// 2.定义校验规则
const accountRules: FormRules = {
	name: [
		{ required: true, message: '必须输入帐号信息~', trigger: 'blur' },
		{
			pattern: /^[a-z0-9]{6,20}$/,
			message: '必须是6~20数字或字母组成~',
			trigger: 'blur'
		}
	],
	password: [
		{ required: true, message: '必须输入密码信息~', trigger: 'blur' },
		{
			pattern: /^[a-z0-9]{3,}$/,
			message: '必须是3位以上数字或字母组成',
			trigger: 'blur'
		}
	]
}

// 3.执行帐号的登录逻辑
const formRef = ref<InstanceType<typeof ElForm>>()
const loginStore = useLoginStore()

const loginAction = (isRemPwd: boolean) => {
	formRef.value?.validate(valid => {
		if (valid) {
			loginStore
				.loginAccountAction({ ...account })
				.then(() => {
					if (isRemPwd) {
						localCache.setCache(CACHE_NAME, account.name)
						localCache.setCache(CACHE_PASSWORD, account.password)
					} else {
						localCache.removeCache(CACHE_NAME)
						localCache.removeCache(CACHE_PASSWORD)
					}
				})
				.catch(() => {
					ElMessage.error('Oops, 帐号或密码错误~~.')
				})
		} else {
			ElMessage.error('Oops, 请您输入正确的格式后再操作~~.')
		}
	})
}

defineExpose({
	loginAction
})
</script>

<template>
	<div class="panel-account">
		<el-form :model="account" :rules="accountRules" label-width="60px" size="large" ref="formRef">
			<el-form-item label="帐号" prop="name">
				<el-input v-model="account.name" clearable />
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="account.password" show-password clearable />
			</el-form-item>
		</el-form>
	</div>
</template>

<style scoped lang="less"></style>
