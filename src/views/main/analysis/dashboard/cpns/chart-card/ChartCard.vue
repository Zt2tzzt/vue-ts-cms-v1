<script setup lang="ts">
withDefaults(
  defineProps<{
    header?: string
  }>(),
  {
    header: '卡片标题'
  }
)
</script>

<template>
  <div class="chart-card">
    <el-card :header="header">
      <slot> 卡片内容</slot>
    </el-card>
  </div>
</template>

<style scoped lang="less"></style>
