const local: any = {}
local.get = (key) => {
	const t: any = localStorage.getItem(key)
	try {
		return JSON.parse(t)
	} catch (err) {
		return t
	}
}
local.set = (key, val) => {
	localStorage.setItem(key, val)
}
local.clear = () => {
	localStorage.clear()
}
export default local
