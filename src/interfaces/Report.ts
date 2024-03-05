export interface TopSales {
	productId: number
	name: string
	quantity: number
}

export interface Revenue {
	date: number
	totalMoney: number
}

export interface ReportRechargePoint {
	createdAt: number
	id: number
	status: string
	amount: number
	balance: number
	description: string
}

export interface ReportWithDrawPoint {
	createdAt: number
	updatedAt: number
	id: number
	amount: number
	bankName: string
	status: string
	shortName?: any
}

export interface ReportSaleImport {
	totalMoney: number
	cash: number
	usedPoint: number
	accPoint: number
	countOrder: number
}

export interface ReportSaleSell {
	totalPrice: number
	cash: number
	usedPoint: number
	givePoint: number
	saleInfo: RSaleInfo[]
	providerPrice: number
}

export interface RSaleInfo {
	createdAt: number
	updatedAt: number
	id: number
	userId: string
	storeId: string
	usePoint: number
	customerPhone?: string
	status: string
	discountPercent: number
	discountMoney: number
	transactionCode: string
	voucherPoint: number
	voucherCode?: string
	voucherPercentAccumulate: number
	voucherDiscount: number
	voucherPercentDiscount: number
	totalMoney: number
	totalPrice: number
	merchantId: number
	paymentMethod: string
	customerMoney: number
	excessCash: number
	PhoneAccumulate?: string
	description?: any
}

export interface ReportVoucher {
	totalVoucher: number
	totalMoney: number
	totalDiscount: number
	totalAccPoint: number
	voucherInfo: RVoucherInfo[]
}

export interface RVoucherInfo {
	createdAt: number
	updatedAt: number
	id: number
	voucherId: string
	voucherName: string
	voucherImages: string[]
	voucherCode: string
	voucherType: string
	voucherPoint: number
	voucherPercentAccumulate: number
	voucherDiscount: number
	voucherPercentDiscount: number
	totalMoney: number
	storeId: string
	userId: string
	merchantId: number
}

export interface RPoint {
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
export interface ReportPoint {
	bonusPoint: number
	collectionPoint: number
	pointStartTime: number
	pointEndTime: number
	points: RPoint[]
}
