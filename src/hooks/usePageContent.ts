import type PageModal from '@/components/page-modal/PageModal.vue'
import { ref } from 'vue';
import type { ItemType, CreateFormType, EditFormType, IRole } from '@/types';

type EditCallbackType = (data: IRole) => void

const usePageContent = (editCallback?: EditCallbackType) => {

	const modalRef = ref<InstanceType<typeof PageModal>>()

	const handleNewClick = () => {
		modalRef.value?.setModalVisible<never, CreateFormType>({ isNew: true })
	}

	const handleEditClick = (itemData: ItemType) => {
		modalRef.value?.setModalVisible<ItemType, EditFormType>({ isNew: false, itemData })
		if (editCallback && 'menuList' in itemData) editCallback(itemData)
	}

	return [modalRef, handleNewClick, handleEditClick]
}

export default usePageContent

