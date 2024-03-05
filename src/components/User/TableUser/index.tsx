'use client'
import Table from 'react-bootstrap/Table'
import UsersStore from '@src/stores/users.store'
import { FC, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { RootStoreHydration } from '@src/stores/RootStore'
import withLayout from '@src/lib/withLayout'
import { inject } from 'mobx-react'
import ModalEditUser from '../ModalEditUser'
import ModalConfirm from '../ModalConfirm'

interface TableUserProps {
	usersStore?: UsersStore
	handleUpdateTable?: any
}

const TableUser: FC<TableUserProps> = (props: TableUserProps) => {
	const { usersStore, handleUpdateTable } = props
	const [isShowModalEdit, setIsShowModalEdit] = useState(false)
	const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
	const [dataUserEdit, setDataUserEdit] = useState({})
	const [selectId, setSelectId] = useState(0)

	const users = usersStore?.users

	const handleEditUser = (item) => {
		setIsShowModalEdit(true)
		setDataUserEdit(item)
	}

	const handleClose = () => {
		setIsShowModalEdit(false)
		setIsShowModalConfirm(false)
	}

	const handleDeleteUser = (item) => {
		setSelectId(item?.id)
		setIsShowModalConfirm(item)
	}

	return (
		<>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Id</th>
						<th>Username</th>
						<th>Name</th>
						<th>Phone</th>
						<th>Address</th>
						<th>Date of birth</th>
						<th>Role</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{users &&
						users.length > 0 &&
						users.map((item: any, index) => {
							const formattedDateOfBirth = new Date(item.dateOfBirth).toLocaleDateString()
							const roleNames = item?.roles && item.roles.length > 0 ? item.roles.map((role) => role.name).join(', ') : ''
							return (
								<tr key={`users-${index}`}>
									<td>{item.id}</td>
									<td>{item.userName}</td>
									<td>{item.name}</td>
									<td>{item.phone}</td>
									<td>{item.address}</td>
									<td>{formattedDateOfBirth}</td>
									<td>{roleNames}</td>
									<td>
										<button className="btn btn-warning mx-3" onClick={() => handleEditUser(item)}>
											Edit
										</button>
										<button className="btn btn-danger" onClick={() => handleDeleteUser(item)}>
											Delete
										</button>
									</td>
								</tr>
							)
						})}
				</tbody>
			</Table>
			<ModalEditUser
				show={isShowModalEdit}
				handleClose={handleClose}
				handleUpdateTable={handleUpdateTable}
				dataUserEdit={dataUserEdit}
			/>
			<ModalConfirm
				show={isShowModalConfirm}
				handleClose={handleClose}
				selectId={selectId}
				handleUpdateTable={handleUpdateTable}
			/>
		</>
	)
}

export default withLayout(
	inject(({ store }: { store: RootStoreHydration }) => ({
		usersStore: store.usersStore,
		loading: store.loading,
	}))(observer(TableUser))
)
