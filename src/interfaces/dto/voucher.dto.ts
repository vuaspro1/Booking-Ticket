import { CATEGORY_TYPE, REWARD_TYPE, VOUCHER_APPLY, VOUCHER_TYPE, VOUCHER_TYPE_VALUE } from '../enums'

export interface Voucher {
	id: number
	createdAt: number
	name: string
	category: CATEGORY_TYPE
	title: string
	images: string[]
	originPrice: number
	pointExchange: number
	hashtag: string
	thumbnail: string
	startDate: number
	endDate: number
	codeExpiredDuration: number
	description: string
	type: VOUCHER_TYPE
	typeValue: VOUCHER_TYPE_VALUE
	discountPercent: number
	discount: number
	point: number
	percentAccumulate: number
	pointMax: number
	apply: VOUCHER_APPLY
	codePrefix?: string
}

export interface Gift {}

export interface Stamp {}

export interface Affiliate {}

export interface Reward {
	reward_type?: REWARD_TYPE
	points_value?: number
	percentages?: number
	point_max?: number
}

export interface VoucherInCode {
	id: string
	category: string
	partner_id: string
	store_ids: string[]
	name: string
	images: string[]
	title: string
	state: string
	type: string
	point_type: string
	gift?: Gift
	stamp?: Stamp
	affiliate?: Affiliate
	reward?: Reward
	hashtags: string
	start_at: number
	end_at: number
	created: number
	updated_at: number
	get_code_method: string
	reduce_percents?: number
	autocheckout: number
	last_sync: number
}

export interface Code {
	id: string
	code: string
	voucher_id: string
	state: string
	start_at: number
	expired_at: number
	created: number
	partner_id: string
}

export interface UserVoucher {
	user_id: string
	voucher_id: string
	code_id: string
	state: string
	created: number
	type: string
	by_partner_id: string
	note: string
}

export interface CodeInfo {
	voucher_id: string
	voucher: VoucherInCode
	code_id: string
	code: Code
	user_voucher: UserVoucher
}
