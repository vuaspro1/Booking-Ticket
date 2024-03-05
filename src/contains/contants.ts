export const DEFAULT_WAIT_SECONDS = 500
export const DEFAULT_ERROR_MESSAGE = 'Hệ thống đang bận vui lòng thực hiện sau'
export const UNAUTHORIZED_ERROR_MESSAGE = 'Hệ thống đang bận vui lòng thực hiện sau'

export const DEFAULT_REFRESH_INFO = 1000 * 60 * 5

export const PAYMENT_STATUS_SUCCESS = '00'

export const RULE_PHONE = {
	// pattern: /(03|05|07|08|09)+([0-9]{0,12})\b/,
	// message: 'Số điện thoại không đúng định dạng.',
	pattern:
		/^(086|096|097|098|032|033|034|035|036|037|038|039|091|094|088|083|084|085|081|082|089|090|093|070|079|077|076|078|092|056|058|099|059)\d{7,8}$/,
	message: 'Số điện thoại không đúng định dạng.',
}

export const RULE_EMAIL = {
	pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+.+.[A-Za-z]{2,4}/,
	message: 'Email không đúng định dạng.',
}

export const RULE_FACEBOOK_URL = {
	pattern: /^(https?:\/\/)?(www\.)?facebook.com\/[A-Za-z0-9._%+-]/,
	message: 'URL facebook không đúng định dạng.',
}

export const PAYMENT_SUCCESS_MESSAGE = {
	title: 'Thanh toán thành công',
	message: 'Bạn đã thực hiện thanh toán thành công!',
}

export const PAYMENT_FAIL_MESSAGE = {
	title: 'Thanh toán thất bại',
	message: 'Giao dịch thanh toán của bạn không thành công!',
}
