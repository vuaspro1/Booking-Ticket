import { action, observable, makeObservable, flow } from 'mobx'
import RootStore from './RootStore'
import * as categoryServices from '@src/services/category.service'
import { STATE } from '@src/interfaces/enums'
import { ResponseType } from '@src/interfaces/dto/common.dto'
import { cloneDeep } from 'lodash'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '@src/contains/contants'
import { IApiResponse, IBodyError } from '@src/utils/request'
import { SaleCategory } from '@src/interfaces/dto/category.dto'
import { ListChildrenSaleCategoryParams, ListSaleCategoryParams } from '@src/interfaces/Category'

export type CategoryHydration = {
	state?: STATE
	saleCategories: SaleCategory[]

	setSaleCategories?: (_saleCategories: SaleCategory[]) => void
}

export default class CategoryStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@observable saleCategories: Partial<SaleCategory[]> = []
	@observable saleCategoryInfo: Partial<SaleCategory> = {}

	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

	@action setSaleCategories(_saleCategories: SaleCategory[]) {
		this.saleCategories = _saleCategories
	}

	@action erasedSaleCategoriesInfo() {
		this.saleCategoryInfo = {}
	}

	@flow *getSaleCategories(params: ListSaleCategoryParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<SaleCategory[]>> = yield categoryServices.getSaleCategories<
				IApiResponse<ResponseType<SaleCategory[]>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				this.saleCategories = res.data?.data || []
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

	@flow *getChildrenSaleCategories(params: ListChildrenSaleCategoryParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<SaleCategory[]>> = yield categoryServices.getChildrenSaleCategories<
				IApiResponse<ResponseType<SaleCategory[]>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				const _saleCategoryInfo = cloneDeep(this.saleCategoryInfo)
				Object.assign(
					_saleCategoryInfo,
					{},
					{
						id: params.categoryStoreId,
						children: res.data?.data || [],
					}
				)
				this.saleCategoryInfo = _saleCategoryInfo
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

	@action hydrate(data?: CategoryHydration) {
		if (data && data.saleCategories) {
			this.saleCategories = data.saleCategories
		}
	}
}
