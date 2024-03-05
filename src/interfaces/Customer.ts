import { CUSTOMER_REPORT_TYPE, GENDER_TYPE } from './enums'

export interface CustomerParams {
	name: string
	image?: string
	gender: GENDER_TYPE
	dateOfBirth: number
	phone: string
	address: string
}

export interface ListCustomerParams {
	skip?: number
	limit?: number
	populate?: number | string
	status?: number
}

export interface CustomerReportParams {
	phone: string
	type: CUSTOMER_REPORT_TYPE
}

export interface CustomerReportResponseType<T> {
	code?: number
	message?: string
	errorCode?: number
	data?: T
	totalMoney?: number
	usedPoint?: number
	totalPoint?: number
	token?: string
	point?: number
	[x: string]: any
}
