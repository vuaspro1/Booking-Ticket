import { action, observable, makeObservable, flow, computed } from 'mobx'
import { persist } from 'mobx-persist'
import update from 'lodash/update'
import updateWith from 'lodash/updateWith'
import omit from 'lodash/omit'
import assign from 'lodash/assign'
import RootStore from './RootStore'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import * as orderServices from '@src/services/order.service'
import { CartType, STATE } from '@src/interfaces/enums'
import { IApiResponse, IBodyError } from '@src/utils/request'
import {
	CartItem,
	IProviderCart,
	CartIds,
	ICart,
	CartQuantityIds,
	ICheckoutCart,
	CartVoucher,
	CartProduct,
} from '@src/interfaces/Cart'
import { ProviderOrderParams } from '@src/interfaces/Provider'
import { DEFAULT_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '@src/contains/contants'
import { ResponseType } from '@src/interfaces/dto/common.dto'
import { cloneDeep, difference, differenceBy, forIn } from 'lodash'

export type CartHydration = {
	ids?: CartIds
	carts?: ICart
	codeCheckDetail?: any
	quantityIds?: CartQuantityIds
	providerIds: IProviderCart
	checkoutCart: ICheckoutCart
	checkedKeys: number[]
}

export default class CartStore {
	@observable state = STATE.PENDING
	@observable root: RootStore
	@observable quantityCheck: Partial<any[]> = []
	@observable codeCheckDetail: Partial<any> = {}
	@persist('object') @observable checkedKeys: Partial<number[]> = []
	@persist('object') @observable ids: CartIds = { voucher: [], product: [] }
	@persist('object') @observable carts: ICart = { voucher: [], product: [] }
	@persist('object') @observable quantityIds: CartQuantityIds = { voucher: {}, product: {} }
	/**
	 * providerIds
	 * @type {object}
	 * @description đối tượng chứa id product hoặc voucher theo từng nhà cung cấp
	 * @description "0" la prodvider default neu ko phan loai gio hang theo provider
	 * @example { "0": { voucher: [], product: [] }, "1": { voucher: [], product: [1,2,3] }, "2": { voucher: [], product: [4,5,6] } }
	 */
	@persist('object') @observable providerIds: IProviderCart = {}
	@persist('object') @observable checkoutCart: ICheckoutCart = { '0': { voucher: [], product: [] } }
	@observable cartType: CartType = CartType.PRODUCT

	constructor(root: RootStore) {
		this.root = root
		makeObservable(this)
	}

	@action setCodeCheckDetailNone() {
		this.codeCheckDetail = {}
	}

	@action setCodeCheckDetail(_data: any) {
		this.codeCheckDetail = _data
	}

	@action setCartType(_carType: CartType) {
		this.cartType = _carType
	}

	@action setQuantityCheck(id: number, quantity: number) {
		const _quantityCheck = cloneDeep(this.quantityCheck)
		const index = _quantityCheck.findIndex((i) => i.id == id)
		if (index !== -1) {
			_quantityCheck[index].quantity = Number(quantity)
		} else {
			_quantityCheck.push({ id: id, quantity: Number(quantity) })
		}
		this.quantityCheck = _quantityCheck
	}

	@action setCheckedKeys(_checkKeys: number[]) {
		this.checkedKeys = _checkKeys
	}

	@computed get getCartCheckedKeys() {
		const _checkedKeys = cloneDeep(this.checkedKeys)
		const _cart = cloneDeep(this.carts?.product)
		const arrayCartCheckedKeys = _cart?.filter(({ id }) => _checkedKeys.includes(id))
		return arrayCartCheckedKeys
	}

	@computed get getCartCheckedKeysTotalMoney() {
		const _getCartCheckedKeys = cloneDeep(this.getCartCheckedKeys)
		const _quantityIds = cloneDeep(this.quantityIds?.product)
		const totalMoney = _getCartCheckedKeys?.reduce(function (acc, cur) {
			return acc + cur.salePrice * Number(_quantityIds[cur.id])
		}, 0)
		return totalMoney
	}

	@computed get getCartCheckedKeysQuantity() {
		const _getCartCheckedKeys = cloneDeep(this.getCartCheckedKeys)
		const _quantityIds = cloneDeep(this.quantityIds?.product)
		const totalQuantity = _getCartCheckedKeys?.reduce(function (acc, cur) {
			return acc + Number(_quantityIds[cur.id])
		}, 0)
		return totalQuantity
	}

	@computed get getCartCheckedKeysWeight() {
		const _getCartCheckedKeys = cloneDeep(this.getCartCheckedKeys)
		const _quantityIds = cloneDeep(this.quantityIds?.product)
		const totalMoney = _getCartCheckedKeys?.reduce(function (acc, cur) {
			return acc + cur.weight * Number(_quantityIds[cur.id])
		}, 0)
		return totalMoney
	}

	@computed get getCartCheckedKeysWidth() {
		const _getCartCheckedKeys = cloneDeep(this.getCartCheckedKeys)
		const _quantityIds = cloneDeep(this.quantityIds?.product)
		const totalMoney = _getCartCheckedKeys?.reduce(function (acc, cur) {
			return acc + cur.width * Number(_quantityIds[cur.id])
		}, 0)
		return totalMoney
	}

	@computed get getCartCheckedKeysLength() {
		const _getCartCheckedKeys = cloneDeep(this.getCartCheckedKeys)
		const _quantityIds = cloneDeep(this.quantityIds?.product)
		const totalMoney = _getCartCheckedKeys?.reduce(function (acc, cur) {
			return acc + cur.length * Number(_quantityIds[cur.id])
		}, 0)
		return totalMoney
	}

	@computed get getCartCheckedKeysHeight() {
		const _getCartCheckedKeys = cloneDeep(this.getCartCheckedKeys)
		const _quantityIds = cloneDeep(this.quantityIds?.product)
		const totalMoney = _getCartCheckedKeys?.reduce(function (acc, cur) {
			return acc + cur.height * Number(_quantityIds[cur.id])
		}, 0)
		return totalMoney
	}

	@action addToCart({
		cartType,
		cartItem,
		quantity = 1,
	}: {
		cartType?: CartType
		cartItem: Partial<CartItem>
		quantity?: number
	}) {
		const _cartType = cartType || this.cartType
		if (_cartType === CartType.PRODUCT) {
			this.addProdToProvider(cartItem as CartProduct)
			this.addProdToCart(cartItem as CartProduct, quantity)
		} else if (_cartType === CartType.VOUCHER) {
			this.addVoucherToProvider(cartItem as CartVoucher)
			this.addVoucherToCart(cartItem as CartVoucher, quantity)
		}
	}

	@action removeFromCart({ cartType, id, providerId }: { cartType?: CartType; id: number; providerId?: number }) {
		const _cartType = cartType || this.cartType
		const _providerId = (providerId || 0).toString()
		switch (_cartType) {
			case CartType.PRODUCT:
				{
					// ids
					this.ids = updateWith(this.ids, `product`, function (curProductIds: number[]) {
						return curProductIds.filter((_id) => _id != id)
					})
					// quantityIds
					this.quantityIds = updateWith(
						this.quantityIds,
						`product`,
						function (curProductQuantitys: { [x: string]: number }) {
							return omit(curProductQuantitys, `${id}`)
						}
					)
					// providerIds
					this.providerIds = updateWith(this.providerIds, `${_providerId}.product`, function (curProductIds: number[]) {
						return curProductIds.filter((_id) => id != id)
					})
					// cart
					this.carts = updateWith(this.carts, `product`, function (curProductIds: CartProduct[]) {
						return curProductIds.filter((item) => item.id != id)
					})
				}
				break
			case CartType.VOUCHER:
				{
					// ids
					this.ids = updateWith(this.ids, `voucher`, function (curProductIds: number[]) {
						return curProductIds.filter((_id) => _id != id)
					})
					// quantityIds
					this.quantityIds = updateWith(
						this.quantityIds,
						`voucher`,
						function (curProductQuantitys: { [x: string]: number }) {
							return omit(curProductQuantitys, `${id}`)
						}
					)
					// providerIds
					this.providerIds = updateWith(this.providerIds, `${_providerId}.voucher`, function (curProductIds: number[]) {
						return curProductIds.filter((_id) => _id != id)
					})
					// cart
					this.carts = updateWith(this.carts, `voucher`, function (curProductIds: CartVoucher[]) {
						return curProductIds.filter((item) => item.id != id)
					})
				}
				break
		}
	}

	@action changeQuantityInCart({ cartType, id, quantity }: { cartType?: CartType; id: number; quantity?: number }) {
		const _cartType = cartType || this.cartType
		if (_cartType === CartType.PRODUCT) {
			const prod = this.carts.product.find((item) => item.id === id)
			if (prod) {
				const _quantityIds = this.quantityIds.product
				this.quantityIds.product = update(_quantityIds, `${id}`, function () {
					if (quantity <= 0) {
						return 1
					}
					return quantity
				})
			}
		} else if (_cartType === CartType.VOUCHER) {
			const prod = this.carts.voucher.find((item) => item.id === id)
			if (prod) {
				const _quantityIds = this.quantityIds.voucher
				this.quantityIds.voucher = update(_quantityIds, `${id}`, function (n) {
					if (n + quantity <= 0) {
						return 1
					}
					return n + quantity
				})
			}
		}
	}
	@action changeQuantityInCart1({ cartType, id, quantity }: { cartType?: CartType; id: number; quantity?: number }) {
		const _cartType = cartType || this.cartType
		if (_cartType === CartType.PRODUCT) {
			const prod = this.carts.product.find((item) => item.id === id)
			if (prod) {
				const _quantityIds = this.quantityIds.product
				this.quantityIds.product = update(_quantityIds, `${id}`, function (n) {
					if (n + quantity <= 0) {
						return 1
					}
					return n + quantity
				})
			}
		} else if (_cartType === CartType.VOUCHER) {
			const prod = this.carts.voucher.find((item) => item.id === id)
			if (prod) {
				const _quantityIds = this.quantityIds.voucher
				this.quantityIds.voucher = update(_quantityIds, `${id}`, function (n) {
					if (n + quantity <= 0) {
						return 1
					}
					return n + quantity
				})
			}
		}
	}

	@action chooseToCheckoutCart({ providerId, ids, cartType }: { cartType?: CartType; ids?: number[]; providerId?: number }) {
		const _cartType = cartType || this.cartType
		const _providerId = (providerId || 0).toString()
		const _ids = ids || this.ids
		if (_cartType === CartType.PRODUCT) {
			this.checkoutCart = updateWith(this.checkoutCart, `${_providerId}.product`, function (_prodIds) {
				return _ids
			})
		} else if (cartType === CartType.VOUCHER) {
			this.checkoutCart = updateWith(this.checkoutCart, `${_providerId}.voucher`, function (_prodIds) {
				return _ids
			})
		}
	}

	@action checkoutSuccess(cartType?: CartType) {
		const _cartType = cartType || this.cartType
		if (_cartType == CartType.PRODUCT) {
			forIn(this.checkoutCart, (values, _providerId) => {
				// ids
				this.ids = update(this.ids, `product`, function (curProductIds: number[]) {
					return difference(curProductIds, values.product)
				})
				// quantityIds
				this.quantityIds = update(this.quantityIds, `product`, function (curProductQuantitys: { [x: string]: number }) {
					return omit(curProductQuantitys, `${values.product.join(',').toString()}`)
				})
				// providerIds
				this.providerIds = omit(this.providerIds, `${_providerId}`)
				// cart
				this.carts = update(this.carts, `product`, function (curProductIds: CartProduct[]) {
					return differenceBy(
						curProductIds,
						values.product.map((i) => ({
							id: i,
						})),
						'id'
					)
				})
			})
		} else if (_cartType == CartType.VOUCHER) {
			forIn(this.checkoutCart, (values, _providerId) => {
				// ids
				this.ids = update(this.ids, `voucher`, function (curProductIds: number[]) {
					return difference(curProductIds, values.product)
				})
				// quantityIds
				this.quantityIds = update(this.quantityIds, `voucher`, function (curProductQuantitys: { [x: string]: number }) {
					return omit(curProductQuantitys, `${values.product.join(',').toString()}`)
				})
				// providerIds
				this.providerIds = omit(this.providerIds, `${_providerId}`)
				// cart
				this.carts = update(this.carts, `voucher`, function (curProductIds: CartProduct[]) {
					return differenceBy(
						curProductIds,
						values.product.map((i) => ({
							id: i,
						})),
						'id'
					)
				})
			})
		}
		this.checkoutCart = { '0': { voucher: [], product: [] } }
	}

	@action getCartItem({ cartType, id }: { cartType?: CartType; id: number }) {
		const _cartType = cartType || this.cartType
		if (_cartType === CartType.PRODUCT) {
			return this.carts['product'].find((i) => i.id == id)
		} else if (cartType === CartType.VOUCHER) {
			return this.carts['voucher'].find((i) => i.id == id)
		}
	}

	@action getItemQuantity({ cartType, id }: { cartType?: CartType; id: number }) {
		const _cartType = cartType || this.cartType
		if (_cartType === CartType.PRODUCT) {
			return this.quantityIds['product'][id] || 0
		} else if (cartType === CartType.VOUCHER) {
			return this.quantityIds['voucher'][id] || 0
		}
	}

	@action resetCart() {
		this.ids = { voucher: [], product: [] }
		this.carts = { voucher: [], product: [] }
		this.quantityIds = { voucher: {}, product: {} }
		this.providerIds = {}
		this.checkoutCart = { '0': { voucher: [], product: [] } }
		this.quantityCheck = []
		this.checkedKeys = []
	}

	@flow *getCode(code: string) {
		this.state = STATE.PROCESSING
		try {
			const res: IApiResponse<ResponseType<any>> = yield orderServices.getCode<IApiResponse<ResponseType<any>>>(code)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data) {
				// this.codeCheckDetail = res.data.data
				return res.data
			}
			return {
				errorCode: res.data?.code || (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	@flow *getCheckCode(code: string) {
		this.state = STATE.PROCESSING
		try {
			const res: IApiResponse<ResponseType<any>> = yield orderServices.getCheckCode<IApiResponse<ResponseType<any>>>(code)
			this.state = STATE.DONE
			if (res.status === HttpStatusCode.OK && res.data) {
				return res.data
			}
			return {
				errorCode: res.data?.code || (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	@flow *checkout(params: ProviderOrderParams) {
		const token = this.root.authStore.token
		if (!token) {
			return {
				errorCode: HttpStatusCode.UNAUTHORIZED,
				message: UNAUTHORIZED_ERROR_MESSAGE,
			}
		}
		this.root.loading = true
		this.state = STATE.PROCESSING
		try {
			const res: IApiResponse<ResponseType<any>> = yield orderServices.createProviderOrder(params, this.root.authStore.token)
			if (res.status === HttpStatusCode.OK && res.data && res.data.code == 0) {
				this.state = STATE.DONE
				this.root.loading = false
				return res.data
			}
			return {
				errorCode: res.data?.code || (res.data as IBodyError).errorCode || HttpStatusCode.UNKNOW_ERROR,
				message: (res.data as IBodyError).message || DEFAULT_ERROR_MESSAGE,
			}
		} catch (error) {
			this.state = STATE.ERROR
			this.root.loading = false
			return {
				errorCode: HttpStatusCode.UNKNOW_ERROR,
				message: error.message,
			}
		}
	}

	@action hydrate(data?: CartHydration) {
		if (data && data.carts) {
			this.carts = data.carts
		}
		if (data && data.ids) {
			this.ids = data.ids
		}
		if (data && data.quantityIds) {
			this.quantityIds = data.quantityIds
		}
		if (data && data.codeCheckDetail) {
			this.codeCheckDetail = data.codeCheckDetail
		}
		if (data && data.checkoutCart) {
			this.checkoutCart = data.checkoutCart
		}
		if (data && data.checkedKeys) {
			this.checkedKeys = data.checkedKeys
		}
	}

	protected addProdToProvider(_product: CartProduct) {
		const _providerId = (_product.providerid || 0).toString()
		const _productId = _product.id
		this.providerIds = updateWith(this.providerIds, `${_providerId}.product`, function (_curProds: number[] | undefined) {
			if (!_curProds) {
				return [_productId]
			}
			if (_curProds.indexOf(_productId) < 0) {
				return _curProds
			}
			return _curProds.push(_productId)
		})
	}

	protected addVoucherToProvider(_voucher: CartVoucher) {
		const _providerId = (_voucher.providerid || 0).toString()
		const _voucherId = _voucher.id
		this.providerIds = updateWith(this.providerIds, `${_providerId}.voucher`, function (_curProds: number[] | undefined) {
			if (!_curProds) {
				return [_voucherId]
			}
			if (_curProds.indexOf(_voucherId) < 0) {
				return _curProds
			}
			return _curProds.push(_voucherId)
		})
	}

	protected addProdToCart(_product: CartProduct, quantity: number) {
		const productAdd = this.carts.product.find((item) => item.id === _product.id)
		let _quantityIds = this.quantityIds.product
		if (productAdd) {
			this.quantityIds.product = update(_quantityIds, `${_product.id}`, function (n) {
				if (n + quantity <= 0) {
					return 0
				}
				return n + quantity
			})
		} else {
			this.carts.product.push(_product)
			this.ids.product.push(_product.id)
			_quantityIds = assign(_quantityIds, { [_product.id]: quantity })
			this.quantityIds.product = _quantityIds
		}
	}

	protected addVoucherToCart(voucher: CartVoucher, quantity: number) {
		const voucherAdd = this.carts.voucher.find((item) => item.id === voucher.id)
		let _quantityIds = this.quantityIds.voucher
		if (voucherAdd) {
			this.quantityIds.voucher = update(_quantityIds, `${voucher.id}`, function (n) {
				if (n + quantity <= 0) {
					return 0
				}
				return n + quantity
			})
		} else {
			this.carts.voucher.push(voucher)
			this.ids.voucher.push(voucher.id)
			_quantityIds = assign(_quantityIds, { [voucher.id]: quantity })
			this.quantityIds.voucher = _quantityIds
		}
	}
}
