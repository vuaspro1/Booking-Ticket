import { RULE_EMAIL, RULE_PHONE } from '@src/contains/contants'
import { ValidationRuleObject } from 'fastest-validator'

type ValidationRuleObjectCustom = ValidationRuleObject
type ActionParamSchema = ValidationRuleObjectCustom | ValidationRuleObjectCustom[]
type ActionParamTypes =
	| 'any'
	| 'array'
	| 'boolean'
	| 'custom'
	| 'date'
	| 'email'
	| 'enum'
	| 'forbidden'
	| 'function'
	| 'number'
	| 'object'
	| 'string'
	| 'url'
	| 'uuid'
	| boolean
	| string
	| ActionParamSchema
export type ValidateRuleSchema = { [key: string]: ActionParamTypes }

export const SCHEMA_REGISTER_PARAMS: ValidateRuleSchema = {
	username: {
		type: 'string',
		empty: false,
	},
	password: {
		type: 'string',
		custom: (value, errors) => {
			if (!value) errors.push({ type: 'stringEmpty' })
			else if (value.length < 6) {
				errors.push({ type: 'isPasswordLength' })
			}
			return value
		},
	},
	email: {
		type: 'string',
		custom: (value, errors) => {
			if (!value) errors.push({ type: 'stringEmpty' })
			else if (value && !RULE_EMAIL.pattern.test(value)) {
				errors.push({ type: 'isInvalidEmail' })
			}
			return value
		},
	},
	firstName: {
		type: 'string',
		empty: false,
	},
	lastName: {
		type: 'string',
		empty: false,
	},
}

export const SCHEMA_USER_PARAMS: ValidateRuleSchema = {
	phone: {
		type: 'string',
		custom: (value, errors) => {
			if (!value) errors.push({ type: 'stringEmpty' })
			else if (value && !RULE_PHONE.pattern.test(value)) {
				errors.push({ type: 'isInvalidPhone' })
			}
			return value
		},
	},
	email: {
		type: 'string',
		custom: (value, errors) => {
			if (!value) errors.push({ type: 'stringEmpty' })
			else if (value && !RULE_EMAIL.pattern.test(value)) {
				errors.push({ type: 'isInvalidEmail' })
			}
			return value
		},
	},
	firstName: {
		type: 'string',
		empty: false,
	},
	lastName: {
		type: 'string',
		empty: false,
	},
	address: {
		type: 'string',
		empty: false,
	},
}

export const SCHEMA_PAY_PARAMS: ValidateRuleSchema = {
	phone: {
		type: 'string',
		custom: (value, errors) => {
			if (!value) errors.push({ type: 'stringEmpty' })
			else if (value && !RULE_PHONE.pattern.test(value)) {
				errors.push({ type: 'isInvalidPhone' })
			}
			return value
		},
	},
	email: {
		type: 'string',
		custom: (value, errors) => {
			if (!value) errors.push({ type: 'stringEmpty' })
			else if (value && !RULE_EMAIL.pattern.test(value)) {
				errors.push({ type: 'isInvalidEmail' })
			}
			return value
		},
	},
	name: {
		type: 'string',
		empty: false,
	},
	typePeople: {
		type: 'string',
		empty: false,
	},
	// companyCode: {
	// 	type: 'string',
	// 	empty: false,
	// },
	// type: {
	// 	type: 'string',
	// 	empty: false,
	// },
	congDoan: {
		type: 'string',
		empty: false,
	},
	note: {
		type: 'string',
		empty: true,
		custom: (value, errors, schema, name, parent, context) => {
			if (context.data.congDoan == '0' && !value) errors.push({ type: 'stringEmpty' })
			return value
		},
	},
	address: {
		type: 'string',
		empty: false,
	},
	province: {
		type: 'string',
		custom: (value, errors) => {
			if (!value) errors.push({ type: 'stringEmpty' })
			return value
		},
	},
	district: {
		type: 'string',
		custom: (value, errors) => {
			if (!value) errors.push({ type: 'stringEmpty' })
			return value
		},
	},
	ward: {
		type: 'string',
		custom: (value, errors) => {
			if (!value) errors.push({ type: 'stringEmpty' })
			return value
		},
	},
}
