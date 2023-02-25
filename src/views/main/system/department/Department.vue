<template>
	<div class="department">
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
		<PageModal :modal-config="modalConfigRef" ref="modalRef"></PageModal>
	</div>
</template>

<script setup lang="ts" name="Department">
import PageContent from '@/components/page-content/PageContent.vue'
import PageModal from '@/components/page-modal/PageModal.vue'
import PageSearch from '@/components/page-search/PageSearch.vue'
import { computed } from 'vue'
import searchConfig from './config/search.config'
import contentConfig from './config/content.config'
import modalConfig from './config/modal.config'
import useMainStore from '@/stores/main/main'
import usePageSearch from '@/hooks/usePageSearch'
import usePageContent from '@/hooks/usePageContent'
import type { HookFnType } from '@/types'

// 获取 roles / departments 数据
const modalConfigRef = computed(() => {
	const mainStore = useMainStore()
	const selectFormItem = modalConfig.formItems.find(item => {
		item.type === 'select' && item.prop === 'parentId'
	})

	if (selectFormItem && 'options' in selectFormItem)
		selectFormItem.options = mainStore.entireDepartments.map(item => ({
			label: item.name,
			value: item.id
		}))

	return modalConfig
})

const [contentRef, handleQueryClick, handleResetClick] = usePageSearch()
const [modalRef, handleNewClick, handleEditClick] = usePageContent()
</script>

<style scoped>
.department {
	border-radius: 8px;
	overflow: hidden;
}
</style>
