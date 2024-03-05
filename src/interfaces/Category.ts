export interface ListSaleCategoryParams {}

export interface ListChildrenSaleCategoryParams {
	categoryStoreId?: number
}

export interface CreateSaleCategoryParams {
	name: string
	image: string
	parentId?: number
}

export interface UpdateSaleCategoryParams {
	categoryStoreId: number
	name: string
	image: string
	isActive: number
}
