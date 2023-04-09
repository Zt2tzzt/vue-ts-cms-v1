<script setup lang="ts">
import PageSearch from '@/components/page-search/PageSearch.vue'
import searchConfig from './config/search.config'
import PageContent from '@/components/page-content/PageContent.vue'
import contentConfig from './config/contnt.config'
import usePageContent from '@/hooks/usePageContent'
import usePageSearch from '@/hooks/usePageSearch'
import type { IRole, HookFnType } from '@/types'
import useMainStore from '@/stores/main/main'
import { storeToRefs } from 'pinia'
import { nextTick, ref } from 'vue'
import PageModal from '@/components/page-modal/PageModal.vue'
import modalConfig from './config/modal.config'
import type { ElTree } from 'element-plus'
import { mapMenusToIds } from '@/utils/map-menu'

const mainStore = useMainStore()
const { entireMenus } = storeToRefs(mainStore)

const otherInfo = ref({})
const handleElTreeCheck = (detail: any, data: any) => {
  console.log('data:', data)
  const menuList = [...data.checkedKeys, ...data.halfCheckedKeys]
  console.log(`menuList`, menuList)
  otherInfo.value = { menuList }
}

const treeRef = ref<InstanceType<typeof ElTree>>()
const editCallback = (itemData: IRole) => {
  nextTick(() => {
    const menuIds = mapMenusToIds(itemData.menuList)
    console.log('menuIds:', menuIds)
    treeRef.value?.setCheckedKeys(menuIds)
  })
}

const [contentRef, handleQueryClick, handleResetClick] = usePageSearch()
const [modalRef, handleNewClick, handleEditClick] = usePageContent(editCallback)
</script>

<template>
  <div class="role">
    <PageSearch
      :search-config="searchConfig"
      @query-click="handleQueryClick as HookFnType"
      @reset-click="handleResetClick as HookFnType"
    ></PageSearch>
    <PageContent
      ref="contentRef"
      :content-config="contentConfig"
      @new-click="handleNewClick as HookFnType"
      @edit-click="handleEditClick as HookFnType"
    ></PageContent>
    <PageModal ref="modalRef" :modal-config="modalConfig" :other-info="otherInfo">
      <template #menulist>
        <el-tree
          ref="treeRef"
          :data="entireMenus"
          show-checkbox
          node-key="id"
          :props="{ children: 'children', label: 'name' }"
          @check="handleElTreeCheck"
        ></el-tree>
      </template>
    </PageModal>
  </div>
</template>

<style scoped></style>
