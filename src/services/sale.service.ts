import { SaleParams, ListSaleParams, AccumulateParams } from '@src/interfaces/Sale'
import request, { IApiResponse } from '@src/utils/request'

export function createSale<T>(data: SaleParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/sale/bill/create-bill',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getSale<T>(saleId: number, token: string): Promise<IApiResponse<T>> {
	/* return Promise.resolve<any>({
		status: 200,
		data: {
			code: 0,
			data: {
				id,
				token,
			},
		},
	}) */
	return request<T>({
		url: '/report/sale/sale-detail',
		options: {
			method: 'post',
			data: {
				saleId,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getListSales<T>(data: ListSaleParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/report/sale/sale-report',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function accumulatePoint<T>(data: AccumulateParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/accumulate/accumulate-point',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}
