import React, { FC, useEffect, useState } from 'react'
import { withServerSideProps } from '@src/helpers/wrapperProps'
import { GetServerSideProps } from 'next'
import withLayout from '@src/lib/withLayout'
// import Link from 'next/link'
// import AuthStore from '@src/stores/auth.store'
import { inject } from 'mobx-react'
import { observer } from 'mobx-react-lite'
import { RootStoreHydration } from '@src/stores/RootStore'
// import PageLoading from '@src/helpers/PageLoadingcss'
import TableUser from '@src/components/User/TableUser'
import { IconButton } from 'rsuite'
import SearchIcon from '@rsuite/icons/Search'
import { UsersHydration } from '@src/stores/users.store'
// import { IApiResponse } from '@src/utils/request'
import * as usersServices from '@src/services/users.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import ModalAddUser from '@src/components/User/ModalAddUser'
import { Pagination } from 'rsuite'
import UsersStore from '@src/stores/users.store'
import { flowResult } from 'mobx'

interface IndexProps {
	// authStore: AuthStore
	usersStore: UsersStore
}

const Index: FC<IndexProps> = (props: IndexProps) => {
	const { usersStore } = props
	const [activePage, setActivePage] = React.useState(1)
	const [totalPages, setTotalPages] = useState(0)
	const [keyword, setKeyWord] = useState('')

	const [isShowModalAdd, setIsShowModalAdd] = useState(false)

	const handleClose = () => {
		setIsShowModalAdd(false)
	}

	const getUsers = async (page: any) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const res = await flowResult<any>(usersStore?.getListUsers?.(page))
		if (res && res.data) {
			setTotalPages(res?.totalItem)
		}
	}

	const handleUpdateTable = () => {
		getUsers(activePage)
	}
	
	useEffect(() => {
		getUsers(activePage)
	}, [activePage])

	const handleSearch = async () => {
		if (keyword) {
			const res = await flowResult<any>(usersStore?.findUsers?.(keyword, activePage))
			if (res && res.data) {
				setTotalPages(res?.totalItem)
			}
		} else {
			getUsers(activePage)
		}
	}

	// const router = useRouter()
	return (
		<>
			<div className="c-body">
				<div className="c-manage-user">
					<div className="container">
						<div className="c-manage-user-page">
							<div className="is-top">
								<p>List User:</p>
								<button className="btn btn-success" onClick={() => setIsShowModalAdd(true)}>
									Add
								</button>
							</div>
							<div className="is-search row">
								<input
									type="text"
									placeholder="Search user by name, username, address"
									className="col-md-4"
									value={keyword}
									onChange={(e) => setKeyWord(e.target.value)}
								/>
								<IconButton size="lg" icon={<SearchIcon />} onClick={() => handleSearch()} />
							</div>
							<TableUser handleUpdateTable={handleUpdateTable}/>
							<ModalAddUser
								show={isShowModalAdd}
								handleClose={handleClose}
								handleUpdateTable={handleUpdateTable}
								// listRoles={listRoles}
							/>
							<Pagination total={totalPages} limit={8} activePage={activePage} onChangePage={setActivePage} />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = withServerSideProps(async function getServerSideProps() {
	const hydrationData = {}
	let usersStore: UsersHydration
	// let authStore: AuthHydration

	const resListUser: any = await usersServices.getListUsers(1)

	if (resListUser && resListUser.status === HttpStatusCode.OK) {
		usersStore = {
			users: resListUser?.data?.data as any[],
			// pagination: {
			// 	total: resListProduct?.data?.total ? Number(resListProduct?.data?.total) : 0,
			// },
		}
	}

	// if (query.partnerId) {
	// 	authStore = {
	// 		partnerId: query.partnerId,
	// 	}
	// }

	if (usersStore) {
		Object.assign(hydrationData, { usersStore })
	}

	// if (authStore) {
	// 	Object.assign(hydrationData, { authStore })
	// }

	if (Object.keys(hydrationData).length > 0) {
		return {
			props: {
				hydrationData,
			},
		}
	}
	return {
		props: {},
	}
})

export default withLayout(
	inject(({ store }: { store: RootStoreHydration }) => ({
		// authStore: store.authStore,
		usersStore: store.usersStore,
		loading: store.loading,
		store,
	}))(observer(Index))
)
