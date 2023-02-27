import { defineStore } from 'pinia'
import type {
	IGoodsAmountData,
	IGoodsCategoryCount,
	IGoodsCategorySale,
	IGoodsCategoryFavor,
	IGoodsCategoryAddressSale
} from '@/types'
import {
	getGoodsAmountListData,
	getGoodsCategoryCount,
	getGoodsCategorySale,
	getGoodsCategoryFavor,
	getGoodsCategoryAddressSale
} from '@/service/main/analysis/analysis'

interface IAnalysisState {
	goodsAmountList: IGoodsAmountData[]
	goodsCategoryCount: IGoodsCategoryCount[]
	goodsCategorySale: IGoodsCategorySale[]
	goodsCategoryFavor: IGoodsCategoryFavor[]
	goodsCategoryAddressSale: IGoodsCategoryAddressSale[]
}

const useAnalysisStore = defineStore('analysis', {
	state: (): IAnalysisState => ({
		goodsAmountList: [],
		goodsCategoryCount: [],
		goodsCategorySale: [],
		goodsCategoryFavor: [],
		goodsCategoryAddressSale: []
	}),
	actions: {
		fetchAnalysisDataAction() {
			getGoodsAmountListData().then(res => {
				console.log('goods amount list res:', res)
				this.goodsAmountList = res.data
			})
			getGoodsCategoryCount().then(res => {
				console.log('goods category count res:', res)
				this.goodsCategoryCount = res.data
			})
			getGoodsCategorySale().then(res => {
				console.log('gooods category sale res:', res)
				this.goodsCategorySale = res.data
			})
			getGoodsCategoryFavor().then(res => {
				console.log('goods category favor res:', res)
				this.goodsCategoryFavor = res.data
			})
			getGoodsCategoryAddressSale().then(res => {
				console.log('goods address sale res:', res)
				this.goodsCategoryAddressSale = res.data
			})
		}
	}
})

export default useAnalysisStore
