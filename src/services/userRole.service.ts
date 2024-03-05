import { UserRole } from "@src/interfaces/UserRole";
import request, { IApiResponse } from "@src/utils/request";


export function createUserRole<T>(data: UserRole): Promise<IApiResponse<T>> {
	return request<T>({
		url: 'api/UserRole',
		options: {
			method: 'post',
			data,
			headers: {
				
			},
		},
	})
}

