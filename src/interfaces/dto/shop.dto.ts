export interface ShopParams {
	nameStore: string
	phoneStore: string
	username: string
	password?: string
	storeOwnerName: string
	storeOwnerPhone: string
	address: string
	province: string
	district: string
	ward: string
	lat?: number
	lng?: number
	image: string
}

export interface CreateShopParams extends ShopParams {}

export interface UpdateShopParams extends ShopParams {
	mexchangeStoreId: string
}

export interface ListShopParams {
	skip: number
	limit: number
}

export interface ResetPasswordParams {
	newPassword: string
	storeOwnerId: string
}
