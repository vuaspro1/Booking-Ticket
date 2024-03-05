import { action, observable, makeObservable, computed, flow } from 'mobx'
import RootStore from './RootStore'
import * as saleServices from '@src/services/sale.service'
import { STATE } from '@src/interfaces/enums'
import { Sale, SaleResponse } from '@src/interfaces/dto/sale.dto'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import Config from '@src/contains/Config'
import { AccumulateParams, ListSaleParams, SaleParams, SaleProduct, SaleResponseType } from '@src/interfaces/Sale'
import { cloneDeep, omit, updateWith } from 'lodash'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '@src/contains/contants'
import { IApiResponse, IBodyError } from '@src/utils/request'

export type SaleHydration = {
	state?: STATE
	sales: Sale[]
	pagination?: IPagination

	setSales?: (_sales: Sale[]) => void
	setPagination?: (_data: IPagination) => void
}
export default class SaleStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@observable sales: Partial<Sale[]> = []
	@observable saleSummary: Partial<Omit<SaleResponse, 'saleInfo'>> = {}
	@observable saleInfo: Partial<Sale> = {}
	@observable saleInfos: {
		[x: string]: Partial<Sale>
	} = {}
	@observable pagination: IPagination = {
		skip: 0,
		page: 1,
		limit: Config.PAGE_SIZE,
		totalPage: 0,
		total: 0,
		loadMore: false,
	}
	@observable hasEnd = false
	@observable params: Partial<ListSaleParams> = {
		skip: this.pagination.skip,
		limit: this.pagination.limit,
	}

	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

	@action setSales(_sales: Sale[]) {
		this.sales = _sales
	}

	@action setVoucherCode(_voucherCode: string) {
		this.saleInfo = updateWith(this.saleInfo, 'voucherCode', function () {
			return _voucherCode
		})
	}

	@action setDiscountPercent(_discountPercent: number) {
		this.saleInfo = updateWith(this.saleInfo, 'discountPercent', function () {
			return _discountPercent
		})
	}

	@action setPoint(_point: number) {
		this.saleInfo = { ...this.saleInfo, token: this.root.customerStore.tokenUsedPoint, point: _point }
	}

	@action setExcessCash(_guestGiveMoney: number) {
		const _totalMoneyBill = this.totalMoneyBill
		this.saleInfo = updateWith(this.saleInfo, 'excessCash', function () {
			const _excessCash = _guestGiveMoney - _totalMoneyBill
			return _excessCash > 0 ? _excessCash : 0
		})
	}

	@action setNote(_note: string) {
		this.saleInfo = updateWith(this.saleInfo, 'note', function () {
			return _note
		})
	}

	@action setParams(_data: ListSaleParams) {
		const _params = cloneDeep(this.params)
		Object.assign(_params, _data)
		this.params = _params
	}

	@computed get isChangePagination() {
		return {
			page: this.pagination.page,
			limit: this.pagination.limit,
		}
	}

	@action setPage(page: number) {
		const _pagination = cloneDeep(this.pagination)
		Object.assign(_pagination, {
			page: page,
		})
		this.pagination = _pagination
	}

	@action setLimit(limit: number) {
		const _pagination = cloneDeep(this.pagination)
		Object.assign(_pagination, {
			limit,
		})
		this.pagination = _pagination
	}

	@action setPagination(_data: IPagination) {
		const _pagination = cloneDeep(this.pagination)
		Object.assign(_pagination, _data)
		this.pagination = _pagination
	}

	@action setHasEnd(_data: { sales?: boolean }) {
		const _hasEnd = cloneDeep(this.hasEnd)
		Object.assign(_hasEnd, _data)
		this.hasEnd = _hasEnd
	}

	@action setSaleInfo(id: number | string, _saleInfo: Partial<Sale>) {
		const _saleInfos = cloneDeep(this.saleInfos)
		if (_saleInfos[id]) {
			_saleInfos[id] = _saleInfo
		} else {
			Object.assign(_saleInfos, {
				[id]: _saleInfo,
			})
		}
		this.saleInfo = _saleInfo
		this.saleInfos = _saleInfos
	}

	@action getSaleInfoNew(id: number) {
		const _saleInfos = cloneDeep(this.saleInfos)
		const _saleInfosNew = _saleInfos[id]
		this.saleInfo = _saleInfosNew
	}

	@action removeSaleInfo(id: number | string) {
		const _saleInfos = cloneDeep(this.saleInfos)
		if (_saleInfos[id]) {
			delete _saleInfos[id]
		}
		this.saleInfo = null
		this.saleInfos = _saleInfos
	}

	@action setProductOfSale(saleId: number | string, _product: SaleProduct) {
		const _saleInfos = cloneDeep(this.saleInfos)
		if (!_saleInfos[saleId]) {
			return
		}
		const _saleInfo = _saleInfos[saleId]
		const _prods = _saleInfo?.listProducts || []
		const existProd = _prods.find((i) => i.id == _product.id)
		if (existProd) {
			Object.assign(existProd, {
				quantity: _product.quantity,
				salePrice: _product.salePrice,
			})
			for (let index = 0; index < _prods.length; index++) {
				let eProduct = _prods[index]
				if (eProduct.id == existProd.id) {
					eProduct = existProd
				}
			}
		} else {
			_prods.push(_product)
		}
		Object.assign(_saleInfo, {
			listProducts: _prods,
		})
		Object.assign(_saleInfos, {
			[saleId]: _saleInfo,
		})
		this.saleInfo = _saleInfo
		this.saleInfos = _saleInfos
	}

	@action eraseProductOfSale(saleId: number | string, _product: SaleProduct) {
		const _saleInfos = cloneDeep(this.saleInfos)
		if (!_saleInfos[saleId]) {
			return
		}
		const _saleInfo = _saleInfos[saleId]
		const _prods = _saleInfo?.listProducts.filter((item) => item.id !== _product.id) || []
		Object.assign(_saleInfo, {
			listProducts: _prods,
		})
		this.saleInfo = _saleInfo
		this.saleInfos = {
			...this.saleInfos,
			[saleId]: _saleInfo,
		}
	}

	@action setResetProductOfSale(saleId: number | string) {
		const _saleInfos = cloneDeep(this.saleInfos)
		if (!_saleInfos[saleId]) {
			return
		}
		const _saleInfo = _saleInfos[saleId]
		Object.assign(_saleInfo, {
			listProducts: [],
		})
		this.saleInfo = _saleInfo
		this.saleInfos = {
			...this.saleInfos,
			[saleId]: _saleInfo,
		}
	}

	@action getListProductsBySale(saleId: number | string) {
		return this.saleInfos[saleId]?.listProducts || []
	}

	@computed get listProducts() {
		return this.saleInfo?.listProducts || []
	}

	@computed get isChangeParams() {
		return this.params
	}

	@computed get totalMoneyCurrent() {
		const sum = this.saleInfo?.listProducts?.reduce(function (acc, cur) {
			return acc + cur.salePrice * cur.quantity
		}, 0)
		return sum
	}

	@computed get totalMoneyBill() {
		const _totalMoneyCurrent = this.totalMoneyCurrent
		const point = this.saleInfo?.point || 0
		const codeInfo = this.root.voucherStore?.codeInfo
		let discountMoney = 0
		if (Object.keys(codeInfo).length > 0) {
			if (typeof codeInfo.voucher.reduce_percents == 'number') {
				const discountPercent = codeInfo.voucher.reduce_percents || 0
				discountMoney = discountPercent > 0 ? _totalMoneyCurrent * (discountPercent / 100) : _totalMoneyCurrent
			}
		}
		const sum = _totalMoneyCurrent - discountMoney - point
		return sum
	}

	@flow *createSale(params: SaleParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const _params = cloneDeep(params)
			if (params.point > 0) {
				const tokenUsedPoint = this.root.customerStore.tokenUsedPoint
				Object.assign(_params, { token: tokenUsedPoint })
			}
			const res: IApiResponse<ResponseType<any>> = yield saleServices.createSale<IApiResponse<ResponseType<any>>>(
				_params,
				token
			)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				return res.data
			}
			return {
				errorCode: res.data?.code || (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
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

	/* @flow *updateSale(params: SaleParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<any>> = yield saleServices.updateSale<IApiResponse<ResponseType<any>>>(
				params,
				token
			)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				return res.data
			}
			return {
				errorCode: res.data?.code || (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	} */

	/* @flow *deleteSale(saleId: number) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<any>> = yield saleServices.deleteSale<IApiResponse<ResponseType<any>>>(
				saleId,
				token
			)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				return res.data
			}
			return {
				errorCode: res.data?.code || (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	} */

	@flow *getSale(saleId: number) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<SaleResponseType<Sale>> = yield saleServices.getSale<IApiResponse<SaleResponseType<Sale>>>(
				saleId,
				token
			)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				this.saleInfo = {
					...(res.data.data || [{}])[0],
					listProducts: res.data?.itemInBillInfo || [],
				}
				return res.data
			}
			return {
				errorCode: res.data?.code || (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
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

	@flow *getListSales(params: ListSaleParams) {
		this.root.loading = true
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const _params = Object.assign({}, params, {})
			const res: IApiResponse<ResponseType<SaleResponse>> = yield saleServices.getListSales(_params, token)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				const data: Partial<SaleResponse> = res.data?.data || {}
				this.caculateParams(res.data?.total || 0)
				this.saleSummary = omit(data, 'saleInfo')
				if (!this.pagination.loadMore) {
					this.sales = data.saleInfo || []
				} else {
					this.sales = [...this.sales, ...(data.saleInfo || [])]
				}
				if ((res.data?.data.saleInfo || []).length == 0) {
					if (this.hasEnd == false) {
						this.hasEnd = true
					}
				}
				return res.data
			}
			return {
				errorCode: res.data?.code || (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			this.root.loading = false
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	@flow *accumulatePoint(params: AccumulateParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<SaleResponseType<any>> = yield saleServices.accumulatePoint<
				IApiResponse<SaleResponseType<any>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				return res.data
			}
			return {
				errorCode: res.data?.code || (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
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

	@action async loadMore() {
		this.root.loading = true
		if (this.pagination.totalPage >= this.pagination.page) {
			const _params: ListSaleParams = {
				...this.params,
				skip: (this.pagination.skip + this.pagination.limit) * (this.pagination.page - 1),
				limit: this.pagination.limit,
			}
			// await wait(DEFAULT_WAIT_SECONDS)
			this.getListSales(_params)
		} else {
			this.hasEnd = true
		}
	}

	@action hydrate(data?: SaleHydration) {
		if (data && data.sales) {
			this.sales = data.sales
		}
		if (data && data.pagination) {
			const _pagination = cloneDeep(this.pagination)
			this.pagination = {
				..._pagination,
				...data.pagination,
				totalPage: Math.floor(((data.pagination?.total ?? 0) + _pagination.limit - 1) / _pagination.limit),
			}
		}
	}

	private caculateParams(total: number) {
		const _pagination = cloneDeep(this.pagination)
		this.pagination = {
			..._pagination,
			total,
			totalPage: Math.floor((total + _pagination.limit - 1) / _pagination.limit),
		}
	}
}
