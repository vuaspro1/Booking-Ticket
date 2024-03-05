import { IFindUser, IUserPost, IUserPut } from '@src/interfaces/Users'
import request, { IApiResponse } from '@src/utils/request'

export function getListUsers<T>(page: any) {
	return request<T>({
		url: `api/User?page=${page}&pageSize=8`,
		options: {
			method: 'get',
			headers: {
			},
		},
	})
}

export function createUser<T>(data: IUserPost): Promise<IApiResponse<T>> {
	return request<T>({
		url: 'api/User',
		options: {
			method: 'post',
			data,
			headers: {
				
			},
		},
	})
}

export function findUser<T>(params: IFindUser, page: any): Promise<IApiResponse<T>> {
	return request<T>({
		url: `api/User/${params}/users?page=${page}&pageSize=8`,
		options: {
			method: 'get',
			headers: {
				
			},
		},
	})
}

export function updateUser<T>(params: any, data:  IUserPut): Promise<IApiResponse<T>> {
	return request<T>({
		url: `api/User/${params}`,
		options: {
			method: 'put',
			data,
			headers: {
				
			},
		},
	})
}

export function deleteUser<T>(params:any): Promise<IApiResponse<T>>{
	return request<T>({
		url: `api/User/${params}`,
		options: {
			method: 'delete',
			headers: {
			},
		},
	})
}

export function login<T>(userName: string, password: string): Promise<IApiResponse<T>> {
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
		url: 'api/Login/Login',
		options: {
			method: 'post',
			headers: {
			},
			data: {
				userName,
				password,
			},
		},
	})
}