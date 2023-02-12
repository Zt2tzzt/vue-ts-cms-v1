import type { IAccount, ILoginRes } from '@/types'
import ztRequest from '..'

export const accountLoginRequest = (account: IAccount) => ztRequest.post<ILoginRes>({
	url: 'login',
	data: account
})
