import { CreateCardParms, ListCardParams } from '@src/interfaces/dto/card.dto'
import request, { IApiResponse } from '@src/utils/request'

export function createCard<T>(data: CreateCardParms, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/card/create-card-code',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

/* export function getCard<T>(data: CardParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/inventory-store/update-card',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
} */

/* export function deleteCard<T>(cardId: number, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/inventory-store/delete-card-in-store',
		options: {
			method: 'post',
			data: {
				cardId,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
} */

export function getListCards<T>(data: ListCardParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/card/get-list-card-default',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function setCardImageDefault<T>(cardDefaultId: number, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/card/image',
		options: {
			method: 'post',
			data: {
				cardDefaultId,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}
