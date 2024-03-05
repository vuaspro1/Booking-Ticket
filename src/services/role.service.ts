import request from "@src/utils/request";


export function getListRoles<T>() {
	return request<T>({
		url: 'api/Role?page=0&pageSize=10',
		options: {
			method: 'get',
			headers: {
			},
		},
	})
}