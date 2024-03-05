import {
	ReportRechargePointParams,
	ReportRevenueParams,
	ReportTopSaleParams,
	ReportWithDrawPointParams,
	ReportOrderParams,
	ReportSaleParams,
	ReportVoucherParams,
	ReportPointParams,
} from '@src/interfaces/dto/report.dto'
import request, { IApiResponse } from '@src/utils/request'

export function reportTopSale<T>(params: ReportTopSaleParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/report/dashboard/sale-item-dashboard',
		options: {
			method: 'post',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params,
		},
	})
}

export function reportRevenue<T>(params: ReportRevenueParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/store/customer-store/create-customer',
		options: {
			method: 'post',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params,
		},
	})
}

export function reChargePoint<T>(params: ReportRechargePointParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/report/point/topup-point-report',
		options: {
			method: 'post',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params,
		},
	})
}

export function withDrawPoint<T>(params: ReportWithDrawPointParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/report/cash-out/get-cash-out-info',
		options: {
			method: 'post',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params,
		},
	})
}

export function reportOrder<T>(params: ReportOrderParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/report/order/order-report',
		options: {
			method: 'post',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params,
		},
	})
}

export function reportSale<T>(params: ReportSaleParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/report/sale/sale-report',
		options: {
			method: 'post',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params,
		},
	})
}

export function reportVoucher<T>(params: ReportVoucherParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/report/voucher/voucher-report',
		options: {
			method: 'post',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params,
		},
	})
}

export function reportPoint<T>(params: ReportPointParams, token: string): Promise<IApiResponse<T>> {
	return request<T>({
		url: '/report/point/point-report',
		options: {
			method: 'post',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params,
		},
	})
}
