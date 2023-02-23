import { ref } from 'vue';
import type PageContent from '@/components/page-content/PageContent.vue'
import type { IDepartmentQueryFormData } from '@/types'

const usePageSearch = () => {

	const contentRef = ref<InstanceType<typeof PageContent>>()
	const handleQueryClick = <T extends IDepartmentQueryFormData>(formData: T) => {
		contentRef.value?.fetchPageListData(formData)
	}
	const handleResetClick = () => {
		contentRef.value?.fetchPageListData()
	}

	return [contentRef, handleQueryClick, handleResetClick]
}


export default usePageSearch
