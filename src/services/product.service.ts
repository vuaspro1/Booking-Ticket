import { ProductParams, ListProductParams } from '@src/interfaces/Product'
import request, { IApiResponse } from '@src/utils/request'

export function createProduct<T>(data: ProductParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/inventory-store/create-product',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function updateProduct<T>(data: ProductParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/inventory-store/update-product',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function deleteProduct<T>(productId: number, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/inventory-store/delete-product-in-store',
		options: {
			method: 'post',
			data: {
				productId,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getListProducts<T>(params: ListProductParams): Promise<IApiResponse<T>> {
	return request<T>({
		url: 'api/v1/product/list-product',
		options: {
			method: 'get',
			params,
			headers: {
				version: 'webmediaone',
			},
		},
	})
}

export function getProductsInfo<T>(productTypeId: number): Promise<IApiResponse<T>> {
	const url = `api/v1/product/get-product-info/${productTypeId}`
	return request<T>({
		url,
		options: {
			method: 'get',
			headers: {
				version: 'webmediaone',
			},
			data: {
				productTypeId,
			},
		},
	})
}
