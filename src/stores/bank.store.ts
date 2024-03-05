import { action, observable, makeObservable, flow, computed } from 'mobx'
import RootStore from './RootStore'
import { STATE } from '@src/interfaces/enums'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '@src/contains/contants'
import * as bankServices from '@src/services/bank.service'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import { IApiResponse, IBodyError } from '@src/utils/request'
import cloneDeep from 'lodash/cloneDeep'
import Config from '@src/contains/Config'
import { CreateBankParams, ListBankComonParams, ListBankParams, UpdateBankParams } from '@src/interfaces/Bank'
import { Bank, BankCommon } from '@src/interfaces/dto/bank.dto'

export type BankHydration = {
	state?: STATE
	banks: Bank[]
	bankCommons: Partial<BankCommon[]>
	pagination?: IPagination

	setBanks?: (_banks: Bank[]) => void
	setBankCommons?: (_bankCommons: BankCommon[]) => void
	setPagination?: (_data: IPagination) => void
}
export default class BankStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@observable banks: Partial<Bank[]> = []
	@observable bankCommons: Partial<BankCommon[]> = []
	@observable pagination: IPagination = {
		skip: 0,
		page: 1,
		limit: Config.PAGE_SIZE,
		totalPage: 0,
		total: 0,
		loadMore: false,
	}
	@observable hasEnd = false
	@observable params: Partial<ListBankParams> = {
		skip: this.pagination.skip,
		limit: this.pagination.limit,
	}
	@observable bankSaleReport = []
	@observable bankPointReport = []
	@observable bankInfo = {}

	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

	@action setBanks(_banks: Bank[]) {
		this.banks = _banks
	}

	@action setBankCommons(_bankCommons: BankCommon[]) {
		this.bankCommons = _bankCommons
	}

	@action setParams(_data: ListBankParams) {
		const _params = cloneDeep(this.params)
		Object.assign(_params, _data)
		this.params = _params
	}

	@action setPagination(_data: IPagination) {
		const _pagination = cloneDeep(this.pagination)
		Object.assign(_pagination, _data)
		this.pagination = _pagination
	}

	@computed get isChangeParams() {
		return this.params
	}

	@flow *createBank(params: CreateBankParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<any>> = yield bankServices.createBank<IApiResponse<ResponseType<any>>>(
				params,
				token
			)
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

	@flow *getListBanks(params: ListBankParams) {
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
			const res: IApiResponse<ResponseType<Bank[]>> = yield bankServices.getListBanks(_params, token)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				const data: Bank[] = res.data?.data || []
				this.caculateParams(res.data?.total || 0)
				if (!this.pagination.loadMore) {
					this.banks = data
				} else {
					this.banks = [...this.banks, ...data]
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
			const _params: ListBankParams = {
				...this.params,
				skip: (this.pagination.skip + this.pagination.limit) * (this.pagination.page - 1),
				limit: this.pagination.limit,
			}
			// await wait(DEFAULT_WAIT_SECONDS)
			this.getListBanks(_params)
		} else {
			this.hasEnd = true
		}
	}

	@flow *updateBank(params: UpdateBankParams) {
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
			const res: IApiResponse<ResponseType<any>> = yield bankServices.updateBank(params, token)
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

	@flow *deleteBank(userBankId: number) {
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
			const res: IApiResponse<ResponseType<any>> = yield bankServices.deleteBank(userBankId, token)
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

	@flow *getListBankComons(params: ListBankComonParams) {
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
			const res: IApiResponse<ResponseType<BankCommon[]>> = yield bankServices.getListCommonBanks(_params, token)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				const data: BankCommon[] = res.data?.data || []
				this.bankCommons = data
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

	@action hydrate(data?: BankHydration) {
		if (data && data.banks) {
			this.banks = data.banks
		}
		if (data && data.bankCommons) {
			this.bankCommons = data.bankCommons
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
