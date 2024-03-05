import { UpdateCustomerParams, UpdateInfoParams } from '@src/interfaces/dto/user.dto'
import { ChangePasswordParams, RechargePointParams, WithDrawPointParams, RegisterUserInfo } from '@src/interfaces/User'
import request, { IApiResponse } from '@src/utils/request'
// import { nanoid } from 'nanoid'

export function getCustomerInfo<T>(token: string) {
	return request<T>({
		url: '/store/get-point-info',
		options: {
			method: 'post',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function getCustomerInfo2<T>(token: string) {
	return request<T>({
		url: '/appuser/get-info',
		options: {
			method: 'post',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function uploadAvatar<T>(file: File, token: string) {
	const data = new FormData()
	data.append('files', file)
	data.append('path', '/uploads/users')
	return request<T>({
		url: 'fm/upload',
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

export function getInfo<T>(token: string) {
	return request<T>({
		url: 'api/v1/accounts/me',
		options: {
			method: 'get',
			headers: {
				version: 'webmediaone',
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function updateInfo<T>(data: UpdateInfoParams, token: string) {
	return request<T>({
		url: 'api/v1/accounts/update-me',
		options: {
			method: 'put',
			data,
			headers: {
				'Content-Type': 'application/json',
				version: 'webmediaone',
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function updateCustomer<T>(data: UpdateCustomerParams, token: string) {
	return request<T>({
		url: '/appuser/update-info',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function login<T>(email: string, password: string): Promise<IApiResponse<T>> {
	// if (email == 'admin' && password == 'admin') {
	// 	return Promise.resolve<any>({
	// 		data: {
	// 			code: 0,
	// 			data: {
	// 				token: 'e74187bfdce9a5dcd55f43cb8a9727041981897e9254b4e28e', // crypto.randomBytes(25).toString('hex'),
	// 				data: {
	// 					id: nanoid(10),
	// 					name: 'admin',
	// 					phone: '',
	// 					username: 'admin',
	// 					roles: 'admin',
	// 					agent: 'admin',
	// 					secure: '', // helper.encrypt('tnCYy9&xX'),
	// 				},
	// 			},
	// 		},
	// 		status: 200,
	// 	})
	// }
	return request<T>({
		url: 'api/v1/accounts/login',
		options: {
			method: 'post',
			headers: {
				version: 'webmediaone',
			},
			data: {
				email,
				password,
			},
		},
	})
}
export function registerUser<T>(data: RegisterUserInfo) {
	return request<T>({
		url: 'api/v1/accounts/register',
		options: {
			method: 'post',
			data,
			headers: {
				version: 'webmediaone',
			},
		},
	})
}
export function verify<T>(token: string) {
	return request<T>({
		url: 'api/v1/accounts/verify',
		options: {
			method: 'post',
			data: {
				token,
			},
			headers: {
				version: 'webmediaone',
			},
		},
	})
}
export function changePassword<T>(data: ChangePasswordParams, token: string) {
	return request<T>({
		url: '/appuser/change-password',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function reChargePoint<T>(data: RechargePointParams, token: string) {
	return request<T>({
		url: '/appuser/topup-point',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}

export function withDrawPoint<T>(data: WithDrawPointParams, token: string) {
	return request<T>({
		url: '/appuser/withdraw-point',
		options: {
			method: 'post',
			data,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	})
}
