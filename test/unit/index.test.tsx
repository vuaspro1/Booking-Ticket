/* import React from 'react'
import { render, fireEvent } from '../testUtils'
import Home from '../../pages/index'

describe('Home page', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(<Home />, {})
		expect(asFragment()).toMatchSnapshot()
	})

	it('clicking button triggers alert', () => {
		const { getByText } = render(<Home />, {})
		window.alert = jest.fn()
		fireEvent.click(getByText('Test Button'))
		expect(window.alert).toHaveBeenCalledWith('With typescript and Jest')
	})
}) */

// import { toJS } from 'mobx'
import RootStore from '../../src/stores/RootStore'
import CartStore from '../../src/stores/cart.store'

const store = new RootStore()
const cartStore = store.cartStore

const newProduct = {
	id: 1,
	providerid: 1,
}

const newProduct1 = {
	id: 2,
	providerid: 1,
}

const newProduct2 = {
	id: 3,
	providerid: 2,
}

const newProduct3 = {
	id: 5,
	// providerid: 2,
}

describe('CartStore', () => {
	it('creates new CartStore', () => {
		expect(cartStore).toBeInstanceOf(CartStore)
	})

	it('CartStore addToCart', () => {
		cartStore.addToCart({ cartItem: newProduct, quantity: 100 })
		cartStore.addToCart({ cartItem: newProduct1, quantity: 1000 })
		cartStore.addToCart({ cartItem: newProduct2, quantity: 100 })
		cartStore.addToCart({ cartItem: newProduct3, quantity: 100 })
		expect(cartStore).toMatchSnapshot()
	})

	it('CartStore changeQuantityInCart', () => {
		cartStore.changeQuantityInCart({ id: 1, quantity: -10 })
		/* const quantityIds = {
			product: {
				'1': 90,
			},
			voucher: {},
		} */
		expect(cartStore.quantityIds.product[1]).toBe(90)
	})

	it('CartStore removeFromCart', () => {
		cartStore.removeFromCart({ id: 2 })
		expect(cartStore).toMatchSnapshot()
	})

	it('CartStore chooseToCheckoutCart', () => {
		cartStore.chooseToCheckoutCart({ providerId: 1, ids: [1] })

		expect(cartStore).toMatchSnapshot()
		/* const _checkoutCart = {
			'1': {
				product: [1],
				voucher: [],
			},
		}
		expect(cartStore.checkoutCart).toEqual(_checkoutCart) */
	})

	it('CartStore getCartItem', () => {
		const prod = cartStore.getCartItem({ id: 1 })
		expect(prod).toEqual(newProduct)
	})

	it('CartStore getItemQuantity', () => {
		const quantity = cartStore.getItemQuantity({ id: 1 })
		expect(quantity).toBe(90)
	})

	it('CartStore checkoutSuccess', () => {
		cartStore.checkoutSuccess({ providerId: 1, ids: [1] })
		expect(cartStore).toMatchSnapshot()
	})
})
