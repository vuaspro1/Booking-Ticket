import dayjs from 'dayjs'
import { cryptoUtils } from './cryptoUtils'
import Config from '@src/contains/Config'

export const checkSum = (phone: string) => {
	const secretKey = Config.serverRuntimeConfig.SECRET_KEY_CONFIRM
	return cryptoUtils.hmacsha1(phone + secretKey + dayjs().format('DD/MM/YYYY'), secretKey)
}

export const hashWhenOtp = (phone: string) => {
	const secretKey = Config.publicRuntimeConfig.SECRET_KEY_OTP
	return cryptoUtils.md5Npm(phone + secretKey + dayjs().format('DD/MM/YYYY'))
	// return cryptoUtils.md5(phone + secretKey + dayjs().format('DD/MM/YYYY'))
}

export function dequy<
	T extends {
		id: number
		parentId: number
		children?: {
			id: number
			parentId: number
			[x: string]: any
		}[]
		[x: string]: any
	}
>({ parentId, data, arr = [] }: { parentId?: number; data: T[]; arr?: T[] }) {
	if (!arr) {
		arr = []
	}
	if (typeof parentId == 'undefined' || parentId == 0) {
		const arrParents = data.filter((i) => !i.parentId || i.parentId == 0)
		if (arrParents.length <= 0) {
			return arr
		} else {
			for (let index = 0; index < arrParents.length; index++) {
				const element: T = arrParents[index]
				if (!element.children) {
					element.children = []
				}
				const childs = dequy({
					parentId: element.id,
					data,
					arr: element.children,
				})
				if (childs.length <= 0) {
					delete element.children
				} else {
					element.children = childs
				}
				arr.push(element)
			}
		}
	} else {
		const arrParents = data.filter((i) => i.parentId == parentId)
		if (arrParents.length <= 0) {
			return arr
		} else {
			for (let index = 0; index < arrParents.length; index++) {
				const element: T = arrParents[index]
				if (!element.children) {
					element.children = []
				}
				const childs = dequy({
					parentId: element.id,
					data,
					arr: element.children,
				})
				if (childs.length <= 0) {
					delete element.children
				} else {
					element.children = childs
				}
				arr.push(element)
			}
		}
	}
	return arr
}
