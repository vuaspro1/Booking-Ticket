import { BANNER_ACTION, CartType } from './enums'
import { ProductParams } from './Product'

export interface ISearchResult {
	_index?: string
	_type?: string
	_id?: string
	_score?: number
	_source: {
		id?: number
		itemId?: number
		categoryId?: number
		name?: string
		images?: string
		tags?: string
		categoryName?: string
		typeSearch?: string
	}
}

export interface IBanner {
	createdAt?: number
	updatedAt?: number
	id: number
	image?: string
	isActive: boolean
	action: BANNER_ACTION
	actionData?: string
	sequence?: number
	position?: string
	dataItem?: Array<string | number | Record<string, any>>
	app?: string
}

export interface ICategory {
	id: number
	name: string
	parentId?: number
	image: string
	imageMb?: string
	type: CartType
	sequence?: number
	hotSequence?: number
	megamallSequence?: number
	isHot?: boolean
	merchantIds?: Array<number>
}

export interface IQuestionAnswer {
	id: number
	question: string
	answer: string
	sequence: number
	parentId: number
	icon: string
	type: string
	children?: IQuestionAnswer[]
}

export interface ListCallLogParams {
	page: number
	pageSize: number
}

export interface IBreadcrumb {
	nameLink?: string
	link?: string
}

export interface ShippingService {
	store_id?: string
	name?: string
	fee?: number
	carrier?: string
	provider?: string
	carrier_info?: {
		image_url?: string
		name?: string
	}
}

export interface ListShippingServiceParams {
	productId: string
	quantity: number
	provinceId: number
	districtId: number
	wardId: number
	address?: string
	chargeableWeight: number
	weight: number
	length: number
	height: number
	width: number
	value: number
}

export interface PayProductsParams {
	name: string
	phone: string
	email: string
	provinceId: number
	districtId: number
	wardId: number
	storeId: string
	paymentMethod: string
	address: string
	shippingName: string
	shipMoney: number
	orderDetails: ProductParams[]
	code?: string
}

export interface AddContactParams {
	name: string
	phone: string
	email: string
	description: string
	captcha: string
}

export interface NewsListParam {
	nameAlias: string
	status: number
	language: string
}

export interface SubmitReviewParams {
	name: string
	phone: string
	email: string
	description: string
	captchaId: string
	captcha: string
	socialUrl?: {
		instagramUrl?: string
		zaloUrl?: string | number
		facebookUrl?: string
		tiktokUrl?: string
		youtubeUrl?: string
	}
	type: string
	userId?: number
	images: string[]
}

export interface RegisterLandingPageParams {
	name: string
	phone: string
	email: string
	typePayment: string
}

export interface CalculateParams {
	listOrderItems: {
		productId: number
		quantity: number
	}[]
}

export interface CreateOrderParams {
	listOrderItems: {
		productId: number
		quantity: number
	}[]
	receiveName: string
	receivePhone: string
	receiveEmail: string
	provinceId: number
	districtId: number
	wardId: number
	companyId?: number
	address: string
	note?: string
	positionInTheOrganization: string
	companyCode?: string
}

export interface ListCompanyParams {
	application: string
}
