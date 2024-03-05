import { Role } from "@src/interfaces/Role"
import { STATE } from "@src/interfaces/enums"
import { action, flow, makeObservable, observable } from "mobx"
import RootStore from "./RootStore"
import { IApiResponse, IBodyError } from "@src/utils/request"
import { ResponseType } from '@src/interfaces/dto/common.dto'
import HttpStatusCode from "@src/contains/HttpStatusCode"
import * as roleServices from '@src/services/role.service'
import { DEFAULT_ERROR_MESSAGE } from "@src/contains/contants"

export type RoleHydration = {
	state?: STATE
	roles?: Role[]
	detail?: any
	storesList?: any[]
	// pagination?: IPagination

	setRoles?: (_roles: Role[]) => void
	// setPagination?: (_data: IPagination) => void
}

export default class RoleStore {
    @observable state = STATE.PENDING
	@observable root: RootStore
	@observable roles: Partial<Role[]> = []
	// @observable usersInfo: Partial<Users> = {}
	@observable detail: any = {}
	@observable storesList: Partial<any[]> = []
	@observable dashboard: number
	@observable hasEnd = false
    length: number
    // map: any

    constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

    @action setRoles(_roles: Role[]) {
		this.roles = _roles
	}

    @flow *getListRoles() {
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
			const res: IApiResponse<ResponseType<Role[]>> = yield roleServices.getListRoles()
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK) {
                // console.log(res.data.data,121521);
                this.roles = res.data.data
				// const data: Users[] = res.data?.data || []
				// this.caculateParams(res.data?.total || res.data?.dashboard.countProduct || 0)
				// if (!this.pagination.loadMore) {
					// this.products = data
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

    @action hydrate(data?: RoleHydration) {
		if (data && data.roles) {
			this.roles = data.roles
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