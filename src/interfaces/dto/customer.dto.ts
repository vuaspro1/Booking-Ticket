// export interface Customer {
// 	createdAt: number
// 	updatedAt: number
// 	id: number
// 	phone: string
// 	totalMoney: number
// 	/**
// 	 * @description Tổng điểm cửa hàng tặng cho khách
// 	 */
// 	totalPoint: number
// 	userName?: any
// 	image?: any
// 	dateOfBirth?: any
// 	gender?: any
// 	address?: any
// 	usedPoint?: number
// 	/**
// 	 * @description Điểm hiện có của khách
// 	 */
// 	availablePoint?: number
// }

export interface Customer {
	images: any
	createdAt: number
	updatedAt: number
	id: number
	name: string
	phone: string
	email: string
	createDate: number
	description: string
	status: number
	createdBy: string
	updatedBy: string
	deleteBy: string
	isDelete: boolean
	deleteAt: number
	userId?: {
		id: number
		firstName: string
		lastName: string
		email: string
		avatar: string
	}
	socialUrl?: any
}

export interface CustomerPointReport {
	createdAt: number
	updatedAt: number
	id: number
	phone: string
	customerId: string
	amount: number
	totalBill: number
	balance: number
	createdByStoreId: string
	description: string
	type: string
	source: string
	voucherCode?: any
	transactionCode?: any
	saleId?: any
	orderId?: any
	transactionId?: any
	merchantId: number
}

export interface CustomerSaleReport {
	createdAt: number
	updatedAt: number
	id: number
	userId: string
	storeId: string
	usePoint: number
	customerPhone: string
	status: string
	discountPercent: number
	discountMoney: number
	transactionCode: string
	voucherPoint: number
	voucherCode: string
	voucherPercentAccumulate: number
	voucherDiscount: number
	voucherPercentDiscount: number
	totalMoney: number
	totalPrice: number
	merchantId: number
	paymentMethod: string
	customerMoney?: any
	excessCash?: any
	PhoneAccumulate?: any
}
