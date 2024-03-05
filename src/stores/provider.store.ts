import { action, observable, makeObservable, flow, computed } from 'mobx'
import RootStore from './RootStore'
import * as providerServices from '@src/services/provider.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { STATE } from '@src/interfaces/enums'
import { IApiResponse, IBodyError } from '@src/utils/request'
import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '@src/contains/contants'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import { CategoryProvider, ProductProvider, Provider } from '@src/interfaces/dto/provider.dto'
import {
	ListProviderCategoryParams,
	ListProviderParams,
	ListProviderProductParams,
	ProviderProductParams,
} from '@src/interfaces/Provider'
import Config from '@src/contains/Config'
import { clone, cloneDeep } from 'lodash'

export type ProviderHydration = {
	state?: STATE
	providers: Partial<Provider>[]
	categories: Partial<CategoryProvider>[]
	products: Partial<ProductProvider>[]
	productInfo: Partial<ProductProvider>
	pagination?: IPagination

	setProviders?: (_providers: Provider[]) => void
	setCategories?: (_categories: CategoryProvider[]) => void
	setProducts?: (_products: ProductProvider[]) => void
	setProductInfo?: (_productInfo: ProductProvider) => void
	setPagination?: (_data: IPagination) => void
}

export default class ProviderStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@observable providers: Partial<Provider>[] = []
	@observable categories: Partial<CategoryProvider>[] = []
	@observable products: Partial<ProductProvider>[] = []
	@observable productInfo: Partial<ProductProvider> = {}
	@observable pagination: IPagination = {
		skip: 0,
		page: 1,
		limit: Config.PAGE_SIZE,
		totalPage: 0,
		total: 0,
		loadMore: false,
	}
	@observable hasEnd = false
	@observable params: Partial<ListProviderProductParams> = {
		skip: this.pagination.skip,
		limit: this.pagination.limit,
	}

	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

	@action setProviders(_providers: Provider[]) {
		this.providers = _providers
	}

	@action setCategories(_categories: CategoryProvider[]) {
		this.categories = _categories
	}

	@action setProducts(_products: ProductProvider[]) {
		this.products = _products
	}

	@action setProductsNull() {
		this.products = []
	}

	@action setCategoriesNull() {
		this.categories = []
	}

	@action setParams(_data: ListProviderProductParams) {
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
		const _pagination = clone(this.pagination)
		Object.assign(_pagination, {
			page: page,
		})
		this.pagination = _pagination
	}

	@action setLimit(limit: number) {
		const _pagination = clone(this.pagination)
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

	@computed get isChangeParams() {
		return this.params
	}

	@action setProductInfo(_productInfo: ProductProvider) {
		this.productInfo = _productInfo
	}

	@flow *getListProviders(params: ListProviderParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<Provider[]>> = yield providerServices.getListProviders<
				IApiResponse<ResponseType<Provider[]>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data?.code == 0) {
				this.providers = res.data?.data || []
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

	@flow *getListProviderCategories(params: ListProviderCategoryParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<CategoryProvider[]>> = yield providerServices.getListProviderCategories<
				IApiResponse<ResponseType<CategoryProvider[]>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data?.code == 0) {
				this.categories = res.data?.data || []
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

	@flow *getListProviderProducts(params: ListProviderProductParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<ProductProvider[]>> = yield providerServices.getListProviderProducts<
				IApiResponse<ResponseType<ProductProvider[]>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				const data: ProductProvider[] = res.data?.data || []
				this.caculateParams(res.data?.total || res.data?.dashboard.countProduct || 0)
				if (!this.pagination.loadMore) {
					this.products = data
				} else {
					this.products = [...this.products, ...data]
				}
				if (res.data?.data?.length == 0) {
					if (this.hasEnd == false) {
						this.hasEnd = true
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

	@flow *getProviderProductInfo(params: ProviderProductParams) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<ProductProvider>> = yield providerServices.getProviderProductInfo<
				IApiResponse<ResponseType<ProductProvider>>
			>(params, token)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data && res.data?.code == 0) {
				this.productInfo = res.data?.data || {}
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

	@action async loadMore() {
		this.root.loading = true
		if (this.pagination.totalPage >= this.pagination.page) {
			const _params: ListProviderProductParams = {
				...this.params,
				skip: (this.pagination.skip + this.pagination.limit) * (this.pagination.page - 1),
				limit: this.pagination.limit,
			}
			// await wait(DEFAULT_WAIT_SECONDS)
			this.getListProviderProducts(_params)
		} else {
			this.hasEnd = true
		}
	}

	@action hydrate(data?: ProviderHydration) {
		if (data && data.providers) {
			this.providers = data.providers
		}
		if (data && data.categories) {
			this.categories = data.categories
		}
		if (data && data.products) {
			this.products = data.products
		}
		if (data && data.productInfo) {
			this.productInfo = data.productInfo
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
