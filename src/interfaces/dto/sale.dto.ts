import { PAYMENT_PROVIDER } from '../enums'
import { SaleProduct } from '../Sale'

export interface Sale {
	createdAt?: any
	updatedAt?: any
	id?: number
	userId?: string
	storeId?: string
	usePoint?: number
	customerPhone?: string
	status?: string
	discountPercent?: number
	discountMoney?: number
	/**
	 * Mã giao dịch mà khách hàng sử dụng
	 */
	transactionCode?: string
	voucherPoint?: number
	/**
	 * mã voucher
	 */
	voucherCode?: string
	voucherPercentAccumulate?: number
	voucherDiscount?: number
	voucherPercentDiscount?: number
	totalMoney?: number
	totalPrice?: number
	merchantId?: number
	paymentMethod?: string
	customerMoney?: number
	/**
	 * Số tiền dư trả khách
	 */
	excessCash?: number
	PhoneAccumulate?: any
	listProducts?: Partial<SaleProduct>[]
	isNew?: boolean
	/**
	 * Số điểm khách hàng sử dụng kèm theo transactionCode
	 */
	point?: number
	token?: string // { type: 'string'; description: 'token OTP' }
	providerPayment?: PAYMENT_PROVIDER
	paymentCardInfo?: string
}

export interface SaleResponse {
	totalPrice: number
	cash: number
	usedPoint: number
	givePoint: number
	saleInfo: Sale[]
}
