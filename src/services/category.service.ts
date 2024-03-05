import {
	CreateSaleCategoryParams,
	ListChildrenSaleCategoryParams,
	ListSaleCategoryParams,
	UpdateSaleCategoryParams,
} from '@src/interfaces/Category'
import request, { IApiResponse } from '@src/utils/request'

export function getSaleCategories<T>(data: ListSaleCategoryParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/category-store/get-category-store',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getChildrenSaleCategories<T>(data: ListChildrenSaleCategoryParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/category-store/get-category-parent',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function createSaleCategory<T>(data: CreateSaleCategoryParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/category-store/update-category-store',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function updateSaleCategory<T>(data: UpdateSaleCategoryParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/category-store/update-category-store',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function deleteSaleCategory<T>(categoryStoreId: number, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/category-store/delete-category-store',
		options: {
			method: 'post',
			data: {
				categoryStoreId,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}
