

export interface IUsersResponse {
	data?: {
		userName: string
		accessToken: string
		// tokenChat: string
		// chatId: string
		// storeInfo: StoreInfo
		// partnerInfo?: PartnerInfo
		roles: string
	}
}

export interface Users {
    id: string
    userName?: string
    name?: string
    phone?: string
    address?: string 
    dateOfBirth: string
	roles?: string
}

export interface IUsers {
	id?:  number,
    userName?: string
    name?: string
	roles?: string
}

export interface UserParams {
    userName?: string
    name?: string
    phone?: string
    address?: string 
    dateOfBirth: string
	password: string
}

export interface IUserPost extends IUserPut {
	userName: string;
  }
  
  export interface IUserPut {
	name: string;
	phone: string;
	password: string;
	dateOfBirth: string;
	address: string;
  }
  
  export interface IUserModalUpdate extends IUserModalAdd {
	dataUserEdit: any;
  }
  
  export interface ITableUser {
	listUsers: any;
	handleDeleteUser: any;
	handleEditUser: any;
  }
  
  export interface IUserModalDelete {
	handleClose: any;
	show: any;
	selectId: number;
	handleUpdateTable: any;
  }
  
  export interface IUserModalAdd {
	handleClose: any;
	show: any;
	handleUpdateTable: any;
	listRoles: any;
  }

  export interface IFindUser {
	search: string;
  }