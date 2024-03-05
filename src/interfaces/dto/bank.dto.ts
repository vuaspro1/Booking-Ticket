export interface Bank {
	createdAt: number
	id: number
	bankId: number
	numberAccount: string
	receiverName: string
	icon: string
	shortName: string
	bankName: string
}

export interface BankCommon {
	id: number
	shortName: string
	bankName: string
	icon: string
}
