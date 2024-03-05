import {
	ListProviderCategoryParams,
	ListProviderParams,
	ListProviderProductParams,
	ProviderProductParams,
} from '@src/interfaces/Provider'
import request, { IApiResponse } from '@src/utils/request'

export function getListProviders<T>(data: ListProviderParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/provider/get-provider',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getListProviderCategories<T>(data: ListProviderCategoryParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/provider/product/get-category',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getListProviderProducts<T>(data: ListProviderProductParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/provider/product/get-product-by-category',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getProviderProductInfo<T>(data: ProviderProductParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/provider/product/get-product-detail',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}
