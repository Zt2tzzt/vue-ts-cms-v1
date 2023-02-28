import ztRequest from '@/service'
import type {
	IGoodsAmountData,
	IGoodsCategoryCount,
	IGoodsCategorySale,
	IGoodsCategoryFavor,
	IGoodsCategoryAddressSale,
	IResponse
} from '@/types'

export const getGoodsAmountListData = () =>
	ztRequest.get<IResponse<IGoodsAmountData[]>>({
		url: '/goods/amount/list'
	})

export const getGoodsCategoryCount = () =>
	ztRequest.get<IResponse<IGoodsCategoryCount[]>>({
		url: '/goods/category/count'
	})

export const getGoodsCategorySale = () =>
	ztRequest.get<IResponse<IGoodsCategorySale[]>>({
		url: '/goods/category/sale'
	})

export const getGoodsCategoryFavor = () =>
	ztRequest.get<IResponse<IGoodsCategoryFavor[]>>({
		url: '/goods/category/favor'
	})

export const getGoodsAddressSale = () =>
	ztRequest.get<IResponse<IGoodsCategoryAddressSale[]>>({
		url: '/goods/address/sale'
	})
