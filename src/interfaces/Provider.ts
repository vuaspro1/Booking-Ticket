import { ORDER_STATUS } from './enums'

export interface ListProviderParams {
	skip: number
	limit: number
	name?: string
}

export interface ListProviderCategoryParams {
	providerId: number
	skip: number
	limit: number
}

export interface ListProviderProductParams {
	providerId?: number
	categoryId?: number
	skip: number
	limit: number
	name?: string
}

export interface ProviderProductParams {
	productId: number
}

export interface ProductProviderOrder {
	id: number
	quantity: number
}

export interface ProviderOrderParams {
	receiveName: string
	receivePhone: string
	receiveAddress: string
	note: string
	products: ProductProviderOrder[]
	providerId: number
}

export interface ListProviderOrderParams {
	status: ORDER_STATUS
	skip: number
	limit: number
	startTime?: number
	endTime?: number
}

export interface CancelProviderOrderParams {
	orderId: number
	note?: string
}

export interface ConfirmProviderOrderParams {
	orderId: number
	productId: number
	initPrice?: number
	salePrice?: number
	quantity?: number
}
