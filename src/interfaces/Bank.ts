export interface CreateBankParams {
	receiverName: string
	numberAccount: string
	bankId: number
}

export interface UpdateBankParams {
	userBankId: number
	receiverName: string
	numberAccount: string
	bankId: number
}

export interface ListBankParams {}

export interface ListBankComonParams {}
