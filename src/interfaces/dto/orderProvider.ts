export interface OrderProvider {
	createdAt: number
	updatedAt: number
	id: number
	status: string
	totalMoney: number
	nameProvider: string
	imageProvider: string
	products?: OrderProviderProduct[]
	rate?: Rate
}

export interface OrderProviderProduct {
	productId: number
	name: string
	image: string
	unit: string
	quantity: number
	orderId: number
	createdAt: any
	note: string
	status: string
	initPrice: number
	initPriceStore: number
	salePriceStore: number
}

export interface Rate {
	rateService: number
	commentService: string
	commentProduct: string
	rateProduct: number
	images?: any
}
