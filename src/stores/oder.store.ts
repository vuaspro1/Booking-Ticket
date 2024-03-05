import { action, observable, makeObservable, flow, computed } from 'mobx'
import RootStore from './RootStore'
import { CUSTOMER_REPORT_TYPE, ORDER_STATUS, STATE } from '@src/interfaces/enums'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '@src/contains/contants'
import * as orderServices from '@src/services/order.service'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import { IApiResponse, IBodyError } from '@src/utils/request'
import cloneDeep from 'lodash/cloneDeep'
import Config from '@src/contains/Config'
import { CancelProviderOrderParams, ConfirmProviderOrderParams, ListProviderOrderParams } from '@src/interfaces/Provider'
import { OrderProvider, OrderProviderProduct } from '@src/interfaces/dto/orderProvider'
import { OrderProdviderResponseType } from '@src/interfaces/OrderProvider'
import { clone } from 'lodash'

export type OrderHydration = {
	state?: STATE
	orders: Partial<OrderProvider[]>
	order: Partial<OrderProvider>
	pagination?: IPagination

	setOrders?: (_orders: OrderProvider[]) => void
	setOrder?: (_order: OrderProvider) => void
	setPagination?: (_data: IPagination) => void
}
export default class OrderStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@observable orders: Partial<OrderProvider[]> = []
	@observable order: Partial<OrderProvider> = {}
	@observable pagination: IPagination = {
		skip: 0,
		page: 1,
		limit: Config.PAGE_SIZE,
		totalPage: 0,
		total: 0,
		loadMore: false,
	}
	@observable hasEnd = false
	@observable params: Partial<ListProviderOrderParams> = {
		status: ORDER_STATUS.PENDING,
		skip: this.pagination.skip,
		limit: this.pagination.limit,
	}
	@observable orderSaleReport = []
	@observable orderPointReport = []
	@observable orderInfo = {}

	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

	@action setOrders(_orders: OrderProvider[]) {
		this.orders = _orders
	}

	@action setParams(_data: ListProviderOrderParams) {
		const _params = cloneDeep(this.params)
		Object.assign(_params, _data)
		this.params = _params
	}

	@action setPagination(_data: IPagination) {
		const _pagination = cloneDeep(this.pagination)
		Object.assign(_pagination, _data)
		this.pagination = _pagination
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

	@action setOrder(_order: OrderProvider) {
		this.order = _order
	}

	@computed get isChangeParams() {
		return this.params
	}

	@computed get isChangePagination() {
		return {
			page: this.pagination.page,
			limit: this.pagination.limit,
		}
	}

	@flow *getListOrders(params: ListProviderOrderParams) {
		this.root.loading = true
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const _params = Object.assign({}, params, {})
			const res: IApiResponse<ResponseType<OrderProvider[]>> = yield orderServices.getListProviderOrder(_params, token)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				const data: OrderProvider[] = res.data?.data || []
				this.caculateParams(res.data?.total || 0)
				if (!this.pagination.loadMore) {
					this.orders = data
				} else {
					this.orders = [...this.orders, ...data]
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

	@action async loadMore() {
		this.root.loading = true
		if (this.pagination.totalPage >= this.pagination.page) {
			const _params: ListProviderOrderParams = {
				...this.params,
				status: this.params.status,
				skip: (this.pagination.skip + this.pagination.limit) * (this.pagination.page - 1),
				limit: this.pagination.limit,
			}
			// await wait(DEFAULT_WAIT_SECONDS)
			this.getListOrders(_params)
		} else {
			this.hasEnd = true
		}
	}

	@flow *getOrderProvider(orderId: number) {
		this.root.loading = true
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<OrderProdviderResponseType<OrderProviderProduct[]>> = yield orderServices.getProviderOrder(
				orderId,
				token
			)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				this.order = Object.assign(this.order, {
					products: res?.data?.data,
					rate: res?.data.rate,
				})
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

	@flow *confirmProviderOrder(params: ConfirmProviderOrderParams) {
		this.root.loading = true
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			// const _params = Object.assign(params, {
			// 	type: CUSTOMER_REPORT_TYPE.POINT_REPORT,
			// })
			const res: IApiResponse<ResponseType<any>> = yield orderServices.confirmProviderOrder(params, token)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
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

	@flow *cancelProviderOrder(params: CancelProviderOrderParams) {
		this.root.loading = true
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const _params = Object.assign(params, {
				type: CUSTOMER_REPORT_TYPE.POINT_REPORT,
			})
			const res: IApiResponse<ResponseType<any>> = yield orderServices.cancelProviderOrder(_params, token)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
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

	@action hydrate(data?: OrderHydration) {
		if (data && data.orders) {
			this.orders = data.orders
		}
		if (data && data.order) {
			this.order = data.order
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
