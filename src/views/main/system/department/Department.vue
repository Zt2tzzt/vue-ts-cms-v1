<template>
	<div class="department">
		<PageSearch
			:search-config="searchConfig"
			@query-click="handleQueryClick"
			@reset-click="handleResetClick"
		></PageSearch>
		<PageContent
			ref="contentRef"
			@new-click="handleNewClick"
			@edit-click="handleEditClick"
		></PageContent>
		<PageModal ref="modalRef"></PageModal>
	</div>
</template>

<script setup lang="ts" name="Department">
import PageContent from './cpns/PageContent.vue'
import PageModal from './cpns/PageModal.vue'
import PageSearch from '../../../../components/page-search/PageSearch.vue'
import type { IUserQueryFormData, IDepartment } from '@/types'
import { ref } from 'vue'
import searchConfig from './config/search.config'

const contentRef = ref<InstanceType<typeof PageContent>>()
const handleQueryClick = (formData: IUserQueryFormData) => {
	contentRef.value?.fetchPageListData(formData)
}
const handleResetClick = () => {
	contentRef.value?.fetchPageListData()
}

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
