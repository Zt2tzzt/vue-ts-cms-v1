export interface IGoodsAmountData {
  amount: string
  title: string
  tips: string
  subtitle: string
  number1: number
  number2: number
}

export interface IGoodsCategoryCount {
  id: number
  name: string
  goodsCount: number
}

export interface IGoodsCategorySale {
  id: number
  name: string
  goodsCount: number
}

export interface IGoodsCategoryFavor {
  id: number
  name: string
  goodsFavor: number
}

export interface IGoodsCategoryAddressSale {
  address: string
  count: number
}
