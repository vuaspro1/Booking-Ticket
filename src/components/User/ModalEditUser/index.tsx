import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import withLayout from '@src/lib/withLayout'
import { inject } from 'mobx-react'
import { RootStoreHydration } from '@src/stores/RootStore'
import { observer } from 'mobx-react-lite'
import { flowResult } from 'mobx'
import UsersStore from '@src/stores/users.store'
import UserRoleStore from '@src/stores/userRole.store'
import RoleStore from '@src/stores/role.store'

interface ModalEditUserProps {
	usersStore?: UsersStore
	userRoleStore?: UserRoleStore
    show?: any
    handleClose?: any
    handleUpdateTable?: any
    dataUserEdit?: any
    roleStore?: RoleStore
}

const ModalEditUser: FC<ModalEditUserProps> = (props: ModalEditUserProps) => {
    const { handleClose, show, handleUpdateTable, usersStore, userRoleStore, roleStore, dataUserEdit } = props

	const [name, setName] = useState('')
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [address, setAddress] = useState('')
	const [dateOfBirth, setDateOfBirth] = useState('')
	const [selectedRole, setSelectedRole] = useState('')
	const [selectId, setSelectId] = useState(0)
    const listRoles = roleStore.roles
	const roleName =
    dataUserEdit.roles && dataUserEdit.roles.length > 0
      ? dataUserEdit.roles[0].id
      : "";

	const handleRoleChange = (event) => {
		setSelectedRole(event.target.value)
	}

	const handleSave = async () => {
		const params = { name, phone, password, address, dateOfBirth }
		const res = await flowResult<any>(usersStore?.updateUser?.(selectId, params))
		if (res && res.id) {
			setAddress('')
			setDateOfBirth('')
			setName('')
			setPassword('')
			setPhone('')
			toast.success('Update successed!')
			handlePutUpdateUserRole(res?.id)
		} else {
			toast.error('Update false!')
		}
	}

	const handlePutUpdateUserRole = async (id) => {
		const userId = id
		const roleId = +selectedRole
        const params = {userId, roleId}
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

    useEffect(() => {
		getListRoles()
		if (show) {
			setSelectId(dataUserEdit.id);
			setName(dataUserEdit.name);
			setPhone(dataUserEdit.phone);
			setAddress(dataUserEdit.address);
			setSelectedRole(roleName);
		  }
	}, [dataUserEdit, show, roleName])

	
	return (
		<Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
			<Modal.Header closeButton>
				<Modal.Title>Edit user</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="body-add-new">
					<form className="row g-3">
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
						<div className="col-12">
							<label className="form-label">Password</label>
							<input
								type="password"
								className="form-control"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
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
				<Button variant="secondary" onClick={handleClose} className='is-button-close'>
					Close
				</Button>
				<Button variant="primary" onClick={() => handleSave()} className='is-button-save'>
					Save
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
	}))(observer(ModalEditUser))
)
