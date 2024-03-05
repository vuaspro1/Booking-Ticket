import {
	AddContactParams,
	CalculateParams,
	CreateOrderParams,
	ListCompanyParams,
	ListShippingServiceParams,
	PayProductsParams,
	RegisterLandingPageParams,
} from '@src/interfaces/Global'
import request, { IApiResponse } from '@src/utils/request'

export function upload<T>(file: File, token: string): Promise<IApiResponse<T>> {
	const data = new FormData()
	data.append('images', file)
	return request<T>({
		url: '/file/upload-image',
		options: {
			method: 'post',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'multipart/form-data',
			},
			data,
		},
	})
}

export function getListShippingService<T>(data: ListShippingServiceParams): Promise<IApiResponse<T>> {
	return request<T>({
		url: 'api/v2/order/list-shipping-service',
		options: {
			method: 'post',
			data,
			headers: {
				// Authorization: `Bearexr ${token}`,
				version: 'webmediaone',
			},
		},
	})
}

export function getApiPay<T>(data: PayProductsParams, token?: string): Promise<IApiResponse<T>> {
	let headers = {
		Authorization: '',
		version: 'webmediaone',
	}
	if (token) {
		headers = {
			Authorization: `Bearer ${token}`,
			version: 'webmediaone',
		}
	}
	return request<T>({
		url: 'api/v2/order/create-order',
		options: {
			method: 'post',
			data,
			headers,
		},
	})
}

export function getHomeContent<T>(): Promise<IApiResponse<T>> {
	return request<T>({
		url: 'api/v1/article/find-by-alias/vi/trang-chu',
		options: {
			method: 'get',
			headers: {
				version: 'webmediaone',
			},
		},
	})
}

export function getCaptcha<T>(): Promise<IApiResponse<T>> {
	return request<T>({
		url: 'api/v1/captcha',
		options: {
			method: 'get',
			headers: {
				// version: 'webmediaone',
			},
		},
	})
}

export function addContact<T>(data: AddContactParams): Promise<IApiResponse<T>> {
	return request<T>({
		url: 'api/v1/contact/add',
		options: {
			method: 'post',
			data,
			headers: {
				version: 'webmediaone',
			},
		},
	})
}

export function getIntroductionContent<T>(): Promise<IApiResponse<T>> {
	return request<T>({
		url: 'api/v1/article/find-by-alias/vi/gioi-thieu',
		options: {
			method: 'get',
			headers: {
				version: 'webmediaone',
			},
		},
	})
}

export function getHealthCareContent<T>(): Promise<IApiResponse<T>> {
	return request<T>({
		url: 'api/v1/article/find-by-alias/vi/cham-soc-suc-khoe',
		options: {
			method: 'get',
			headers: {
				version: 'webmediaone',
			},
		},
	})
}

export function registerLandingPage<T>(data: RegisterLandingPageParams): Promise<IApiResponse<T>> {
	return request<T>({
		url: 'api/order/landing-page',
		options: {
			method: 'post',
			data,
			// headers: {
			// 	'Content-Type': 'application/json',
			// },
		},
	})
}

export function getListCompany<T>(params?: ListCompanyParams): Promise<IApiResponse<T>> {
	return request<T>({
		url: 'api/company/get-list',
		options: {
			method: 'get',
			params,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer a565d01e-3dd4-4464-b8e2-9d49e3a460df2`,
			},
		},
	})
}

export function calculatePrice<T>(data: CalculateParams): Promise<IApiResponse<T>> {
	return request<T>({
		url: 'api/order/landing-page/calculate-price',
		options: {
			method: 'post',
			data,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer a565d01e-3dd4-4464-b8e2-9d49e3a460df2`,
			},
		},
	})
}

export function createOrder<T>(data: CreateOrderParams): Promise<IApiResponse<T>> {
	return request<T>({
		url: 'api/order/landing-page/create-order',
		options: {
			method: 'post',
			data,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer a565d01e-3dd4-4464-b8e2-9d49e3a460df2`,
			},
		},
	})
}
