import { action, observable, makeObservable, flow, computed } from 'mobx'
import RootStore from './RootStore'
import * as reportServices from '@src/services/report.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { REPORT_SALE_TYPE, STATE } from '@src/interfaces/enums'
import { IApiResponse, IBodyError } from '@src/utils/request'
import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '@src/contains/contants'
import {
	ReportPoint,
	ReportRechargePoint,
	ReportSaleImport,
	ReportSaleSell,
	ReportVoucher,
	ReportWithDrawPoint,
	Revenue,
	RPoint,
	TopSales,
} from '@src/interfaces/Report'
import {
	RePointResponseType,
	ReportOrderParams,
	ReportPointParams,
	ReportRechargePointParams,
	ReportRevenueParams,
	ReportSaleParams,
	ReportTopSaleParams,
	ReportVoucherParams,
	ReportWithDrawPointParams,
} from '@src/interfaces/dto/report.dto'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import Config from '@src/contains/Config'
import { assign, cloneDeep, omit, updateWith } from 'lodash'
import dayjs from 'dayjs'

export type ReportHydration = {
	state?: STATE
	topSales?: TopSales[]
	revenues?: Revenue[]
	reChargePoints: ReportRechargePoint[]
	withDrawPoints: ReportWithDrawPoint[]

	setTopSales?: (_topSales: TopSales[]) => void
	setRevenues?: (_revenues: Revenue[]) => void
	getRevenues?: (params: ReportRevenueParams) => Promise<any>
	getTopSales?: (params: ReportTopSaleParams) => Promise<any>
	setRechargePoints?: (_reChargePoints: ReportRechargePoint[]) => void
	setWithDrawPoints?: (_withDrawPoints: ReportWithDrawPoint[]) => void
}

export default class ReportStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@observable topSales: TopSales[] = []
	@observable revenues: Revenue[] = []
	@observable reChargePoints: ReportRechargePoint[] = []
	@observable withDrawPoints: ReportWithDrawPoint[] = []
	@observable pagiReCharge: IPagination = {
		skip: 0,
		page: 1,
		limit: Config.PAGE_SIZE,
		totalPage: 0,
		total: 0,
		loadMore: false,
	}
	@observable pagiWithDraw: IPagination = {
		skip: 0,
		page: 1,
		limit: Config.PAGE_SIZE,
		totalPage: 0,
		total: 0,
		loadMore: false,
	}
	@observable pagiSaleSell: IPagination = {
		skip: 0,
		page: 1,
		limit: Config.PAGE_SIZE,
		totalPage: 0,
		total: 0,
		loadMore: false,
	}
	@observable pagiReVoucher: IPagination = {
		skip: 0,
		page: 1,
		limit: Config.PAGE_SIZE,
		totalPage: 0,
		total: 0,
		loadMore: false,
	}
	@observable pagiRePoint: IPagination = {
		skip: 0,
		page: 1,
		limit: Config.PAGE_SIZE,
		totalPage: 0,
		total: 0,
		loadMore: false,
	}
	@observable hasEndReCharge = false
	@observable hasEndWithDraw = false
	@observable hasEndSaleSell = false
	@observable hasEndReVoucher = false
	@observable hasEndRePoint = false
	@observable paramReCharge: Partial<ReportRechargePointParams> = {
		skip: this.pagiReCharge.skip,
		limit: this.pagiReCharge.limit,
		startTime: dayjs().add(-1, 'day').startOf('day').valueOf(),
		endTime: dayjs().endOf('day').valueOf(),
	}
	@observable paramWithDraw: Partial<ReportWithDrawPointParams> = {
		skip: this.pagiWithDraw.skip,
		limit: this.pagiWithDraw.limit,
		startTime: dayjs().add(-1, 'day').startOf('day').valueOf(),
		endTime: dayjs().endOf('day').valueOf(),
	}
	@observable paramSaleSell: Partial<ReportSaleParams> = {
		skip: this.pagiSaleSell.skip,
		limit: this.pagiSaleSell.limit,
		// startTime: dayjs().add(-1, 'day').startOf('day').valueOf(),
		startTime: dayjs().startOf('years').valueOf(),
		endTime: dayjs().endOf('day').valueOf(),
	}
	@observable paramReVoucher: Partial<ReportVoucherParams> = {
		skip: this.pagiReVoucher.skip,
		limit: this.pagiReVoucher.limit,
		// startTime: dayjs().add(-1, 'day').startOf('day').valueOf(),
		startTime: dayjs().startOf('years').valueOf(),
		endTime: dayjs().endOf('day').valueOf(),
	}
	@observable paramRePoint: Partial<ReportPointParams> = {
		skip: this.pagiReVoucher.skip,
		limit: this.pagiReVoucher.limit,
		// startTime: dayjs().add(-1, 'day').startOf('day').valueOf(),
		startTime: dayjs().startOf('years').valueOf(),
		endTime: dayjs().endOf('day').valueOf(),
	}
	/**
	 * loại báo cáo kinh doanh
	 * @var {import} - nhập hàng
	 * @var {sell} - bán hàng
	 */
	@observable reportSaleType: REPORT_SALE_TYPE = REPORT_SALE_TYPE.SELL
	/**
	 * báo cáo nhập hàng
	 * @type ReportSaleImport
	 */
	@observable reportSaleImport: Partial<ReportSaleImport> = {}
	/**
	 * báo cáo bán hàng
	 * @type ReportSaleSell
	 */
	@observable reportSaleSell: Partial<ReportSaleSell> = {}
	/**
	 * báo cáo voucher
	 * @type ReportVoucher
	 */
	@observable reportVoucher: Partial<ReportVoucher> = {}
	/**
	 * báo cáo giao dich điểm
	 * @type ReportPoint
	 */
	@observable reportPoints: Partial<ReportPoint> = {}

	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

	@action setReportSaleType(_data: REPORT_SALE_TYPE) {
		this.reportSaleType = _data
	}

	@action setParamReCharg(_data: ReportRechargePointParams) {
		const _params = cloneDeep(this.paramReCharge)
		Object.assign(_params, _data)
		this.paramReCharge = _params
	}

	@action setParamWithDraw(_data: ReportWithDrawPointParams) {
		const _params = cloneDeep(this.pagiWithDraw)
		Object.assign(_params, _data)
		this.paramWithDraw = _params
	}

	@action setParamSaleSell(_data: Partial<ReportSaleParams>) {
		const _params = cloneDeep(this.paramSaleSell)
		Object.assign(_params, _data)
		this.paramSaleSell = _params
	}

	@action setParamReVoucher(_data: Partial<ReportVoucherParams>) {
		const _params = cloneDeep(this.paramReVoucher)
		Object.assign(_params, _data)
		this.paramReVoucher = _params
	}

	@action setParamRePoint(_data: ReportPointParams) {
		const _params = cloneDeep(this.paramRePoint)
		Object.assign(_params, _data)
		this.paramRePoint = _params
	}

	@action setLimitReCharg(limit: number) {
		const _pagination = cloneDeep(this.pagiReCharge)
		Object.assign(_pagination, {
			limit,
		})
		this.pagiReCharge = _pagination
	}

	@action setLimitWithDraw(limit: number) {
		const _pagination = cloneDeep(this.pagiWithDraw)
		Object.assign(_pagination, {
			limit,
		})
		this.pagiWithDraw = _pagination
	}

	@action setLimitSaleSell(limit: number) {
		const _pagination = cloneDeep(this.pagiSaleSell)
		Object.assign(_pagination, {
			limit,
		})
		this.pagiSaleSell = _pagination
	}

	@action setLimitReVoucher(limit: number) {
		const _pagination = cloneDeep(this.pagiReVoucher)
		Object.assign(_pagination, {
			limit,
		})
		this.pagiReVoucher = _pagination
	}

	@action setLimitRePoint(limit: number) {
		const _pagination = cloneDeep(this.pagiRePoint)
		Object.assign(_pagination, {
			limit,
		})
		this.pagiRePoint = _pagination
	}

	@action setPageReCharg(page: number) {
		const _pagination = cloneDeep(this.pagiReCharge)
		Object.assign(_pagination, {
			page: page,
		})
		this.pagiReCharge = _pagination
	}

	@action setPageWithDraw(page: number) {
		const _pagination = cloneDeep(this.pagiWithDraw)
		Object.assign(_pagination, {
			page: page,
		})
		this.pagiWithDraw = _pagination
	}

	@action setPageSaleSell(page: number) {
		const _pagination = cloneDeep(this.pagiSaleSell)
		Object.assign(_pagination, {
			page: page,
		})
		this.pagiSaleSell = _pagination
	}

	@action setPageReVoucher(page: number) {
		const _pagination = cloneDeep(this.pagiReVoucher)
		Object.assign(_pagination, {
			page: page,
		})
		this.pagiReVoucher = _pagination
	}

	@action setPageRePoint(page: number) {
		const _pagination = cloneDeep(this.pagiRePoint)
		Object.assign(_pagination, {
			page: page,
		})
		this.pagiRePoint = _pagination
	}

	@action setPagiationReCharg(_data: IPagination) {
		const _pagination = cloneDeep(this.pagiReCharge)
		Object.assign(_pagination, _data)
		this.pagiReCharge = _pagination
	}

	@action setPagiationWithDraw(_data: IPagination) {
		const _pagination = cloneDeep(this.pagiWithDraw)
		Object.assign(_pagination, _data)
		this.pagiWithDraw = _pagination
	}

	@action setPagiationSaleSell(_data: IPagination) {
		const _pagination = cloneDeep(this.pagiSaleSell)
		Object.assign(_pagination, _data)
		this.pagiSaleSell = _pagination
	}

	@action setPagiationReVoucher(_data: IPagination) {
		const _pagination = cloneDeep(this.pagiReVoucher)
		Object.assign(_pagination, _data)
		this.pagiReVoucher = _pagination
	}

	@action setPagiationRePoint(_data: IPagination) {
		const _pagination = cloneDeep(this.pagiRePoint)
		Object.assign(_pagination, _data)
		this.pagiRePoint = _pagination
	}

	@action setTopSales(_topSales: TopSales[]) {
		this.topSales = _topSales
	}

	@action setRevenues(_revenues: Revenue[]) {
		this.revenues = _revenues
	}

	@action setRechargePoints(_reChargePoints: ReportRechargePoint[]) {
		this.reChargePoints = _reChargePoints
	}

	@action setWithDrawPoints(_withDrawPoints: ReportWithDrawPoint[]) {
		this.withDrawPoints = _withDrawPoints
	}

	@computed get isChangePaginationReCharge() {
		return {
			page: this.pagiReCharge.page,
			limit: this.pagiReCharge.limit,
		}
	}

	@computed get isChangePaginationWithDraw() {
		return {
			page: this.pagiWithDraw.page,
			limit: this.pagiWithDraw.limit,
		}
	}

	@computed get isChangePaginationSaleSell() {
		return {
			page: this.pagiSaleSell.page,
			limit: this.pagiSaleSell.limit,
		}
	}

	@computed get isChangePaginationReVoucher() {
		return {
			page: this.pagiReVoucher.page,
			limit: this.pagiReVoucher.limit,
		}
	}

	@computed get isChangePaginationRePoint() {
		return {
			page: this.pagiRePoint.page,
			limit: this.pagiRePoint.limit,
		}
	}

	@computed get isChangeParamReCharge() {
		return this.paramReCharge
	}

	@computed get isChangeParamWithDraw() {
		return this.paramWithDraw
	}

	@computed get isChangeParamSaleSell() {
		return this.paramSaleSell
	}

	@computed get isChangeParamReVoucher() {
		return this.paramReVoucher
	}

	@computed get isChangeParamRePoint() {
		return this.paramRePoint
	}

	@flow *getTopSales(params: ReportTopSaleParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<TopSales[]> | IBodyError> = yield reportServices.reportTopSale<
				IApiResponse<ResponseType<TopSales[]>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK) {
				const data = res?.data as ResponseType<TopSales[]>
				this.topSales = data?.data || []
				return res.data
			}
			return {
				errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	@flow *getRevenues(params: ReportRevenueParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<Revenue[]> | IBodyError> = yield reportServices.reportTopSale<
				IApiResponse<ResponseType<Revenue[]>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK) {
				const data = res?.data as ResponseType<Revenue[]>
				this.revenues = data?.data || []
				return res.data
			}
			return {
				errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	@flow *reChargePoint(params: ReportRechargePointParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<ReportRechargePoint[]>> = yield reportServices.reChargePoint<
				IApiResponse<ResponseType<ReportRechargePoint[]>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK) {
				const data = res?.data as ResponseType<ReportRechargePoint[]>
				this.caculateParamReCharge(res.data?.total || 0)
				if (!this.pagiReCharge.loadMore) {
					this.reChargePoints = data?.data || []
				} else {
					this.reChargePoints = [...this.reChargePoints, ...(data?.data || [])]
				}
				if (res.data?.data?.length == 0) {
					if (this.hasEndReCharge == false) {
						this.hasEndReCharge = true
					}
				} else {
					if (this.hasEndReCharge == true) {
						this.hasEndReCharge = false
					}
				}
				return res.data
			}
			return {
				errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	@flow *withDrawPoint(params: ReportWithDrawPointParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<ReportWithDrawPoint[]>> = yield reportServices.withDrawPoint<
				IApiResponse<ResponseType<Revenue[]>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK) {
				const data = res?.data as ResponseType<ReportWithDrawPoint[]>
				this.caculateParamWithDraw(res.data?.total || 0)
				if (!this.pagiWithDraw.loadMore) {
					this.withDrawPoints = data?.data || []
				} else {
					this.withDrawPoints = [...this.withDrawPoints, ...(data?.data || [])]
				}
				if (res.data?.data?.length == 0) {
					if (this.hasEndWithDraw == false) {
						this.hasEndWithDraw = true
					}
				} else {
					if (this.hasEndWithDraw == true) {
						this.hasEndWithDraw = false
					}
				}
				return res.data
			}
			return {
				errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	/**
	 * lấy dữ liệu báo cáo kinh doanh nhập hàng
	 * @param params typeof ReportOrderParams
	 * @returns Promise
	 */
	@flow *getReportSaleImport(params: ReportOrderParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<ReportSaleImport>> = yield reportServices.reportOrder<
				IApiResponse<ResponseType<Revenue[]>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK) {
				const data = res?.data as ResponseType<ReportSaleImport>
				this.reportSaleImport = data?.data
				return res.data
			}
			return {
				errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	/**
	 * lấy dữ liệu báo cáo kinh doanh bán hàng
	 * @param params typeof ReportSaleParams
	 * @returns Promise
	 */
	@flow *getReportSaleSell(params: ReportSaleParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<ReportSaleSell>> = yield reportServices.reportSale<
				IApiResponse<ResponseType<Revenue[]>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK) {
				const data = res?.data as ResponseType<ReportSaleSell>
				this.caculateParamSaleSell(res.data?.total || 0)
				let _reSaleSell = cloneDeep(this.reportSaleSell)
				_reSaleSell = assign(_reSaleSell, data?.data || {})
				if (!this.pagiSaleSell.loadMore) {
					_reSaleSell = updateWith(_reSaleSell, 'saleInfo', function () {
						return data?.data?.saleInfo || []
					})
				} else {
					_reSaleSell = updateWith(_reSaleSell, 'saleInfo', function (prevSaleInfo) {
						return [...(prevSaleInfo || []), ...(data?.data?.saleInfo || [])]
					})
				}
				this.reportSaleSell = _reSaleSell
				if (res.data?.data?.saleInfo?.length == 0) {
					if (this.hasEndSaleSell == false) {
						this.hasEndSaleSell = true
					}
				} else {
					if (this.hasEndSaleSell == true) {
						this.hasEndSaleSell = false
					}
				}
				return res.data
			}
			return {
				errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	/**
	 * lấy dữ liệu báo cáo voucher
	 * @param params typeof ReportVoucherParams
	 * @returns Promise
	 */
	@flow *getReportVoucher(params: ReportVoucherParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<ReportVoucher>> = yield reportServices.reportVoucher<
				IApiResponse<ResponseType<ReportVoucher>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK) {
				const data = res?.data
				this.caculateParamReVoucher(res.data?.total || 0)
				let _reVoucher = cloneDeep(this.reportVoucher)
				_reVoucher = assign(_reVoucher, data?.data || {})
				if (!this.pagiReVoucher.loadMore) {
					_reVoucher = updateWith(_reVoucher, 'voucherInfo', function () {
						return data?.data?.voucherInfo || []
					})
				} else {
					_reVoucher = updateWith(_reVoucher, 'voucherInfo', function (prevVoucherInfo) {
						return [...(prevVoucherInfo || []), ...(data?.data?.voucherInfo || [])]
					})
				}
				this.reportVoucher = _reVoucher
				if (res.data?.data?.voucherInfo?.length == 0) {
					if (this.hasEndReVoucher == false) {
						this.hasEndReVoucher = true
					}
				} else {
					if (this.hasEndReVoucher == true) {
						this.hasEndReVoucher = false
					}
				}
				return res.data
			}
			return {
				errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	@flow *getReportPoint(params: ReportPointParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<RePointResponseType<RPoint[]>> = yield reportServices.reportPoint<
				IApiResponse<RePointResponseType<RPoint[]>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK) {
				const data = res?.data
				this.caculateParamRePoint(res.data?.total || 0)
				let _rePoints = cloneDeep(this.reportPoints)
				_rePoints = assign(_rePoints, omit(data, 'code,message,data,errorCode'))
				if (!this.pagiRePoint.loadMore) {
					_rePoints = updateWith(_rePoints, 'points', function () {
						return data?.data || {}
					})
				} else {
					_rePoints = updateWith(_rePoints, 'points', function (prevPoints) {
						return [...(prevPoints || []), ...(data?.data || [])]
					})
				}
				this.reportPoints = _rePoints
				if (res.data?.data?.length == 0) {
					if (this.hasEndRePoint == false) {
						this.hasEndRePoint = true
					}
				} else {
					if (this.hasEndRePoint == true) {
						this.hasEndRePoint = false
					}
				}
				return res.data
			}
			return {
				errorCode: (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	@action async loadMoreChargePoint() {
		this.root.loading = true
		if (this.pagiReCharge.totalPage >= this.pagiReCharge.page) {
			const _params: ReportRechargePointParams = {
				...this.paramReCharge,
				skip: (this.pagiReCharge.skip + this.pagiReCharge.limit) * (this.pagiReCharge.page - 1),
				limit: this.pagiReCharge.limit,
			}
			// await wait(DEFAULT_WAIT_SECONDS)
			this.reChargePoint(_params)
		} else {
			this.hasEndReCharge = true
		}
	}

	@action async loadMoreDrawPoint() {
		this.root.loading = true
		if (this.pagiWithDraw.totalPage >= this.pagiWithDraw.page) {
			const _params: ReportWithDrawPointParams = {
				...this.paramWithDraw,
				skip: (this.pagiWithDraw.skip + this.pagiWithDraw.limit) * (this.pagiWithDraw.page - 1),
				limit: this.pagiWithDraw.limit,
			}
			// await wait(DEFAULT_WAIT_SECONDS)
			this.withDrawPoint(_params)
		} else {
			this.hasEndWithDraw = true
		}
	}

	@action async loadMoreReSaleSell() {
		this.root.loading = true
		if (this.pagiSaleSell.totalPage >= this.pagiSaleSell.page) {
			const _params: ReportSaleParams = {
				...this.paramSaleSell,
				skip: (this.pagiSaleSell.skip + this.pagiSaleSell.limit) * (this.pagiSaleSell.page - 1),
				limit: this.pagiSaleSell.limit,
			}
			// await wait(DEFAULT_WAIT_SECONDS)
			this.getReportSaleSell(_params)
		} else {
			this.hasEndSaleSell = true
		}
	}

	@action async loadMoreReVoucher() {
		this.root.loading = true
		if (this.pagiReVoucher.totalPage >= this.pagiReVoucher.page) {
			const _params: ReportVoucherParams = {
				...this.paramReVoucher,
				skip: (this.pagiReVoucher.skip + this.pagiReVoucher.limit) * (this.pagiReVoucher.page - 1),
				limit: this.pagiReVoucher.limit,
			}
			// await wait(DEFAULT_WAIT_SECONDS)
			this.getReportVoucher(_params)
		} else {
			this.hasEndReVoucher = true
		}
	}

	@action async loadMoreRePoint() {
		this.root.loading = true
		if (this.pagiRePoint.totalPage >= this.pagiRePoint.page) {
			const _params: ReportPointParams = {
				...this.paramRePoint,
				skip: (this.pagiRePoint.skip + this.pagiRePoint.limit) * (this.pagiRePoint.page - 1),
				limit: this.pagiRePoint.limit,
			}
			// await wait(DEFAULT_WAIT_SECONDS)
			this.getReportPoint(_params)
		} else {
			this.hasEndRePoint = true
		}
	}

	@action hydrate(data?: ReportHydration) {
		if (data && data.topSales) {
			this.topSales = data.topSales
		}
		if (data && data.revenues) {
			this.revenues = data.revenues
		}
		if (data && data.reChargePoints) {
			this.reChargePoints = data.reChargePoints
		}
		if (data && data.withDrawPoints) {
			this.withDrawPoints = data.withDrawPoints
		}
	}

	private caculateParamReCharge(total: number) {
		const _pagination = cloneDeep(this.pagiReCharge)
		this.pagiReCharge = {
			..._pagination,
			total,
			totalPage: Math.floor((total + _pagination.limit - 1) / _pagination.limit),
		}
	}

	private caculateParamWithDraw(total: number) {
		const _pagination = cloneDeep(this.pagiWithDraw)
		this.pagiWithDraw = {
			..._pagination,
			total,
			totalPage: Math.floor((total + _pagination.limit - 1) / _pagination.limit),
		}
	}

	private caculateParamSaleSell(total: number) {
		const _pagination = cloneDeep(this.pagiSaleSell)
		this.pagiSaleSell = {
			..._pagination,
			total,
			totalPage: Math.floor((total + _pagination.limit - 1) / _pagination.limit),
		}
	}

	private caculateParamReVoucher(total: number) {
		const _pagination = cloneDeep(this.pagiReVoucher)
		this.pagiReVoucher = {
			..._pagination,
			total,
			totalPage: Math.floor((total + _pagination.limit - 1) / _pagination.limit),
		}
	}

	private caculateParamRePoint(total: number) {
		const _pagination = cloneDeep(this.pagiRePoint)
		this.pagiRePoint = {
			..._pagination,
			total,
			totalPage: Math.floor((total + _pagination.limit - 1) / _pagination.limit),
		}
	}
}
