<script setup lang="ts" name="user">
import UserContent from './cpns/UserContent.vue'
import UserSearch from './cpns/UserSearch.vue'
import type { IUserSearchFormData, IUser } from '@/types'
import { ref } from 'vue'
import UserModal from './cpns/UserModal.vue'

const contentRef = ref<InstanceType<typeof UserContent>>()
const handleQueryClick = (formData: IUserSearchFormData) => {
	contentRef.value?.fetchUserListData(formData)
}
const handleResetClick = () => {
	contentRef.value?.fetchUserListData()
}

const modalRef = ref<InstanceType<typeof UserModal>>()
const handleNewClick = () => {
	modalRef.value?.setModalVisible({ isNew: true })
}
const handleEditClick = (itemData: IUser) => {
	modalRef.value?.setModalVisible({ isNew: false, itemData })
}
</script>

<template>
	<div class="user">
		<UserSearch @query-click="handleQueryClick" @reset-click="handleResetClick"></UserSearch>
		<UserContent ref="contentRef" @new-click="handleNewClick" @edit-click="handleEditClick"></UserContent>
		<UserModal ref="modalRef"></UserModal>
	</div>
</template>

<style scoped>
.user {
	border-radius: 8px;
	overflow: hidden;
}
</style>
