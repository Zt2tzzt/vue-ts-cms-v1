<script setup lang="ts">
import { ElForm } from 'element-plus'
import { reactive, ref, defineExpose } from 'vue'

const rules = {
  number: [
    {
      required: true,
      message: '手机号不能为空',
      trigger: 'blur'
    },
    {
      pattern: /^[0-9]{11}$/,
      message: '手机号格式有误',
      trigger: 'blur'
    }
  ],
  code: [
    {
      required: true,
      message: '验证码不能为空',
      trigger: 'blur'
    },
    {
      pattern: /^[0-9]{4}$/,
      message: '验证码格式有误',
      trigger: 'blur'
    }
  ]
}

const phone = reactive({
  number: '',
  code: ''
})

const formRef = ref<InstanceType<typeof ElForm>>()
const loginAction = () => {
  formRef.value?.validate(/* valid => {} */)
}

defineExpose({ loginAction })
</script>

<template>
  <div class="panel-phone">
    <el-form :model="phone" :rules="rules" label-width="65px" size="large" ref="formRef">
      <el-form-item label="手机号" prop="number">
        <el-input v-model="phone.number" />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div class="get-code">
          <el-input v-model="phone.code" />
          <el-button type="primary" class="get-code-btn">获取验证码</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="less">
.get-code {
  display: flex;
  .get-code-btn {
    margin-left: 7px;
  }
}
</style>
