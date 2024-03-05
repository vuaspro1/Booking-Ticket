import React, { FC } from 'react'
import { ToastContainer } from '@src/helpers/Toast'
import { CustomProvider } from 'rsuite'
import { inject } from 'mobx-react'
import { observer } from 'mobx-react-lite'
import { AuthHydration } from '@src/stores/auth.store'
import { locale } from '@src/helpers/rsuite/locales/vi_VN'

interface LayoutProps {
	children: React.ReactChild
	authStore?: AuthHydration
}

const Layout: FC<LayoutProps> = (props: LayoutProps) => {
	// const { authStore } = props
	// const router = useRouter()

	// useEffect(() => {
	// 	if (!authStore?.token) {
	// 		setTimeout(() => {
	// 			router.replace('/login')
	// 		}, 1000)
	// 	}
	// }, [])

	// if (!authStore?.token) {
	// 	return (
	// 		<div className="c-page-loading">
	// 			<PageLoading />
	// 		</div>
	// 	)
	// }

	return (
		<React.Fragment>
			<CustomProvider locale={locale}>
				{props.children}
				<ToastContainer />
			</CustomProvider>
		</React.Fragment>
	)
}

export default inject(({ store }) => ({
	authStore: store?.authStore,
}))(observer(Layout))
