import { CustomerParams, CustomerReportParams, ListCustomerParams } from '@src/interfaces/Customer'
import request, { IApiResponse } from '@src/utils/request'
// import { stringify } from 'qs'

export function createCustomer<T>(data: CustomerParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/customer-store/create-customer',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getListCustomers<T>(data: ListCustomerParams): Promise<IApiResponse<T>> {
	return request<T>({
		url: `api/v1/contact?populate=userId&query={"status": 1, "type": "review"}`,
		options: {
			method: 'get',
			data,
			headers: {
				version: 'webmediaone',
			},
		},
	})
}

export function getCustomerReport<T>(data: CustomerReportParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/customer-store/customer-store-detail',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function findCustomer<T>(phone: string, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/customer-store/check-point-customer',
		options: {
			method: 'post',
			data: {
				phone,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}
