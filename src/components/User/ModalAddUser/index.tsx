import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { observer } from 'mobx-react-lite'
import { RootStoreHydration } from '@src/stores/RootStore'
import { inject } from 'mobx-react'
import withLayout from '@src/lib/withLayout'
import UsersStore from '@src/stores/users.store'
import { FC, useState } from 'react'
import { flowResult } from 'mobx'
import RoleStore from '@src/stores/role.store'
import React from 'react'
import { toast } from 'react-toastify'
import UserRoleStore from '@src/stores/userRole.store'

interface ModalAddUserProps {
	usersStore?: UsersStore
	loading?: boolean
	roleStore?: RoleStore
	handleClose?: any
	show?: any
	userRoleStore?: UserRoleStore
	handleUpdateTable?: any
}

const ModalAddUser: FC<ModalAddUserProps> = (props: ModalAddUserProps) => {
	const { usersStore, roleStore, handleClose, show, userRoleStore, handleUpdateTable } = props
	const [selectedRole, setSelectedRole] = useState('')

	const [name, setName] = useState('')
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [address, setAddress] = useState('')
	const [dateOfBirth, setDateOfBirth] = useState('')
	const [userName, setUserName] = useState('')

	const listRoles = roleStore.roles
	// console.log(toJS(listRoles), 'dasf')

	const handleAdd = async () => {
		const params = { name, phone, password, address, dateOfBirth, userName }
		const res = await flowResult<any>(usersStore?.createUser?.(params))
		if (res && res.id) {
			setAddress('')
			setDateOfBirth('')
			setName('')
			setPassword('')
			setPhone('')
			setUserName('')
			toast.success('Create successed!')
			handlePostCreateUserRole(res.id)
		} else {
			toast.error('Create false!')
		}
	}

	const handlePostCreateUserRole = async (id) => {
		const userId = +id
		const roleId = +selectedRole
		const params = { userId, roleId }
		const res = await flowResult<any>(userRoleStore?.createUserRole?.(params))
		if (res) {
			handleClose();
			handleUpdateTable();
		}
	}

	const getListRoles = async () => {
		// const params = { name, phone, password, address, dateOfBirth, userName }
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const res = await flowResult<any>(roleStore.getListRoles())
		// console.log(res)
	}

	const handleRoleChange = (event) => {
		setSelectedRole(event.target.value)
	}

	React.useEffect(() => {
		getListRoles()
	}, [])

	return (
		<Modal backdrop="static" keyboard={false} show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Add new user</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="body-add-new">
					<form className="row g-3">
						<div className="col-md-6">
							<label className="form-label">Username</label>
							<input type="text" className="form-control" value={userName} onChange={(e) => setUserName(e.target.value)} />
						</div>
						<div className="col-md-6">
							<label className="form-label">Password</label>
							<input
								type="password"
								className="form-control"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className="col-12">
							<label className="form-label">Full Name</label>
							<input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
						</div>
						<div className="col-12">
							<label className="form-label">Phone</label>
							<input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
						</div>
						<div className="col-12">
							<label className="form-label">Address</label>
							<input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
						</div>
						<div className="col-md-6">
							<label className="form-label">Date of birth</label>
							<input
								type="date"
								className="form-control"
								value={dateOfBirth}
								onChange={(e) => setDateOfBirth(e.target.value)}
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label">Role</label>
							<select className="form-select" value={selectedRole} onChange={handleRoleChange}>
								<option value="" disabled></option>
								{listRoles.map((state) => (
									<option key={state.id} value={state.id}>
										{state.name}
									</option>
								))}
							</select>
						</div>
					</form>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button  onClick={handleClose} className='is-button-close'>
					Close
				</Button>
				<Button  onClick={() => handleAdd()} className='is-button-save'>
					Add
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default withLayout(
	inject(({ store }: { store: RootStoreHydration }) => ({
		// authStore: store.authStore,
		userRoleStore: store.userRoleStore,
		usersStore: store.usersStore,
		roleStore: store.roleStore,
		loading: store.loading,
		store,
	}))(observer(ModalAddUser))
)
