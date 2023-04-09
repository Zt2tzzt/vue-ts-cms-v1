import type PageModal from '@/components/page-modal/PageModal.vue'
import { ref } from 'vue'
import type { ItemType, CreateFormDataType, EditFormDataType, IRole } from '@/types'

type EditCallbackType = (data: IRole) => void

const usePageContent = (editCallback?: EditCallbackType) => {
  const modalRef = ref<InstanceType<typeof PageModal>>()

  const handleNewClick = () => {
    modalRef.value?.setModalVisible<never, CreateFormDataType>({ isNew: true })
  }

  const handleEditClick = (itemData: ItemType) => {
    modalRef.value?.setModalVisible<ItemType, EditFormDataType>({ isNew: false, itemData })
    if (editCallback && 'menuList' in itemData) editCallback(itemData)
  }

  return [modalRef, handleNewClick, handleEditClick]
}

export default usePageContent
