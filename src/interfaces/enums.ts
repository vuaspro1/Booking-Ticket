export enum TRANSACTION_TYPE {
	ACCUMULATE = 'accumulate',
	EXCHANGE = 'exchange',
}

export enum GENDER {
	MALE = 'male',
	FEMALE = 'female',
	OTHER = 'other',
}

export enum GENDER_TYPE {
	MALE = 1,
	FEMALE = 0,
	OTHER = 2,
}

export enum CartType {
	PRODUCT = 'product',
	VOUCHER = 'voucher',
}

export enum BANNER_ACTION {
	VOUCHER_INFO = 'voucherInfo',
	OPEN_URL = 'openUrl',
	PRODUCT_INFO = 'productInfo',
	REDIRECT = 'redirect',
}

export enum STATE {
	PENDING = 'pending',
	PROCESSING = 'processing',
	DONE = 'done',
	ERROR = 'error',
}

export enum HISTORY_EXCHANGE_TYPE {
	ACCUMULATE = 'accumulate',
	EXCHANGE = 'exchange',
}

export enum NOTIFICATION_TYPE {
	PERSONAL = '2',
	ALL = '1',
}

export enum MY_VOUCHER_USED {
	USED = 1,
	NOT_USED = 0,
}

export enum ORDER_ITEM_STATUS {
	WAIT_FOR_ADMIN_CONFIRM = 'wait_for_admin_confirm',
	SHIPPING = 'shipping',
	COMPLETED = 'completed',
	CANCELED = 'canceled',
}

export enum CALLLOG_TYPE {
	IN = 'in',
	OUT = 'out',
}

export enum REVENUE_TYPE {
	YEAR = 'year',
	MONTH = 'month',
	DAY = 'day',
	HOURS = 'hours',
}

export enum CATEGORY_TYPE {
	TRAVEL = 'travel',
	SHOPPING = 'shopping',
	ENTERTAINMENT = 'entertainmant',
	TRANSPORT = 'transport',
	EDUCATION = 'education',
	HEALTH = 'health',
	ELECTRONICS = 'electronics',
	TECHNOLOGY_EQUIPMENT = 'technology_equipment',
}

export enum VOUCHER_TYPE {
	ACCUMULATE = 'accumulate',
	DISCOUNT = 'discount',
	BOTH = 'both',
}

export enum VOUCHER_TYPE_VALUE {
	CONSTANT = 'constant',
	PERCENTAGE = 'percentage',
}

export enum VOUCHER_APPLY {
	CARDCODE = 'cardcode',
	ALL = 'all',
}

export enum ORDER_STATUS {
	PENDING = 'pending',
	SHIPPING = 'shipping',
	COMPLETED = 'completed',
	CANCELED = 'canceled',
	SHIPPED = 'shipped',
}

export enum CUSTOMER_REPORT_TYPE {
	POINT_REPORT = 'pointReport',
	SALE_REPORT = 'saleReport',
}

/**
 * @description {Payme}
 * @description {Vnpay}
 */
export enum PAYMENT_PROVIDER {
	PAY_ME = 'Payme',
	VN_PAY = 'Vnpay',
}

/**
 * @description {money}
 * @description {card}
 * @description {online}
 */
export enum PAYMENT_METHOD {
	MONEY = 'money',
	CARD = 'card',
	ONLINE = 'online',
	COD = 'cod',
}

/**
 * @description {point}
 * @description {percentage}
 */
export enum REWARD_TYPE {
	POINT = 'point',
	PERCENTTAGE = 'percentage',
}

/**
 * loại báo cáo
 * @description {sell} - bán hàng
 * @description {import} - nhập hàng
 */
export enum REPORT_SALE_TYPE {
	SELL = 'sell',
	IMPORT = 'import',
}

export enum SERVICE_CENTER_TAB {
	NOTICE = 'Notice',
	QUESTIONS = 'Questions',
	Q_AND_A = 'Q&A',
}

export enum SHIPPING_METHOD {
	COD = 'Cod',
	ONLINE = 'online',
}
