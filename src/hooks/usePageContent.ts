import type PageModal from '@/components/page-modal/PageModal.vue'
import { ref } from 'vue';
import type { IDepartment } from '@/types'

const usePageContent = () => {

	const modalRef = ref<InstanceType<typeof PageModal>>()

	const handleNewClick = () => {
		modalRef.value?.setModalVisible({ isNew: true })
	}

	const handleEditClick = <T extends IDepartment>(itemData: T) => {
		modalRef.value?.setModalVisible({ isNew: false, itemData })
	}

	return [modalRef, handleNewClick, handleEditClick]
}

export default usePageContent

