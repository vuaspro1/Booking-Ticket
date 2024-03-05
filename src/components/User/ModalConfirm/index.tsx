import withLayout from "@src/lib/withLayout";
import { RootStoreHydration } from "@src/stores/RootStore";
import { flowResult } from "mobx";
import { inject } from "mobx-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import UsersStore from '@src/stores/users.store'
import { toast } from 'react-toastify'

interface ModalConfirmUserProps {
    handleClose?: any
    show?: any
    selectId?: any
    handleUpdateTable?: any
    usersStore?: UsersStore
}

const ModalConfirmUser: FC<ModalConfirmUserProps> = (props: ModalConfirmUserProps) =>{
    const { handleClose, show, selectId, handleUpdateTable, usersStore } = props;

    const handleSave = async () => {
		const res = await flowResult<any>(usersStore?.deleteUser?.(selectId))
		if (res) {
            handleClose();
            toast.success("Delete successed!");
            handleUpdateTable();
          } else {
            toast.error("Delete false!");
          }
	}

    return (
        <Modal backdrop="static" keyboard={false} show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete user</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure to delete this user?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} className="is-button-close">
              Close
            </Button>
            <Button variant="primary" onClick={() => handleSave()} className="is-button-delete">
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      );
}

export default withLayout(
	inject(({ store }: { store: RootStoreHydration }) => ({
		// authStore: store.authStore,
		userRoleStore: store.userRoleStore,
		usersStore: store.usersStore,
		roleStore: store.roleStore,
		loading: store.loading,
		store,
	}))(observer(ModalConfirmUser))
)