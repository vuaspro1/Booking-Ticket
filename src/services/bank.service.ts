import { CreateBankParams, ListBankComonParams, ListBankParams, UpdateBankParams } from '@src/interfaces/Bank'
import request, { IApiResponse } from '@src/utils/request'

export function createBank<T>(data: CreateBankParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/bank/bank-user/create-user-bank-info',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function updateBank<T>(data: UpdateBankParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/bank/bank-user/update-user-bank',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function deleteBank<T>(userBankId: number, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/bank/bank-user/delete-user-bank',
		options: {
			method: 'post',
			data: {
				userBankId,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getListBanks<T>(data: ListBankParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/bank/bank-user/get-user-bank-info',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getListCommonBanks<T>(data: ListBankComonParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/bank/get-bank-info',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}
