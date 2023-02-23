<template>
	<div class="department">
		<PageSearch
			:search-config="searchConfig"
			@query-click="handleQueryClick"
			@reset-click="handleResetClick"
		></PageSearch>
		<PageContent
			ref="contentRef"
			:content-config="contentConfig"
			@new-click="handleNewClick"
			@edit-click="handleEditClick"
		></PageContent>
		<PageModal :modal-config="modalConfigREf" ref="modalRef"></PageModal>
	</div>
</template>

<script setup lang="ts" name="Department">
import PageContent from '@/components/page-content/PageContent.vue'
import PageModal from '@/components/page-modal/PageModal.vue'
import PageSearch from '@/components/page-search/PageSearch.vue'
import type { IUserQueryFormData, IDepartment } from '@/types'
import { computed, ref } from 'vue'
import searchConfig from './config/search.config'
import contentConfig from './config/content.config'
import modalConfig from './config/modal.config'
import useMainStore from '@/stores/main/main'
import usePageContent from '@/hooks/usePageContent'


// 获取 roles / departments 数据
const modalConfigREf = computed(() => {

	const mainStore = useMainStore()
	const selectFormItem = modalConfig.formItems.find(item => item.prop === 'parentId')

	if (selectFormItem)	selectFormItem.options =  mainStore.entireDepartments.map(item => ({
		label: item.name, value: item.id
	}))

	return modalConfig

})

usePageContent



const modalRef = ref<InstanceType<typeof PageModal>>()
const handleNewClick = () => {
	modalRef.value?.setModalVisible({ isNew: true })
}
const handleEditClick = (itemData: IDepartment) => {
	modalRef.value?.setModalVisible({ isNew: false, itemData })
}
</script>

<style scoped>
.department {
	border-radius: 8px;
	overflow: hidden;
}
</style>
