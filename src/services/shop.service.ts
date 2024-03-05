import { CreateShopParams, ListShopParams, ResetPasswordParams, UpdateShopParams } from '@src/interfaces/dto/shop.dto'
import request, { IApiResponse } from '@src/utils/request'

export function createShop<T>(data: CreateShopParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/sub-store/create-sub-store',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function updateShop<T>(data: UpdateShopParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/sub-store/update-sub-store',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

/* export function deleteShop<T>(shopId: number, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/inventory-store/delete-shop-in-store',
		options: {
			method: 'post',
			data: {
				shopId,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
} */

export function getShop<T>(storeOwnerId: string, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/sub-store/get-sub-store-detail',
		options: {
			method: 'post',
			data: {
				storeOwnerId,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getListShops<T>(data: ListShopParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/sub-store/get-sub-store',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function resetPassword<T>(data: ResetPasswordParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/sub-store/reset-password',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}
