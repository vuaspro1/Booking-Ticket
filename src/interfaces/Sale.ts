import { PAYMENT_METHOD, PAYMENT_PROVIDER } from './enums'

export interface SaleProduct {
	id: number
	quantity: number
	name: string
	barcode: string
	salePrice: number
	quantityMax?: number
	unit?: string
	description?: string
	image?: string
}
export interface SaleParams {
	listProducts: Partial<SaleProduct>[]
	paymentMethod?: PAYMENT_METHOD
	customerMoney: number
	PhoneAccumulate: string
	/**
	 * Phần trăm chiết khấu
	 */
	discountPercent?: number
	/**
	 * Số tiền chiết khấu
	 */
	discountMoney?: number
	/**
	 * mã voucher
	 */
	voucherCode?: string
	/**
	 * Mã giao dịch mà khách hàng sử dụng
	 */
	transactionCode?: string
	/**
	 * Số điểm khách hàng sử dụng kèm theo transactionCode
	 */
	point?: number
	token?: string // { type: 'string'; description: 'token OTP' }
	providerPayment?: PAYMENT_PROVIDER
	paymentCardInfo?: string
	/**
	 * Số tiền dư
	 */
	excessCash: number
	note?: string
}

export interface ListSaleParams {
	startTime?: number
	endTime?: number
	skip: number
	limit: number
}

export interface SaleResponseType<T> {
	code?: number
	message?: string
	errorCode?: number
	data?: T
	itemInBillInfo?: Partial<SaleProduct>[]
}

export interface AccumulateParams {
	phone: string
	totalBill: number
	point: number
}
