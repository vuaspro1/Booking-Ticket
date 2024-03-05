import { action, observable, makeObservable, computed, flow } from 'mobx'
import RootStore from './RootStore'
import * as voucherServices from '@src/services/voucher.service'
import { STATE } from '@src/interfaces/enums'
import { CodeInfo, Voucher } from '@src/interfaces/dto/voucher.dto'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import Config from '@src/contains/Config'
import { ListVoucherParams, VoucherParams } from '@src/interfaces/Voucher'
import { clone, cloneDeep } from 'lodash'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '@src/contains/contants'
import { IApiResponse, IBodyError } from '@src/utils/request'

export type VoucherHydration = {
	state?: STATE
	vouchers: Voucher[]
	voucherInfo: Voucher
	pagination?: IPagination
	codeInfo?: Partial<CodeInfo>

	setVoucherInfo: (_data: Voucher) => void
	setProducts?: (_products: Voucher[]) => void
	setPagination?: (_data: IPagination) => void
	setCodeInfo?: (_codeInfo: CodeInfo) => void
}
export default class VoucherStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@observable vouchers: Partial<Voucher[]> = []
	@observable voucherInfo: Partial<Voucher> = {}
	@observable codeInfo: Partial<CodeInfo> = {}
	@observable pagination: IPagination = {
		skip: 0,
		page: 1,
		limit: Config.PAGE_SIZE,
		totalPage: 0,
		total: 0,
		loadMore: false,
	}
	@observable hasEnd = false
	@observable params: Partial<ListVoucherParams> = {
		skip: this.pagination.skip,
		limit: this.pagination.limit,
	}

	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

	@action setVouchers(_vouchers: Voucher[]) {
		this.vouchers = _vouchers
	}

	@action setVoucherInfo(_voucherInfo: Partial<Voucher>) {
		if (!!_voucherInfo && _voucherInfo.constructor === Object && Object.keys(_voucherInfo).length === 0) {
			this.voucherInfo = {}
		} else {
			const voucherTemp = cloneDeep(this.voucherInfo)
			Object.assign(voucherTemp, _voucherInfo)
			this.voucherInfo = voucherTemp
		}
	}

	@action setCodeInfo(_codeInfo: CodeInfo) {
		this.codeInfo = _codeInfo
	}

	@action setCodeInfoNull() {
		this.codeInfo = {}
	}

	@action setParams(_data: ListVoucherParams) {
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

	@flow *createVoucher(params: VoucherParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<any>> = yield voucherServices.createVoucher<IApiResponse<ResponseType<any>>>(
				params,
				token
			)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
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

	@flow *updateVoucher(params: VoucherParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<any>> = yield voucherServices.updateVoucher<IApiResponse<ResponseType<any>>>(
				params,
				token
			)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
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

	/* @flow *deleteVoucher(voucherId: number) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<any>> = yield voucherServices.deleteVoucher<IApiResponse<ResponseType<any>>>(
				voucherId,
				token
			)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
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
	} */

	@flow *getVoucher(voucherId: string) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<Voucher>> = yield voucherServices.getVoucher<IApiResponse<ResponseType<Voucher>>>(
				voucherId,
				token
			)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				this.voucherInfo = res.data.data
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

	@flow *checkCode(voucherCode: string) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<CodeInfo>> = yield voucherServices.checkCode<
				IApiResponse<ResponseType<CodeInfo>>
			>(voucherCode, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				this.codeInfo = res.data.data
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

	@flow *getListVouchers(params: ListVoucherParams) {
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
			const res: IApiResponse<ResponseType<Voucher[]>> = yield voucherServices.getListVouchers(_params, token)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				const data: Voucher[] = res.data?.data || []
				this.caculateParams(res.data?.total || 0)
				if (!this.pagination.loadMore) {
					this.vouchers = data
				} else {
					this.vouchers = [...this.vouchers, ...data]
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
			const _params: ListVoucherParams = {
				...this.params,
				skip: (this.pagination.skip + this.pagination.limit) * (this.pagination.page - 1),
				limit: this.pagination.limit,
			}
			// await wait(DEFAULT_WAIT_SECONDS)
			this.getListVouchers(_params)
		} else {
			this.hasEnd = true
		}
	}

	@action hydrate(data?: VoucherHydration) {
		if (data && data.vouchers) {
			this.vouchers = data.vouchers
		}
		if (data && data.codeInfo) {
			this.codeInfo = data.codeInfo
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
