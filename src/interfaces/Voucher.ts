import { CATEGORY_TYPE, VOUCHER_APPLY, VOUCHER_TYPE, VOUCHER_TYPE_VALUE } from './enums'

export interface VoucherParams {
	id?: number
	name: string
	images: string[]
	thumbnail: string
	category: CATEGORY_TYPE
	title: string
	startDate: number
	endDate: number
	/**
	 * @description Điểm cần sử đụng để đổi
	 */
	pointExchange: number
	/**
	 * @description Loại voucher tích điểm hay giảm giá
	 */
	type: VOUCHER_TYPE
	/**
	 * @description Là loại cố định hay theo phần trăm
	 */
	typeValue: VOUCHER_TYPE_VALUE
	/**
	 * @description Phần trăm giảm giá với loại voucher là voucher giảm giá
	 */
	discountPercent: number
	/**
	 * @description Giảm giá cố định
	 */
	discount: number
	/**
	 * @description Với loại voucher là voucher tích điểm thì được tích cố định bao nhiêu điểm
	 */
	point: number
	/**
	 * @description Với loại voucher là voucher tích điểm thì được tích bao nhiêu phần trăm
	 */
	percentAccumulate: number
	/**
	 * @description Số điểm tối đa được tích khi tích điểm theo phần trăm
	 */
	pointMax: number
	apply: VOUCHER_APPLY

	description: string
	hashtag: string
	/**
	 * @description Thời gian code được sinh ra từ voucher hết hạn
	 */
	codeExpiredDuration: number
	codePrefix: string
	originPrice: number
}

export interface ListVoucherParams {
	skip: number
	limit: number
}
