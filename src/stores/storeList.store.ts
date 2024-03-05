import { action, observable, makeObservable, computed, flow } from 'mobx'
import RootStore from './RootStore'
import * as storesListServices from '@src/services/storeList.service'
import { STATE } from '@src/interfaces/enums'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import Config from '@src/contains/Config'
import { ListProductParams } from '@src/interfaces/Product'
import cloneDeep from 'lodash/cloneDeep'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { DEFAULT_ERROR_MESSAGE } from '@src/contains/contants'
import { IApiResponse, IBodyError } from '@src/utils/request'
import { clone } from 'lodash'
// import { wait } from '@src/helpers/wait'

export type StoreListHydration = {
	state?: STATE
	storesList?: any[]
	pharmacies?: any[]
	pagination?: IPagination
	setPagination?: (_data: IPagination) => void
}
export default class StoreListStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@observable storesList: Partial<any[]> = []
	@observable pharmacies: Partial<any[]> = []
	@observable pagination: IPagination = {
		skip: 0,
		page: 1,
		limit: Config.PAGE_SIZE,
		totalPage: 0,
		total: 0,
		loadMore: false,
	}
	@observable dashboard: number
	@observable hasEnd = false
	@observable params: Partial<ListProductParams> = {
		skip: this.pagination.skip,
		limit: this.pagination.limit,
	}

	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

	@action setParams(_data: ListProductParams) {
		const _params = cloneDeep(this.params)
		Object.assign(_params, _data)
		this.params = _params
	}

	@computed get isChangePagination() {
		return {
			page: this.pagination.page,
			limit: this.pagination.limit,
		}
	}

	@action setPage(page: number) {
		const _pagination = clone(this.pagination)
		Object.assign(_pagination, {
			page: page,
		})
		this.pagination = _pagination
	}

	@action setLimit(limit: number) {
		const _pagination = clone(this.pagination)
		Object.assign(_pagination, {
			limit,
		})
		this.pagination = _pagination
	}

	@action setPagination(_data: IPagination) {
		const _pagination = cloneDeep(this.pagination)
		Object.assign(_pagination, _data)
		this.pagination = _pagination
	}

	@computed get isChangeParams() {
		return this.params
	}

	@flow *getStoreList(params?: any) {
		this.root.loading = true
		this.state = STATE.PROCESSING
		try {
			const _params = Object.assign({}, params, {})
			const res: IApiResponse<ResponseType<any[]>> = yield storesListServices.getStores(_params)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				const data: any[] = res.data?.data || []
				// this.caculateParams(res.data?.total || res.data?.dashboard.countProduct || 0)
				if (!this.pagination.loadMore) {
					this.storesList = data
				} else {
					this.storesList = [...this.storesList, ...data]
				}
				if (res.data?.data?.length == 0) {
					if (this.hasEnd == false) {
						this.hasEnd = true
					}
				}
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

	// @action async loadMore() {
	// 	this.root.loading = true
	// 	if (this.pagination.totalPage >= this.pagination.page) {
	// 		const _params: ListProductParams = {
	// 			...this.params,
	// 			skip: (this.pagination.skip + this.pagination.limit) * (this.pagination.page - 1),
	// 			limit: this.pagination.limit,
	// 		}
	// 		// await wait(DEFAULT_WAIT_SECONDS)
	// 		this.getListProducts(_params)
	// 	} else {
	// 		this.hasEnd = true
	// 	}
	// }

	@action hydrate(data?: StoreListHydration) {
		if (data && data.storesList) {
			this.storesList = data.storesList
		}
		if (data && data.pharmacies) {
			this.pharmacies = data.pharmacies
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

	// private caculateParams(total: number) {
	// 	const _pagination = cloneDeep(this.pagination)
	// 	this.pagination = {
	// 		..._pagination,
	// 		total,
	// 		totalPage: Math.floor((total + _pagination.limit - 1) / _pagination.limit),
	// 	}
	// }
}
