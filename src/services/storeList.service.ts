// import request, { IApiResponse } from '@src/utils/requestDemo'
import request, { IApiResponse } from '@src/utils/request'
import { stringify } from 'qs'

export function getStores<T>(data: any): Promise<IApiResponse<T>> {
	return request<T>({
		url: `api/v1/stores/find-stores?${stringify(data)}`,
		options: {
			method: 'get',
			data,
			headers: {
				version: 'webmediaone',
			},
		},
	})
}

export function getPharmacies<T>(data: any): Promise<IApiResponse<T>> {
	return request<T>({
		url: `api/v1/storePharmacy/find?${stringify(data)}`,
		options: {
			method: 'get',
			data,
			headers: {
				version: 'webmediaone',
			},
		},
	})
}
