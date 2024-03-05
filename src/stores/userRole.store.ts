import { UserRole } from "@src/interfaces/UserRole"
import { STATE } from "@src/interfaces/enums"
import { action, flow, makeObservable, observable } from "mobx"
import RootStore from "./RootStore"
import { IApiResponse, IBodyError } from "@src/utils/request"
import * as userRoleServices from "@src/services/userRole.service"
import { ResponseType } from '@src/interfaces/dto/common.dto'
import HttpStatusCode from "@src/contains/HttpStatusCode"
import { DEFAULT_ERROR_MESSAGE } from "@src/contains/contants"


export type UserRoleHydration = {
	state?: STATE
	userRole?: UserRole[]
	detail?: any
	storesList?: any[]
	// pagination?: IPagination

	setUserRole?: (_userRole: UserRole[]) => void
	// setPagination?: (_data: IPagination) => void
}

export default class UserRoleStore {
    @observable state = STATE.PENDING
	@observable root: RootStore
	@observable userRole: Partial<UserRole[]> = []
	// @observable usersInfo: Partial<Users> = {}
	@observable detail: any = {}
	@observable storesList: Partial<any[]> = []
	@observable dashboard: number
	@observable hasEnd = false
    length: number

    constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

    @action setUserRole(_userRole: UserRole[]) {
		this.userRole = _userRole
	}

    @flow *createUserRole(params: UserRole) {
		this.state = STATE.PROCESSING
		try {
			// const token = this.root.authStore.token
			// if (!token) {
			// 	return {
			// 		errorCode: HttpStatusCode.UNAUTHORIZED,
			// 		message: UNAUTHORIZED_ERROR_MESSAGE,
			// 	}
			// }

			const res: IApiResponse<ResponseType<any>> = yield userRoleServices.createUserRole<IApiResponse<ResponseType<any>>>(
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
    @action hydrate(data?: UserRoleHydration) {
		if (data && data.userRole) {
			this.userRole = data.userRole
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