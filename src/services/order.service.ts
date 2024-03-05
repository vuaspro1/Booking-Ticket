import {
	CancelProviderOrderParams,
	ConfirmProviderOrderParams,
	ListProviderOrderParams,
	ProviderOrderParams,
} from '@src/interfaces/Provider'
import request, { IApiResponse } from '@src/utils/request'

export function createProviderOrder<T>(data: ProviderOrderParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/provider/order/create-order',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getListProviderOrder<T>(data: ListProviderOrderParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/provider/order/history-order',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function cancelProviderOrder<T>(data: CancelProviderOrderParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/provider/order/cancel-order',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function confirmProviderOrder<T>(data: ConfirmProviderOrderParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		// url: `/provider/order/${data.orderId}`,
		url: `/provider/order/confirm-order`,
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getProviderOrder<T>(orderId: number, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/provider/order/history-order-detail',
		options: {
			method: 'post',
			data: {
				orderId,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getCode<T>(code: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/api/v1/exchange/verify-code',
		options: {
			method: 'post',
			data: {
				code,
			},
			headers: {
				// Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getCheckCode<T>(code: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/api/v1/exchange/check-out-code',
		options: {
			method: 'post',
			data: {
				code,
			},
			headers: {
				// Authorization: `Bearer ${token}`,
			},
		},
	})
}
