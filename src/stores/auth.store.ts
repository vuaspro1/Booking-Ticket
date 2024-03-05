import { action, observable, makeObservable, flow } from 'mobx'
import { persist } from 'mobx-persist'
import RootStore from './RootStore'
import * as usersServices from '@src/services/users.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
// import {
// 	ChangePasswordParams,
// 	IUserResponse,
// 	PartnerInfo,
// 	RechargePointParams,
// 	StoreInfo,
// 	User,
// 	WithDrawPointParams,
// 	RegisterUserInfo,
// } from '@src/interfaces/User'
import { STATE } from '@src/interfaces/enums'
import { IApiResponse, IBodyError } from '@src/utils/request'
import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '@src/contains/contants'
import { ResponseType } from '@src/interfaces/dto/common.dto'
// import { wait } from '@src/helpers/wait'
import { UpdateCustomerParams } from '@src/interfaces/dto/user.dto'
import Config from '@src/contains/Config'
import { IUsers, IUsersResponse } from '@src/interfaces/Users'

export type AuthHydration = {
	state?: STATE
	token?: string
	tokenChat?: string
	chatId?: string
	// storeInfo?: StoreInfo
	role?: string
	auth?: IUsers

	setToken?: (token: string) => void
	setTokenChat?: (data: string) => void
	setChatId?: (data: string) => void
	// setStoreInfo?: (data: StoreInfo) => void
	setRole?: (data: string) => void
	setAuth?: (data: { token?: string; auth: any }) => void
	logout?()
	login?: (username: string, password: string) => Promise<any>
	// register?: (data: RegisterUserInfo) => Promise<any>
}

export default class AuthStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@persist @observable token = null
	@observable tokenChat = null
	@observable chatId = null
	// @observable storeInfo: Partial<StoreInfo> = {}
	// @observable partnerInfo: Partial<PartnerInfo> = {}
	@persist @observable role: string = null
	@persist('object') @observable auth: Partial<IUsers> = {}

	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
		// this.disposeInfo = autorun(
		//   () => {
		//     // if (this.isRunUpdateInfo) {
		//       // console.log(`🚀 ~ file: auth.store.ts ~ line 94 ~ AuthStore ~ this.isRunUpdateInfo`, this.isRunUpdateInfo);
		//       // this?.getCustomerInfo()
		//     // }
		//   }
		//   /* {
		//     scheduler: (run) => {
		//       console.log(
		//         `🚀 ~ file: HeaderHomeDesktop.tsx ~ line 77 ~ autorun ~ run`,
		//         run
		//       )
		//       setTimeout(run, 1000)
		//     },
		//   } */
		// )
	}

	@action setToken(_token: string) {
		this.token = _token
	}

	@action setTokenChat(_data: string) {
		this.tokenChat = _data
	}

	@action setChatId(_data: string) {
		this.chatId = _data
	}

	@action setRole(_data: string) {
		this.role = _data
	}

	// @action setStoreInfo(_data: StoreInfo) {
	// 	this.storeInfo = _data
	// }

	@action setAuth(data: any, accessToken?: string) {
		if (accessToken) {
			this.token = accessToken
		}
		// this.auth.address = data?.address || null
		this.auth.id = data?.roleId || null
		this.auth.userName = data?.userName || null
		this.auth.roles = data?.roles.name || null
		// this.auth.email = data?.email || null
		// this.auth.firstName = data?.firstName || null
		// this.auth.lastName = data?.lastName || null
		// this.auth.avatar = data?.avatar || null
		// this.auth.phone = data?.phone || null
		// this.auth.gender = data?.gender || null
		// this.auth.updatedAt = data?.updatedAt || null
		// this.auth.exchangeInfo = data?.exchangeInfo || null
		// this.auth.exchangeId = data?.exchangeId || null
		// this.auth.totalExchangePoint = data?.totalExchangePoint || null
		// this.auth.amountExchangePoint = data?.amountExchangePoint || null
		// this.auth.balanceExchangePoint = data?.balanceExchangePoint || null
		// this.auth.merchantPoint = data?.merchantPoint || null
	}

	// @action getAccumulatInfo() {
	// 	this.getCustomerInfo()
	// 	wait(100)
	// 	return {
	// 		point: this.auth?.data?.point,
	// 		percent: this.auth?.data?.percent,
	// 	}
	// }

	@action logout() {
		this.token = null
		this.auth = {}
		// this.storeInfo = {}
		this.role = null
		if (typeof window != 'undefined') {
			localStorage.clear()
		}
	}

	// @flow *login(email: string, password: string) {
	// 	this.state = STATE.PROCESSING
	// 	try {
	// 		const res: IApiResponse<IUserResponse | IBodyError> = yield userServices.login<IApiResponse<IUserResponse>>(
	// 			email,
	// 			password
	// 		)
	// 		this.state = STATE.DONE

	// 		if (res.status === HttpStatusCode.OK) {
	// 			// const data = res as IUserResponse
	// 			const data = res.data as any
	// 			console.log(data, 'res1')
	// 			// this.auth = data?.data?.userInfo || {}
	// 			this.token = data?.token || null
	// 			this.auth.address = data?.address || null
	// 			this.auth.id = data?.id || null
	// 			this.auth.username = data?.username || null
	// 			this.auth.email = data?.email || null
	// 			this.auth.firstName = data?.firstName || null
	// 			this.auth.lastName = data?.lastName || null
	// 			this.auth.avatar = data?.avatar || null
	// 			this.auth.phone = data?.phone || null
	// 			this.auth.gender = data?.gender || null
	// 			this.auth.updatedAt = data?.updatedAt || null
	// 			this.auth.exchangeInfo = data?.exchangeInfo || null
	// 			this.auth.exchangeId = data?.exchangeId || null
	// 			this.auth.totalExchangePoint = data?.totalExchangePoint || null
	// 			this.auth.amountExchangePoint = data?.amountExchangePoint || null
	// 			this.auth.balanceExchangePoint = data?.balanceExchangePoint || null
	// 			this.auth.merchantPoint = data?.merchantPoint || null
	// 			// this.tokenChat = data?.data?.tokenChat || null
	// 			// this.storeInfo = data?.data?.storeInfo || {}
	// 			// this.chatId = data?.data?.chatId || null
	// 			// this.role = data?.data?.role || null
	// 			return res.data
	// 		}
	// 		return {
	// 			errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
	// 			message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
	// 		}
	// 	} catch (error) {
	// 		this.state = STATE.ERROR
	// 		return {
	// 			errorCode: HttpStatusCode.UNKNOW_ERROR,
	// 			message: error.message,
	// 		}
	// 	}
	// }

	@flow *login(userName: string, password: string) {
		this.state = STATE.PROCESSING
		try {
			const res: IApiResponse<ResponseType<IUsersResponse>> = yield usersServices.login(userName, password)
			this.state = STATE.DONE
			// console.log(res.data, 'res')
			const data = res.data as any
			this.token = data?.accessToken || null
			this.auth.userName = data?.userName || null
			this.auth.name = data?.name || null
			this.auth.id = data?.userId || null
			this.auth.roles = data?.roles?.[0]?.name || null

			if (res.status === HttpStatusCode.OK) {
				const data = res.data as any
				this.token = data?.accessToken || null
				this.auth.userName = data?.userName || null
				this.auth.name = data?.name || null
				this.auth.id = data?.userId || null
				this.auth.roles = data?.roles?.[0]?.name || null
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

	// @flow *register(data: RegisterUserInfo) {
	// 	this.state = STATE.PROCESSING
	// 	try {
	// 		const res: IApiResponse<IUserResponse | IBodyError> = yield userServices.registerUser<IApiResponse<RegisterUserInfo>>(
	// 			data
	// 		)
	// 		this.state = STATE.DONE

	// 		if (res.status === HttpStatusCode.OK) {
	// 			// const data = res as IUserResponse
	// 			return res
	// 		}
	// 		return {
	// 			errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
	// 			message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
	// 		}
	// 	} catch (error) {
	// 		this.state = STATE.ERROR
	// 		return {
	// 			errorCode: HttpStatusCode.UNKNOW_ERROR,
	// 			message: error.message,
	// 		}
	// 	}
	// }
	// @flow *verify(token: string) {
	// 	this.state = STATE.PROCESSING
	// 	try {
	// 		const res: IApiResponse<IUserResponse | IBodyError> = yield userServices.verify<IApiResponse<any>>(token)
	// 		this.state = STATE.DONE

	// 		if (res.status === HttpStatusCode.OK) {
	// 			// const data = res as IUserResponse
	// 			return res
	// 		}
	// 		return {
	// 			errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
	// 			message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
	// 		}
	// 	} catch (error) {
	// 		this.state = STATE.ERROR
	// 		return {
	// 			errorCode: HttpStatusCode.UNKNOW_ERROR,
	// 			message: error.message,
	// 		}
	// 	}
	// }
	// @flow *updateCustomer(params: UpdateCustomerParams) {
	// 	this.state = STATE.PROCESSING
	// 	try {
	// 		const token = this.token
	// 		if (!token) {
	// 			return {
	// 				errorCode: HttpStatusCode.UNAUTHORIZED,
	// 				message: UNAUTHORIZED_ERROR_MESSAGE,
	// 			}
	// 		}
	// 		const res: IApiResponse<ResponseType<any>> = yield userServices.updateCustomer<IApiResponse<ResponseType<any>>>(
	// 			params,
	// 			token
	// 		)
	// 		this.state = STATE.DONE
	// 		if (res.status === HttpStatusCode.OK && res.data && res.data?.code == 0) {
	// 			return res.data
	// 		}
	// 		return {
	// 			errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
	// 			message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
	// 		}
	// 	} catch (error) {
	// 		this.state = STATE.ERROR
	// 		return {
	// 			errorCode: HttpStatusCode.UNKNOW_ERROR,
	// 			message: error.message,
	// 		}
	// 	}
	// }

	// @flow *getCustomerInfo() {
	// 	this.state = STATE.PROCESSING
	// 	try {
	// 		const token = this.token
	// 		if (!token) {
	// 			return {
	// 				errorCode: HttpStatusCode.UNAUTHORIZED,
	// 				message: UNAUTHORIZED_ERROR_MESSAGE,
	// 			}
	// 		}
	// 		const res: IApiResponse<
	// 			ResponseType<{
	// 				point: number
	// 				percent: number
	// 			}>
	// 		> = yield userServices.getCustomerInfo<
	// 			IApiResponse<
	// 				ResponseType<{
	// 					point: number
	// 					percent: number
	// 				}>
	// 			>
	// 		>(token)
	// 		this.state = STATE.DONE
	// 		if (res.status === HttpStatusCode.OK && res.data && res.data?.code == 0) {
	// 			const data = res?.data || {}
	// 			this.auth = {
	// 				...this.auth,
	// 				...data,
	// 			}
	// 			return res.data
	// 		}
	// 		return {
	// 			errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
	// 			message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
	// 		}
	// 	} catch (error) {
	// 		this.state = STATE.ERROR
	// 		return {
	// 			errorCode: HttpStatusCode.UNKNOW_ERROR,
	// 			message: error.message,
	// 		}
	// 	}
	// }

	// // @flow *getCustomerInfo2() {
	// // 	this.state = STATE.PROCESSING
	// // 	try {
	// // 		const token = this.token
	// // 		if (!token) {
	// // 			return {
	// // 				errorCode: HttpStatusCode.UNAUTHORIZED,
	// // 				message: UNAUTHORIZED_ERROR_MESSAGE,
	// // 			}
	// // 		}
	// // 		const res: IApiResponse<IUserResponse> = yield userServices.getCustomerInfo2<IApiResponse<IUserResponse>>(token)
	// // 		this.state = STATE.DONE
	// // 		if (res.status === HttpStatusCode.OK && res.data && res.data?.code == 0) {
	// // 			const data: Partial<IUserResponse> = res?.data || {}
	// // 			this.auth = {
	// // 				...this.auth,
	// // 				...data?.data.userInfo,
	// // 			}
	// // 			this.storeInfo = {
	// // 				...this.storeInfo,
	// // 				...data?.data.storeInfo,
	// // 			}
	// // 			this.partnerInfo = {
	// // 				...this.partnerInfo,
	// // 				...data?.data.partnerInfo,
	// // 			}
	// // 			this.role = data?.data.role
	// // 			return res.data
	// // 		}
	// // 		return {
	// // 			errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
	// // 			message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
	// // 		}
	// // 	} catch (error) {
	// // 		this.state = STATE.ERROR
	// // 		return {
	// // 			errorCode: HttpStatusCode.UNKNOW_ERROR,
	// // 			message: error.message,
	// // 		}
	// // 	}
	// // }

	// @flow *changePassword(params: ChangePasswordParams) {
	// 	this.state = STATE.PROCESSING
	// 	try {
	// 		const token = this.token
	// 		if (!token) {
	// 			return {
	// 				errorCode: HttpStatusCode.UNAUTHORIZED,
	// 				message: UNAUTHORIZED_ERROR_MESSAGE,
	// 			}
	// 		}
	// 		const res: IApiResponse<ResponseType<any>> = yield userServices.changePassword<IApiResponse<ResponseType<any>>>(
	// 			params,
	// 			token
	// 		)
	// 		this.state = STATE.DONE
	// 		if (res.status === HttpStatusCode.OK && res.data && res.data?.code == 0) {
	// 			return res.data
	// 		}
	// 		return {
	// 			errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
	// 			message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
	// 		}
	// 	} catch (error) {
	// 		this.state = STATE.ERROR
	// 		return {
	// 			errorCode: HttpStatusCode.UNKNOW_ERROR,
	// 			message: error.message,
	// 		}
	// 	}
	// }

	// /**
	//  *
	//  * @param {number} "amount"
	//  * @param {string} "providerPayment 'Vnpay' | 'Payme' "
	//  * @returns {string} url redirect to pay
	//  */
	// @flow *reChargePoint(params: RechargePointParams) {
	// 	this.state = STATE.PROCESSING
	// 	try {
	// 		const token = this.token
	// 		if (!token) {
	// 			return {
	// 				errorCode: HttpStatusCode.UNAUTHORIZED,
	// 				message: UNAUTHORIZED_ERROR_MESSAGE,
	// 			}
	// 		}
	// 		const res: IApiResponse<ResponseType<string>> = yield userServices.reChargePoint<IApiResponse<ResponseType<string>>>(
	// 			{
	// 				...params,
	// 				returnUrl: `${Config.publicRuntimeConfig.BASE_URL}/user/recharge-point-info` || '',
	// 			},
	// 			token
	// 		)
	// 		this.state = STATE.DONE
	// 		if (res.status === HttpStatusCode.OK && res.data && res.data?.code == 0) {
	// 			return res.data
	// 		}
	// 		return {
	// 			errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
	// 			message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
	// 		}
	// 	} catch (error) {
	// 		this.state = STATE.ERROR
	// 		return {
	// 			errorCode: HttpStatusCode.UNKNOW_ERROR,
	// 			message: error.message,
	// 		}
	// 	}
	// }

	// /**
	//  *
	//  * @param {number} "amount"
	//  * @param {string} "bankUserId - id ngan hang "
	//  * @returns {object}
	//  */
	// @flow *withDrawPoint(params: WithDrawPointParams) {
	// 	this.state = STATE.PROCESSING
	// 	try {
	// 		const token = this.token
	// 		if (!token) {
	// 			return {
	// 				errorCode: HttpStatusCode.UNAUTHORIZED,
	// 				message: UNAUTHORIZED_ERROR_MESSAGE,
	// 			}
	// 		}
	// 		const res: IApiResponse<ResponseType<string>> = yield userServices.withDrawPoint<IApiResponse<ResponseType<string>>>(
	// 			params,
	// 			token
	// 		)
	// 		this.state = STATE.DONE
	// 		if (res.status === HttpStatusCode.OK && res.data && res.data?.code == 0) {
	// 			return res.data
	// 		}
	// 		return {
	// 			errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
	// 			message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
	// 		}
	// 	} catch (error) {
	// 		this.state = STATE.ERROR
	// 		return {
	// 			errorCode: HttpStatusCode.UNKNOW_ERROR,
	// 			message: error.message,
	// 		}
	// 	}
	// }

	@action hydrate(data?: AuthHydration) {
		if (data && data.token) {
			this.token = data.token
		}
		if (data && data.auth) {
			this.auth = data.auth
		}
		if (data && data.tokenChat) {
			this.tokenChat = data.tokenChat
		}
		if (data && data.chatId) {
			this.chatId = data.chatId
		}
		if (data && data.role) {
			this.role = data.role
		}
		// if (data && data.storeInfo) {
		// 	this.storeInfo = data.storeInfo
		// }
	}
}
