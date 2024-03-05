export interface ListParam {
	skip: number
	limit: number
}

export interface ResponseType<T> {
	code?: number
	message?: string
	errorCode?: number
	data?: T
	rows?: []
	total?: number
	countCustomer?: number
	dashboard?: {
		countProduct: number
		sumInitPrice: number
	}
}

export interface IPagination {
	skip?: number
	page?: number
	limit?: number
	totalPage?: number
	total?: number
	loadMore?: boolean
}
