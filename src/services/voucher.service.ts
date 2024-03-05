import { VoucherParams, ListVoucherParams } from '@src/interfaces/Voucher'
import request, { IApiResponse } from '@src/utils/request'

export function createVoucher<T>(data: VoucherParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/voucher/create-voucher',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function updateVoucher<T>(data: VoucherParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/voucher/update-voucher',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

/* export function deleteVoucher<T>(voucherId: string, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/inventory-store/delete-voucher-in-store',
		options: {
			method: 'post',
			data: {
				voucherId,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
} */

export function getVoucher<T>(id: string, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/voucher/voucher-detail',
		options: {
			method: 'post',
			data: {
				id,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getListVouchers<T>(data: ListVoucherParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/voucher/get-voucher',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function checkCode<T>(voucherCode: string, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/voucher/get-voucher-info',
		options: {
			method: 'post',
			data: {
				voucherCode,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}
