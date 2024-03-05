// import { NewsListParam } from '@src/interfaces/Global'
import request, { IApiResponse } from '@src/utils/request'
import { stringify } from 'qs'

export function getListNewsSuKien<T>(): Promise<IApiResponse<T>> {
	const url = `api/v1/article/find-nodes?query={"nameAlias":"tin-su-kien","status":1,"language":"vi"}`
	return request<T>({
		url,
		options: {
			method: 'get',
			headers: {
				version: 'webmediaone',
			},
		},
	})
}

export function getListNewsTintuc<T>(skip: number): Promise<IApiResponse<T>> {
	const url = `api/v1/article/find-nodes?${stringify({
		query: {
			nameAlias: 'tin-su-kien',
			language: 'vi',
			status: 1,
		},
		pageSize: 9,
		page: skip,
	})}`
	return request<T>({
		url,
		options: {
			method: 'get',
			headers: {
				version: 'webmediaone',
			},
		},
	})
}

export function getListNewsPromotion<T>(skip: number): Promise<IApiResponse<T>> {
	const url = `api/v1/article/find-nodes?${stringify({
		query: {
			nameAlias: 'tin-khuyen-mai',
			language: 'vi',
			status: 1,
		},
		pageSize: 9,
		page: skip,
	})}`
	return request<T>({
		url,
		options: {
			method: 'get',
			headers: {
				version: 'webmediaone',
			},
		},
	})
}

export function getListNewsHealthCare<T>(skip: number): Promise<IApiResponse<T>> {
	const url = `api/v1/article/find-nodes?${stringify({
		query: {
			nameAlias: 'cham-soc-suc-khoe',
			language: 'vi',
			status: 1,
		},
		pageSize: 9,
		page: skip,
	})}`
	return request<T>({
		url,
		options: {
			method: 'get',
			headers: {
				version: 'webmediaone',
			},
		},
	})
}

export function getNewsInfo<T>(productTypeId: number): Promise<IApiResponse<T>> {
	const url = `v1/product/get-product-info/${productTypeId}`
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

export function getNewsDetail<T>(data: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: `api/v1/article/find-by-alias/vi/${data}`,
		options: {
			method: 'get',
			headers: {
				version: 'webmediaone',
			},
		},
	})
}
