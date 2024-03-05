import Validator from 'fastest-validator'

export const validateRegisterParams = new Validator({
	useNewCustomCheckerFunction: true,
	messages: {
		stringEmpty: 'Trường này là bắt buộc',
		isPasswordLength: 'Mật khẩu phải có độ dài từ 6 - 32 ký tự',
		isInvalidEmail: 'Email không hợp lệ',
		isInvalidPhone: 'Số điện thoại không hợp lệ',
		required: 'Trường này là bắt buộc',
		number: 'Trường này là bắt buộc',
	},
})
