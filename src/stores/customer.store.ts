import { action, observable, makeObservable, flow, computed } from 'mobx'
import RootStore from './RootStore'
import { CUSTOMER_REPORT_TYPE, STATE } from '@src/interfaces/enums'
import { Customer, CustomerPointReport, CustomerSaleReport } from '@src/interfaces/dto/customer.dto'
import {
	CustomerParams,
	CustomerReportParams,
	CustomerReportResponseType,
	ListCustomerParams,
} from '@src/interfaces/Customer'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '@src/contains/contants'
import * as customerServices from '@src/services/customer.service'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import { IApiResponse, IBodyError } from '@src/utils/request'
import cloneDeep from 'lodash/cloneDeep'
import Config from '@src/contains/Config'
import { clone, omit } from 'lodash'

export type CustomerHydration = {
	state?: STATE
	customers: Customer[]
	pagination?: IPagination

	setCustomers?: (_customers: Customer[]) => void
	setPagination?: (_data: IPagination) => void
}
export default class CustomerStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@observable customers: Partial<Customer[]> = []
	@observable numberOfCustomers: number
	@observable pagination: IPagination = {
		skip: 0,
		page: 1,
		limit: Config.PAGE_SIZE,
		totalPage: 0,
		total: 0,
		loadMore: false,
	}
	@observable hasEnd = false
	@observable params: Partial<ListCustomerParams> = {
		skip: this.pagination.skip,
		limit: this.pagination.limit,
	}
	@observable customerSaleReport: CustomerSaleReport[] = []
	@observable customerPointReport: CustomerPointReport[] = []
	@observable customerInfo: Partial<Customer> = {}
	@observable tokenUsedPoint = null

	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

	@action setCustomers(_customers: Customer[]) {
		this.customers = _customers
	}
	@action setCustomerInfoNull() {
		this.customerInfo = {}
	}

	@action setParams(_data: Partial<ListCustomerParams>) {
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

	@flow *createCustomer(params: CustomerParams) {
		this.state = STATE.PROCESSING
		try {
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<any> | IBodyError> = yield customerServices.createCustomer<
				IApiResponse<ResponseType<any>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK) {
				return res.data
			}
			return {
				errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
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

	@flow *getListCustomers(params: ListCustomerParams) {
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
			const _params = Object.assign({}, params, {})
			const res: IApiResponse<ResponseType<Customer[]>> = yield customerServices.getListCustomers(_params)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data) {
				const data: Customer[] = res.data?.rows || []
				this.caculateParams(res.data?.total || 0)
				if (!this.pagination.loadMore) {
					this.customers = data
					// this.numberOfCustomers = res.data?.countCustomer
				} else {
					this.customers = [...this.customers, ...data]
					// this.numberOfCustomers = res.data?.countCustomer
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
			const _params: ListCustomerParams = {
				...this.params,
				skip: (this.pagination.skip + this.pagination.limit) * (this.pagination.page - 1),
				limit: this.pagination.limit,
			}
			// await wait(DEFAULT_WAIT_SECONDS)
			this.getListCustomers(_params)
		} else {
			this.hasEnd = true
		}
	}

	@flow *getCustomerSaleReport(params: CustomerReportParams) {
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
				type: CUSTOMER_REPORT_TYPE.SALE_REPORT,
			})
			const res: IApiResponse<CustomerReportResponseType<CustomerSaleReport[]>> = yield customerServices.getCustomerReport(
				_params,
				token
			)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				this.customerSaleReport = res.data?.data || []
				this.customerInfo = Object.assign(this.customerInfo, {
					...omit(res?.data, 'code,message,data'),
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

	@flow *getCustomerPointReport(params: CustomerReportParams) {
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
			const res: IApiResponse<CustomerReportResponseType<CustomerPointReport[]>> = yield customerServices.getCustomerReport(
				_params,
				token
			)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				this.customerPointReport = res.data?.data || []
				this.customerInfo = Object.assign(this.customerInfo, {
					...omit(res?.data, 'code,message,data'),
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

	@flow *findCustomer(phone: string) {
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
			const res: IApiResponse<CustomerReportResponseType<Customer[]>> = yield customerServices.findCustomer(phone, token)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				this.tokenUsedPoint = res.data?.token
				const _cusInfo = {
					...(res?.data?.data && res?.data?.data.length > 0 ? res?.data?.data[0] : {}),
					availablePoint: res?.data?.point || 0,
				}
				this.customerInfo = {
					...this.customerInfo,
					..._cusInfo,
					phone,
				}
				// if (
				// 	typeof res.data?.token == 'string' &&
				// 	(typeof this.customerInfo.phone != 'string' || this.customerInfo.phone == '')
				// ) {
				// 	this.customerInfo = {
				// 		...this.customerInfo,
				// 		..._cusInfo,
				// 		phone,
				// 	}
				// } else {
				// 	this.customerInfo = {
				// 		...this.customerInfo,
				// 		..._cusInfo,
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

	@action hydrate(data?: CustomerHydration) {
		if (data && data.customers) {
			this.customers = data.customers
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
