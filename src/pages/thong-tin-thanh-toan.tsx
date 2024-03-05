import React from 'react'
import { GetServerSideProps } from 'next'
import { Container, Content } from 'rsuite'
import { withServerSideProps } from '@src/helpers/wrapperProps'
import Helmet from '@src/helpers/Helmet'
import Layout from '@src/layouts'
import withLayout from '@src/lib/withLayout'
import { PAYMENT_FAIL_MESSAGE, PAYMENT_STATUS_SUCCESS, PAYMENT_SUCCESS_MESSAGE } from '@src/contains/contants'
import OrderSuccessPage from '@src/components/OrderSuccess'

interface IndexProps {
	status: string
}

const Index: React.FC<IndexProps> = (props: IndexProps) => {
	const { status } = props

	return (
		<Layout>
			<>
				<Helmet
					title={status === PAYMENT_STATUS_SUCCESS ? PAYMENT_SUCCESS_MESSAGE?.title : PAYMENT_FAIL_MESSAGE?.title}
					url={'https://dangky.mbeer.vn'}
					image={'https://dangky.mbeer.vn/images/mbeer/banner.jpg'}
					keywords="mbeer, khai trương, nhà hàng"
					descriptions="Đây là cơ hội tuyệt vời để khách hàng thử nghiệm sản phẩm mới."
				/>
				<Container>
					<Content>
						<OrderSuccessPage />
					</Content>
				</Container>
			</>
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps = withServerSideProps(async function getStaticProps({ query }) {
	if (query.payment_status) {
		return {
			props: {
				status: query.payment_status,
			},
		}
	}
	return {
		props: {},
	}
})

export default withLayout(Index)
