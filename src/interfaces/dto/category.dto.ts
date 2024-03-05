export interface SaleCategory {
	createdAt: number
	updatedAt: number
	id: number
	storeId: string
	name: string
	image: string
	merchantId: number
	isActive: boolean
	parentId: number
	children?: SaleCategory[]
}
