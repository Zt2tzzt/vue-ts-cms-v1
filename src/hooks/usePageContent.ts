import { ref } from 'vue';
import type PageContent from '@/components/page-content/PageContent.vue'

const usePageContent = () => {

	const contentRef = ref<InstanceType<typeof PageContent>>()
	const handleQueryClick = <T>(formData: T) => {
		contentRef.value?.fetchPageListData(formData)
	}
	const handleResetClick = () => {
		contentRef.value?.fetchPageListData()
	}

	return [contentRef, handleQueryClick, handleResetClick]
}


export default usePageContent
