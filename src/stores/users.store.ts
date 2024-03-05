/* eslint-disable @typescript-eslint/no-unused-vars */
import { IUserPost, IUserPut, Users } from "@src/interfaces/Users"
import { STATE } from "@src/interfaces/enums"
import { action, flow, makeObservable, observable } from "mobx"
import RootStore from "./RootStore"
import { IApiResponse, IBodyError } from "@src/utils/request"
import * as usersServices from '@src/services/users.service'
import HttpStatusCode from "@src/contains/HttpStatusCode"
import { ResponseType } from '@src/interfaces/dto/common.dto'
import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from "@src/contains/contants"
import { PaginationParams } from "@src/interfaces/Pagination"


export type UsersHydration = {
	state?: STATE
	users?: Users[]
	detail?: any
	storesList?: any[]
	// pagination?: IPagination

	setUsers?: (_users: Users[]) => void
	// setPagination?: (_data: IPagination) => void
}

export default class UserStore {
    @observable state = STATE.PENDING
	@observable root: RootStore
	@observable users: Partial<Users[]> = []
	// @observable usersInfo: Partial<Users> = {}
	@observable detail: any = {}
	@observable storesList: Partial<any[]> = []
	@observable dashboard: number
	@observable hasEnd = false
	@observable pagination: PaginationParams = {
		page: 1,
	}
    length: number

    constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

    @action setUsers(_users: Users[]) {
		this.users = _users
		
	}

	@flow *createUser(params: IUserPost) {
		this.state = STATE.PROCESSING
		try {
			// const token = this.root.authStore.token
			// if (!token) {
			// 	return {
			// 		errorCode: HttpStatusCode.UNAUTHORIZED,
			// 		message: UNAUTHORIZED_ERROR_MESSAGE,
			// 	}
			// }
			const res: IApiResponse<ResponseType<any>> = yield usersServices.createUser<IApiResponse<ResponseType<any>>>(
				params
			)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK) {
				return res.data
			}
			return {
				errorCode: res.data?.code || (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

    @flow *getListUsers(page?: any) {
		this.root.loading = true
		this.state = STATE.PROCESSING
		try {
			// const token = this.root.authStore.token
			// if (!token) {
			// 	return {
			// 		errorCode: HttpStatusCode.UNAUTHORIZED,
			// 		message: UNAUTHORIZED_ERROR_MESSAGE,
			// 	}
			// }
			const res: IApiResponse<ResponseType<Users[]>> = yield usersServices.getListUsers(page)
			this.state = STATE.DONE
			this.root.loading = false
			// console.log(res,'test');
			
			if (res.status === HttpStatusCode.OK ) {
				
				const data: any[] = res.data?.data || []
				// this.caculateParams(res.data?.total || res.data?.dashboard.countProduct || 0)
				// if (!this.pagination.loadMore) {
					this.users = data
				// 	this.dashboard = res.data?.dashboard?.sumInitPrice
				// } else {
				// 	this.products = [...this.products, ...data]
				// 	this.dashboard = res.data?.dashboard?.sumInitPrice
				// }
				// if (res.data?.data?.length == 0) {
				// 	if (this.hasEnd == false) {
				// 		this.hasEnd = true
				// 	}
				// }
				return res.data
			}
			return {
				errorCode: res.data?.code || (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			this.root.loading = false
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	@flow *findUsers(params, page) {
		this.root.loading = true
		this.state = STATE.PROCESSING
		try {
			// const token = this.root.authStore.token
			// if (!token) {
			// 	return {
			// 		errorCode: HttpStatusCode.UNAUTHORIZED,
			// 		message: UNAUTHORIZED_ERROR_MESSAGE,
			// 	}
			// }
			const res: IApiResponse<ResponseType<Users[]>> = yield usersServices.findUser(params, page)
			this.state = STATE.DONE
			this.root.loading = false
			// console.log(res,'test');
			
			if (res.status === HttpStatusCode.OK ) {
				
				const data: any[] = res.data?.data || []
				// this.caculateParams(res.data?.total || res.data?.dashboard.countProduct || 0)
				// if (!this.pagination.loadMore) {
					this.users = data
				// 	this.dashboard = res.data?.dashboard?.sumInitPrice
				// } else {
				// 	this.products = [...this.products, ...data]
				// 	this.dashboard = res.data?.dashboard?.sumInitPrice
				// }
				// if (res.data?.data?.length == 0) {
				// 	if (this.hasEnd == false) {
				// 		this.hasEnd = true
				// 	}
				// }
				return res.data
			}
			return {
				errorCode: res.data?.code || (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			this.root.loading = false
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	@flow *updateUser( params: any, data: IUserPut) {
		this.state = STATE.PROCESSING
		try {
			// const token = this.root.authStore.token
			// if (!token) {
			// 	return {
			// 		errorCode: HttpStatusCode.UNAUTHORIZED,
			// 		message: UNAUTHORIZED_ERROR_MESSAGE,
			// 	}
			// }
			const res: IApiResponse<ResponseType<any>> = yield usersServices.updateUser<IApiResponse<ResponseType<any>>>(
				params, data
			)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK) {
				const data: any[] = res.data?.data || []
				this.users = data
				return res.data
			}
			return {
				errorCode: res.data?.code || (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	@flow *deleteUser( params: any) {
		this.state = STATE.PROCESSING
		try {
			// const token = this.root.authStore.token
			// if (!token) {
			// 	return {
			// 		errorCode: HttpStatusCode.UNAUTHORIZED,
			// 		message: UNAUTHORIZED_ERROR_MESSAGE,
			// 	}
			// }
			const res: IApiResponse<ResponseType<any>> = yield usersServices.deleteUser<IApiResponse<ResponseType<any>>>(
				params
			)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK) {
				const data: any[] = res.data?.data || []
				this.users = data
				return res.data
			}
			return {
				errorCode: res.data?.code || (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

    @action hydrate(data?: UsersHydration) {
		if (data && data.users) {
			this.users = data.users
		}
		if (data && data.storesList) {
			this.storesList = data.storesList
		}
		if (data && data.detail) {
			this.detail = data.detail
		}
		// if (data && data.pagination) {
		// 	const _pagination = cloneDeep(this.pagination)
		// 	this.pagination = {
		// 		..._pagination,
		// 		...data.pagination,
		// 		totalPage: Math.floor(((data.pagination?.total ?? 0) + _pagination.limit - 1) / _pagination.limit),
		// 	}
		// }
	}
}