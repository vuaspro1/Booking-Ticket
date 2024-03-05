export interface Provider {
	createdAt: number
	updatedAt: number
	id: number
	name: string
	address: string
	province: number
	ward: number
	district: number
	description: string
	image: string
	storeId?: any
	alias: string
	isActive: boolean
	merchantId: number
	chatId: string
}

export interface CategoryProvider {
	createdAt: number
	updatedAt: number
	id: number
	name: string
	image: string
	isActive: boolean
	parentId: number
	providerId: number
	mexchangeCategoryId?: any
}

export type AttributeValue = {
	[x: string]: any
}

export interface ProductProvider {
	id: number
	name: string
	description: string
	image: any
	salePrice: number
	originPrice: number
	weight: number
	width: number
	length: number
	height: number
	refId?: string
	cash?: number
	payment_cash?: number
	// quantityConversion: number
	// unit: string

	// attributeValues: AttributeValue[]
	// providerid: number
	// providerName: string
	// providerAddress: string
	// providerImage: string
	// providerDescription: string
	// providerChatId: string
}
