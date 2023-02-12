import { accountLoginRequest } from '@/service/login/login';
import type { IAccount } from '@/types';
import { localCache } from '@/utils/cache';
import { defineStore } from 'pinia';

const LOGIN_TOKEN = 'login/token'

const useLoginStore =  defineStore('login', {
	state: () => ({
		id: 0,
		token: localCache.getCache(LOGIN_TOKEN) ?? '',
		name: ''
	}),
	actions: {
		loginAccountAction(account: IAccount) {

			accountLoginRequest(account).then(res => {
				this.id = res.data.id
				this.token = res.data.token
				this.name = res.data.name

				localCache.setCache(LOGIN_TOKEN, this.token)
			})
		}
	}
})

export default useLoginStore
