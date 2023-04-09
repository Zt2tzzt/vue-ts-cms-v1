import { ref } from 'vue'
import type PageContent from '@/components/page-content/PageContent.vue'
import type { SearchFormDataType } from '@/types'

const usePageSearch = () => {
  const contentRef = ref<InstanceType<typeof PageContent>>()

  const handleQueryClick = <T extends SearchFormDataType>(formData: T) => {
    contentRef.value?.fetchPageListData(formData)
  }

  const handleResetClick = () => {
    contentRef.value?.fetchPageListData()
  }

  return [contentRef, handleQueryClick, handleResetClick]
}

export default usePageSearch
