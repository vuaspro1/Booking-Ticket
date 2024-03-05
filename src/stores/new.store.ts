import { action, observable, makeObservable, computed, flow } from 'mobx'
import RootStore from './RootStore'
import * as newsServices from '@src/services/news.service'
import { STATE } from '@src/interfaces/enums'
import { Product } from '@src/interfaces/dto/product.dto'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import Config from '@src/contains/Config'
import { ListProductParams } from '@src/interfaces/Product'
import cloneDeep from 'lodash/cloneDeep'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { DEFAULT_ERROR_MESSAGE /*UNAUTHORIZED_ERROR_MESSAGE*/, DEFAULT_WAIT_SECONDS } from '@src/contains/contants'
import { IApiResponse, IBodyError } from '@src/utils/request'
import { clone } from 'lodash'
import { wait } from '@src/helpers/wait'

export type NewHydration = {
	state?: STATE
	news?: any[]
	detail?: any
	pagination?: IPagination

	setProducts?: (_products: Product[]) => void
	setPagination?: (_data: IPagination) => void
}
export default class NewStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@observable news: Partial<any[]> = []
	// @observable productInfo: Partial<Product> = {}
	@observable detail: any = {}
	@observable pagination: IPagination = {
		skip: 0,
		page: 1,
		limit: Config.PAGE_SIZE,
		totalPage: 0,
		total: 0,
		loadMore: false,
	}
	// @observable dashboard: number
	@observable hasEnd = false
	@observable params: Partial<any> = {
		skip: this.pagination.skip,
		limit: this.pagination.limit,
	}

	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

	@action setNews(_news: any[]) {
		this.news = _news
	}

	@action setDetail(_detail: Partial<any>) {
		const productInfoTemp = cloneDeep(this.detail)
		Object.assign(productInfoTemp, _detail)
		this.detail = productInfoTemp
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

	@flow *getListNews(params?: any) {
		this.root.loading = true
		this.state = STATE.PROCESSING
		try {
			const _params = Object.assign({}, params, {})
			const res: IApiResponse<ResponseType<any[]>> = yield newsServices.getListNewsTintuc(_params)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				const data: Product[] = res.data?.data || []
				this.caculateParams(res.data?.total || res.data?.dashboard.countProduct || 0)
				if (!this.pagination.loadMore) {
					this.news = data
					// this.dashboard = res.data?.dashboard?.sumInitPrice
				} else {
					this.news = [...this.news, ...data]
					// this.dashboard = res.data?.dashboard?.sumInitPrice
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

	@flow *getListNewsHealthCare() {
		this.root.loading = true
		this.state = STATE.PROCESSING
		try {
			// const _params = Object.assign({}, params, {})
			const res: IApiResponse<ResponseType<any[]>> = yield newsServices.getListNewsHealthCare(this.pagination.page)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK) {
				const data: any[] = res.data?.rows || []
				this.caculateParams(res.data?.total || res.data?.dashboard.countProduct || 0)
				if (!this.pagination.loadMore) {
					this.news = data
					// this.dashboard = res.data?.dashboard?.sumInitPrice
				} else {
					this.news = [...this.news, ...data]
					// this.dashboard = res.data?.dashboard?.sumInitPrice
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

	// @flow *getNewsInfo(productId: number) {
	// 	this.root.loading = true
	// 	this.state = STATE.PROCESSING
	// 	try {
	// 		const res = yield productServices.getProductsInfo<any>(productId)
	// 		this.state = STATE.DONE
	// 		this.root.loading = false
	// 		if (res.status === HttpStatusCode.OK && res.data) {
	// 			this.detail = res.data
	// 			return res.data
	// 		}
	// 		return res?.data
	// 	} catch (error) {
	// 		this.state = STATE.ERROR
	// 		this.root.loading = false
	// 		return {
	// 			errorCode: HttpStatusCode.UNKNOW_ERROR,
	// 			message: error.message,
	// 		}
	// 	}
	// }

	@action async loadMoreHealthCare() {
		this.root.loading = true
		if (this.pagination.totalPage >= this.pagination.page) {
			// const _params: any = {
			// 	...this.params,
			// 	skip: (this.pagination.skip + this.pagination.limit) * (this.pagination.page - 1),
			// 	limit: this.pagination.limit,
			// }
			await wait(DEFAULT_WAIT_SECONDS)
			this.getListNewsHealthCare()
		} else {
			this.hasEnd = true
		}
	}

	@action hydrate(data?: NewHydration) {
		if (data && data.news) {
			this.news = data.news
		}
		if (data && data.detail) {
			this.detail = data.detail
		}
		if (data && data.pagination) {
			const _pagination = cloneDeep(this.pagination)
			this.pagination = {
				..._pagination,
				...data.pagination,
				totalPage: Math.floor(((data.pagination?.total ?? 0) + _pagination.limit - 1) / _pagination.limit),
			}
		}
	}

	private caculateParams(total: number) {
		const _pagination = cloneDeep(this.pagination)
		this.pagination = {
			..._pagination,
			total,
			totalPage: Math.floor((total + _pagination.limit - 1) / _pagination.limit),
		}
	}
}
