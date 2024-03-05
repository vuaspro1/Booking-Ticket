import { Rate } from './dto/orderProvider'

export interface OrderProdviderResponseType<T> {
	code?: number
	message?: string
	errorCode?: number
	data?: T
	rate: Rate
	[x: string]: any
}
