import React, { FC, useEffect } from 'react'
import Helmet from '@src/helpers/Helmet'
import { withServerSideProps } from '@src/helpers/wrapperProps'
import Layout from '@src/layouts'
import { GetServerSideProps } from 'next'
import withLayout from '@src/lib/withLayout'
import { Container, Content } from 'rsuite'
import { inject } from 'mobx-react'
import { observer } from 'mobx-react-lite'
import { RootStoreHydration } from '@src/stores/RootStore'
import { AuthHydration } from '@src/stores/auth.store'
// import { useRouter } from 'next/router'
import * as globalServices from '@src/services/global.service'
import HttpStatusCode from '@src/contains/HttpStatusCode'
import { GlobalHydration } from '@src/stores/global.store'
import Gomsu from '@src/components/Gomsu'

interface IndexProps {
	token: string
	authStore: AuthHydration
}

const Index: FC<IndexProps> = () =>
	// props: IndexProps
	{
		// const { authStore } = props
		// const router = useRouter()

		useEffect(() => {
			if (typeof window !== 'undefined') {
				//
				window.myListAddress
			}
		}, [])

		// useEffect(() => {
		// 	if (authStore?.token) {
		// 		setTimeout(() => {
		// 			router.replace('/sales/create-sales')
		// 		}, 1000)
		// 	}
		// }, [])

		return (
			<Layout>
				<>
					<Helmet
						title="Gốm sứ gia dụng"
						url={'https://phucloi.gomsugiadung.vn/'}
						image={'https://phucloi.gomsugiadung.vn/gomsu/images/gomsu/banner.jpg'}
						keywords="gốm sứ, gia dụng, cư dân, đô thị"
						descriptions="Đặc quyền mua giá tại nhà máy"
					/>
					<Container>
						<Content>
							<Gomsu />
						</Content>
					</Container>
				</>
			</Layout>
		)
	}

export const getServerSideProps: GetServerSideProps = withServerSideProps(async function getStaticProps() {
	const hydrationData = {}
	let globalStore: GlobalHydration

	const resList = await globalServices.getListCompany<any>({
		application: 'gom_su',
	})
	if (resList && resList.status === HttpStatusCode.OK) {
		const list = resList?.data?.data
		list?.push({ id: 0, name: 'Khác' })
		globalStore = {
			company: list,
		}
	}
	if (globalStore) {
		Object.assign(hydrationData, { globalStore })
	}
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
		authStore: store.authStore,
		loading: store.loading,
		store,
	}))(observer(Index))
)
