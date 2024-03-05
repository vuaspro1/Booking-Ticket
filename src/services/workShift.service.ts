import { CashOutParams } from '@src/interfaces/dto/workShift.dto'
import request, { IApiResponse } from '@src/utils/request'

export function getWorkShift<T>(token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/appuser/shift-info',
		options: {
			method: 'post',
			data: {},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function cashOut<T>(data: CashOutParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/appuser/cashout-store',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}
