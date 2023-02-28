import useLoginStore from '@/stores/login/login'

const usePermission = (permissionStr: string): boolean => {
	const loginStore = useLoginStore()
	return loginStore.permissions.some(item => item.includes(permissionStr))
}

export default usePermission
