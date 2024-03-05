import { REVENUE_TYPE } from '../enums'

export interface ReportTopSaleParams {
	startTime?: number
	endTime?: number
}

export interface ReportRevenueParams {
	key: REVENUE_TYPE
	startTime?: number
	endTime?: number
}

export interface ReportRechargePointParams {
	skip: number
	limit: number
	startTime?: number
	endTime?: number
}

export interface ReportWithDrawPointParams {
	skip: number
	limit: number
	startTime?: number
	endTime?: number
}

export interface ReportOrderParams {
	startTime?: number
	endTime?: number
}

export interface ReportSaleParams {
	skip: number
	limit: number
	startTime?: number
	endTime?: number
}

export interface ReportVoucherParams {
	skip: number
	limit: number
	startTime?: number
	endTime?: number
}

export interface ReportPointParams {
	skip: number
	limit: number
	startTime?: number
	endTime?: number
}

export interface RePointResponseType<T> {
	code?: number
	message?: string
	errorCode?: number
	data?: T
	total?: number
	bonusPoint: number
	collectionPoint: number
	pointStartTime: number
	pointEndTime: number
}
