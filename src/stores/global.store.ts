import { action, observable, makeObservable, flow } from 'mobx'
import RootStore from './RootStore'
// import * as globalServices from '@src/services/global.service'
import { STATE } from '@src/interfaces/enums'
import { CalculateParams, CreateOrderParams, RegisterLandingPageParams } from '@src/interfaces/Global'
import { IApiResponse, IBodyError } from '@src/utils/request'
import { ResponseType } from '@src/interfaces/dto/common.dto'
import * as globalServices from '@src/services/global.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { DEFAULT_ERROR_MESSAGE } from '@src/contains/contants'

export type GlobalHydration = {
	state?: STATE
	homeContent?: any
	introductionContent?: any
	healthCareContent?: any
	company?: any[]
}
export default class GlobalStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@observable homeContent: Partial<any> = {}
	@observable introductionContent: Partial<any> = {}
	@observable healthCareContent: Partial<any> = {}
	@observable company: Partial<any>[] = []
	@observable calculatePriceInfo: Partial<any> = {}

	@observable openLogin: Partial<boolean> = false
	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

	@action setOpenLogin(_data: boolean) {
		this.openLogin = _data
	}

	@action setCalculatePriceInfoNull() {
		this.calculatePriceInfo = {}
	}

	@flow *registerLandingPage(params: RegisterLandingPageParams) {
		this.state = STATE.PROCESSING
		try {
			const res: IApiResponse<ResponseType<any>> = yield globalServices.registerLandingPage<IApiResponse<ResponseType<any>>>(
				params
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

	@flow *calculatePrice(params: CalculateParams) {
		this.calculatePriceInfo = {}
		this.state = STATE.PROCESSING
		try {
			const res: IApiResponse<ResponseType<any>> = yield globalServices.calculatePrice<IApiResponse<ResponseType<any>>>(
				params
			)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				this.calculatePriceInfo = res.data.data
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

	@flow *createOrder(params: CreateOrderParams) {
		this.state = STATE.PROCESSING
		try {
			const res: IApiResponse<ResponseType<any>> = yield globalServices.createOrder<IApiResponse<ResponseType<any>>>(params)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				this.calculatePriceInfo = {}
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

	@flow *getListCompany() {
		this.state = STATE.PROCESSING
		try {
			const res: IApiResponse<ResponseType<any>> = yield globalServices.getListCompany<IApiResponse<ResponseType<any>>>()
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				this.company = res.data.data?.push({ id: 0, name: 'Khác' })
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

	@action hydrate(data?: GlobalHydration) {
		if (data && data.homeContent) {
			this.homeContent = data.homeContent
		}
		if (data && data.introductionContent) {
			this.introductionContent = data.introductionContent
		}
		if (data && data.healthCareContent) {
			this.healthCareContent = data.healthCareContent
		}
		if (data && data.company) {
			this.company = data.company
		}
		/* if (data && data.callLogs) {
	  this.callLogs = data.callLogs
	} */
	}
}
