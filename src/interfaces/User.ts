import { PAYMENT_PROVIDER } from './enums'

export interface IUserResponse {
	code: number
	message?: string
	errorCode?: number
	data?: {
		// userInfo: User
		token: string
		// tokenChat: string
		// chatId: string
		// storeInfo: StoreInfo
		// partnerInfo?: PartnerInfo
		// role: string
	}
}

export interface StoreInfo {
	name: string
	address: string
	province: string
	district: string
	ward: string
	phone: string

	id: string
	created: number
	updated_at: number
	partner_id: string
	partner_refer: string
	lat: number
	lng: number
	state: string
	cardImage: string
}

export interface User {
	// total: number
	// balance: number
	// refId: string
	id: string
	username?: string
	email: string
	gender: string
	firstName: string
	lastName: string
	avatar: string
	address: string
	phone: string
	updatedAt: number
	exchangeInfo: any
	exchangeId: any
	totalExchangePoint: number
	amountExchangePoint: number
	balanceExchangePoint: number
	merchantPoint: number
	// points_by_type?: any
	// storeOwnerName: string
	// storeOwnerPhone: string
	// point?: number
	// percent?: number
	// data?: any
}
export interface PartnerInfo {
	id: string
	name: string
}
export interface RegisterUserInfo {
	username: string
	password: string
	firstName: string
	lastName: string
	email: string
}
export interface ChangePasswordParams {
	password: string
	newPassword: string
}

export interface RechargePointParams {
	amount: number
	providerPayment: PAYMENT_PROVIDER
	returnUrl?: string
}

export interface WithDrawPointParams {
	amount: number
	bankUserId: number
}
