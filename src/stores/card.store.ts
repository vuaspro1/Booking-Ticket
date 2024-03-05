import { action, observable, makeObservable, computed, flow } from 'mobx'
import RootStore from './RootStore'
import * as cardServices from '@src/services/card.service'
import { STATE } from '@src/interfaces/enums'
import { ListCardParams, CreateCardParms } from '@src/interfaces/dto/card.dto'
import { IPagination, ResponseType } from '@src/interfaces/dto/common.dto'
import Config from '@src/contains/Config'
import { Card } from '@src/interfaces/Card'
import cloneDeep from 'lodash/cloneDeep'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '@src/contains/contants'
import { IApiResponse, IBodyError } from '@src/utils/request'
import { clone } from 'lodash'

export type CardHydration = {
	state?: STATE
	cards: Card[]
	pagination?: IPagination

	setCards?: (_cards: Card[]) => void
	setPagination?: (_data: IPagination) => void
}
export default class CardStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@observable cards: Partial<Card[]> = []
	@observable pagination: IPagination = {
		skip: 0,
		page: 1,
		limit: Config.PAGE_SIZE,
		totalPage: 0,
		total: 0,
		loadMore: false,
	}
	@observable hasEnd = false
	@observable params: Partial<ListCardParams> = {
		skip: this.pagination.skip,
		limit: this.pagination.limit,
	}

	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

	@action setCards(_cards: Card[]) {
		this.cards = _cards
	}

	@action setParams(_data: ListCardParams) {
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

	@flow *createCard(params: CreateCardParms) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<any>> = yield cardServices.createCard<IApiResponse<ResponseType<any>>>(
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
	}

	@flow *setDefaultCard(cardDefaultId: number) {
		this.state = STATE.PROCESSING
		try {
			const token = this.root.authStore.token
			if (!token) {
				return {
					errorCode: HttpStatusCode.UNAUTHORIZED,
					message: UNAUTHORIZED_ERROR_MESSAGE,
				}
			}
			const res: IApiResponse<ResponseType<any>> = yield cardServices.setCardImageDefault<IApiResponse<ResponseType<any>>>(
				cardDefaultId,
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

	@flow *getListCards(params: ListCardParams) {
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
			const res: IApiResponse<ResponseType<Card[]>> = yield cardServices.getListCards(_params, token)
			this.state = STATE.DONE
			this.root.loading = false
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				const data: Card[] = res.data?.data || []
				this.caculateParams(res.data?.total || 0)
				if (!this.pagination.loadMore) {
					this.cards = data
				} else {
					this.cards = [...this.cards, ...data]
				}
				if (res.data?.data?.length == 0) {
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

	@action async loadMore() {
		this.root.loading = true
		if (this.pagination.totalPage >= this.pagination.page) {
			const _params: ListCardParams = {
				...this.params,
				skip: (this.pagination.skip + this.pagination.limit) * (this.pagination.page - 1),
				limit: this.pagination.limit,
			}
			// await wait(DEFAULT_WAIT_SECONDS)
			this.getListCards(_params)
		} else {
			this.hasEnd = true
		}
	}

	@action hydrate(data?: CardHydration) {
		if (data && data.cards) {
			this.cards = data.cards
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
