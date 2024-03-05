export interface CustomerInfoParams extends Record<string, any> {
	name: string
	email?: string
	birth?: string | number
	gender?: string | number
	address?: string
	avatar?: string

	province: number
	district: number
	ward: number
	storePhone: string
	storeOwnerPhone: string
	storeOwnerName: string
	lat: number
	lng: number
}

export interface UpdateInfoParams extends Record<string, any> {
	firstName: string
	lastName: string
	email: string
	avatar: string
	phone: string
	address: string
}

export interface UpdateCustomerParams extends Partial<Omit<CustomerInfoParams, 'email' | 'birth' | 'gender' | 'avatar'>> {}
