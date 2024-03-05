import { ProductProvider } from '@src/interfaces/dto/provider.dto'
import { Voucher } from '@src/interfaces/dto/voucher.dto'

export type CartIds = {
	voucher: number[]
	product: number[]
}

export type CartQuantityIds = {
	voucher: { [x: string]: number }
	product: { [x: string]: number }
}

export interface ICheckoutCart {
	[x: string]: {
		voucher: []
		product: []
	}
}

export type CartProduct = Partial<Omit<ProductProvider, 'id' | 'providerid'>> & {
	id: number
	providerid?: number
}

export type CartVoucher = Partial<Omit<Voucher, 'id'>> & {
	id: number
	providerid?: number
}

export type CartItem = CartProduct | CartVoucher

export interface ICart {
	voucher: CartVoucher[]
	product: CartProduct[]
}

export interface IProviderCart {
	[x: string]: { voucher: number[]; product: number[] }
}
