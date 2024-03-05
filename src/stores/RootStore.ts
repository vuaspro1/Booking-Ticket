import { action, observable, makeObservable } from 'mobx'
import { create } from 'mobx-persist'
import AuthStore, { AuthHydration } from './auth.store'
import GlobalStore, { GlobalHydration } from './global.store'
import ReportStore, { ReportHydration } from './report.store'
import ProductStore, { ProductHydration } from './product.store'
import VoucherStore, { VoucherHydration } from './voucher.store'
import SaleStore, { SaleHydration } from './sale.store'
import CustomerStore, { CustomerHydration } from './customer.store'
import CategoryStore, { CategoryHydration } from './category.store'
import CartStore, { CartHydration } from './cart.store'
import ProviderStore, { ProviderHydration } from './provider.store'
import BankStore, { BankHydration } from './bank.store'
import OrderStore, { OrderHydration } from './oder.store'
import ShopStore, { ShopHydration } from './shop.store'
import CardStore, { CardHydration } from './card.store'
import WorkShiftStore, { WorkShiftHydration } from './workShift.store'
import NewStore, { NewHydration } from './new.store'
import StoreListStore, { StoreListHydration } from './storeList.store'
import UsersStore , { UsersHydration } from './users.store'
import RoleStore, { RoleHydration } from './role.store'
import UserRoleStore, { UserRoleHydration } from './userRole.store'

const isClient = typeof window !== 'undefined'
let hydrate
if (isClient) {
	hydrate = create({
		storage: localStorage,
		jsonify: true,
	})
}

export type RootStoreHydration = {
	loading?: boolean
	setLoader?: (loading: boolean) => void
	authStore?: AuthHydration
	globalStore?: GlobalHydration
	reportStore?: ReportHydration
	productStore?: ProductHydration
	voucherStore?: VoucherHydration
	saleStore?: SaleHydration
	customerStore?: CustomerHydration
	categoryStore?: CategoryHydration
	cartStore?: CartHydration
	providerStore?: ProviderHydration
	orderStore?: OrderHydration
	bankStore?: BankHydration
	shopStore?: ShopHydration
	cardStore?: CardHydration
	workShift?: WorkShiftHydration
	newStore?: NewHydration
	storeListStore?: StoreListHydration
	usersStore?:  UsersHydration
	roleStore?: RoleHydration
	userRoleStore?: UserRoleHydration
}
export default class RootStore {
	@observable loading = false
	authStore: AuthStore
	globalStore: GlobalStore
	reportStore: ReportStore
	productStore?: ProductStore
	voucherStore?: VoucherStore
	saleStore?: SaleStore
	customerStore?: CustomerStore
	categoryStore?: CategoryStore
	cartStore?: CartStore
	providerStore?: ProviderStore
	orderStore?: OrderStore
	bankStore?: BankStore
	shopStore?: ShopStore
	cardStore?: CardStore
	workShift?: WorkShiftStore
	newStore?: NewStore
	storeListStore?: StoreListStore
	usersStore?: UsersStore
	roleStore?: RoleStore
	userRoleStore?: UserRoleStore
	constructor() {
		// this.sizeSwitcherStore = sizeSwitcherStoreFactory(this);
		this.authStore = new AuthStore(this)
		this.globalStore = new GlobalStore(this)
		this.reportStore = new ReportStore(this)
		this.productStore = new ProductStore(this)
		this.voucherStore = new VoucherStore(this)
		this.saleStore = new SaleStore(this)
		this.customerStore = new CustomerStore(this)
		this.categoryStore = new CategoryStore(this)
		this.cartStore = new CartStore(this)
		this.providerStore = new ProviderStore(this)
		this.bankStore = new BankStore(this)
		this.orderStore = new OrderStore(this)
		this.shopStore = new ShopStore(this)
		this.cardStore = new CardStore(this)
		this.workShift = new WorkShiftStore(this)
		this.newStore = new NewStore(this)
		this.storeListStore = new StoreListStore(this)
		this.usersStore = new UsersStore(this)
		this.roleStore = new RoleStore(this)
		this.userRoleStore = new UserRoleStore(this)

		if (isClient) {
			hydrate('authStore', this.authStore)
			// .then(() => console.warn('authStore hydrated'))
			hydrate('cartStore', this.cartStore)
			//.then(() => console.warn('cartStore hydrated'))
		}
		makeObservable(this)
	}

	@action setLoader(_loading: boolean) {
		this.loading = _loading
	}

	@action hydrate(data: RootStoreHydration) {
		if (data.authStore) {
			this.authStore.hydrate(data.authStore)
			if (isClient) {
				hydrate('authStore', this.authStore, data.authStore)
				// .then(() => console.warn('authStore rehydrated'))
				hydrate('cartStore', this.cartStore, data.cartStore)
				// .then(() => console.warn('cartStore rehydrated'))
			}
		}
		if (data.globalStore) {
			this.globalStore.hydrate(data.globalStore)
		}
		if (data.reportStore) {
			this.reportStore.hydrate(data.reportStore)
		}
		if (data.productStore) {
			this.productStore.hydrate(data.productStore)
		}
		if (data.voucherStore) {
			this.voucherStore.hydrate(data.voucherStore)
		}
		if (data.saleStore) {
			this.saleStore.hydrate(data.saleStore)
		}
		if (data.categoryStore) {
			this.categoryStore.hydrate(data.categoryStore)
		}
		if (data.cartStore) {
			this.cartStore.hydrate(data.cartStore)
		}
		if (data.providerStore) {
			this.providerStore.hydrate(data.providerStore)
		}
		if (data.customerStore) {
			this.customerStore.hydrate(data.customerStore)
		}
		if (data.orderStore) {
			this.orderStore.hydrate(data.orderStore)
		}
		if (data.bankStore) {
			this.bankStore.hydrate(data.bankStore)
		}
		if (data.shopStore) {
			this.shopStore.hydrate(data.shopStore)
		}
		if (data.cardStore) {
			this.cardStore.hydrate(data.cardStore)
		}
		if (data.workShift) {
			this.workShift.hydrate(data.workShift)
		}
		if (data.newStore) {
			this.newStore.hydrate(data.newStore)
		}
		if (data.storeListStore) {
			this.storeListStore.hydrate(data.storeListStore)
		}
		if (data.usersStore) {
			this.usersStore.hydrate(data.usersStore)
		}
		if (data.roleStore) {
			this.roleStore.hydrate(data.roleStore)
		}
		if (data.userRoleStore) {
			this.userRoleStore.hydrate(data.userRoleStore)
		}
	}
}
