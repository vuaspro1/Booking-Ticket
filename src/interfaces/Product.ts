export interface ProductParams {
	name?: string
	image?: string
	barcode?: string
	quantity?: number
	categoryId?: string
	unit?: string
	initPrice?: number
	salePrice?: number
	cash?: number
	payment_cash?: number
	description?: string
	originPrice?: number
	weight?: number
	id?: number
	length?: number
	height?: number
	width?: number
	refId?: string
	providerid?: number
}

export interface ListProductParams {
	skip?: number
	limit?: number
	name?: string
	categoryId?: string
	query?: ListProductQueryParams
}

export interface ListProductQueryParams {
	status: string
}
