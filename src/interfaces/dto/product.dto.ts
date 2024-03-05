export interface Product {
	id: number
	name: string
	image: any
	barcode: string
	unit: string
	initPrice: number
	salePrice: number
	originPrice: number
	quantity: number
	categoryId: number
	thumbnail: any
	price: number
}

export interface ListProducts {
	id: number
	quantity: number
	name: string
	barcode: string
	salePrice: number
}
