import withLayout from '@src/lib/withLayout'
import { RootStoreHydration } from '@src/stores/RootStore'
import AuthStore from '@src/stores/auth.store'
import { flowResult } from 'mobx'
import { inject } from 'mobx-react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { toast } from 'react-toastify'

interface IndexProps {
	authStore: AuthStore
}

const Index: FC<IndexProps> = (props: IndexProps) => {
	const { authStore } = props
	const router = useRouter()

	const [userName, setUserName] = useState('')
	const [password, setPassword] = useState('')

	const handleSubmit = async () => {
		if (!userName || !password) {
			toast.error('Username/Password is required!')
			return
		} else {
			const res = await flowResult<any>(authStore?.login?.(userName, password))
			if (res && res.accessToken) {
				router.push('/');
			} else {
				if (res && res.status === 400) {
					toast.error('Login failed!')
				}
			}
		}
	}

	return (
		<>
			<div className="login-container col-12 col-sm-4">
				<div className="title">Login</div>
				<div className="text">Username:</div>
				<input type="username" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
				<div className="text">Password:</div>
				<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button
					className={userName && password ? 'active' : ''}
					disabled={userName && password ? false : true}
					onClick={() => handleSubmit()}
				>
					Login
				</button>
			</div>
		</>
	)
}

export default withLayout(
	inject(({ store }: { store: RootStoreHydration }) => ({
		authStore: store.authStore,
		// usersStore: store.usersStore,
		loading: store.loading,
		store,
	}))(observer(Index))
)
