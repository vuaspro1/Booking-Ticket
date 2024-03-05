import { action, observable, makeObservable, flow } from 'mobx'
import RootStore from './RootStore'
import * as workshiftServices from '@src/services/workShift.service'
import { STATE } from '@src/interfaces/enums'
import { CashOutParams } from '@src/interfaces/dto/workShift.dto'
import { ResponseType } from '@src/interfaces/dto/common.dto'
import { WorkShift } from '@src/interfaces/WorkShift'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '@src/contains/contants'
import { IApiResponse, IBodyError } from '@src/utils/request'

export type WorkShiftHydration = {
	state?: STATE
	workshift: WorkShift

	setWorkShift?: (_workshift: WorkShift) => void
}
export default class WorkShiftStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@observable workshift: Partial<WorkShift> = {}

	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

	@action setWorkShift(_workshift: WorkShift) {
		this.workshift = _workshift
	}

	@flow *getWorkShift() {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<any>> = yield workshiftServices.getWorkShift<
				IApiResponse<ResponseType<WorkShift>>
			>(token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				this.workshift = res?.data?.data || {}
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

	@flow *cashOut(params: CashOutParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<any>> = yield workshiftServices.cashOut<IApiResponse<ResponseType<any>>>(
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

	@action hydrate(data?: WorkShiftHydration) {
		if (data && data.workshift) {
			this.workshift = data.workshift
		}
	}
}
