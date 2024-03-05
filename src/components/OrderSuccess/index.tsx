import React, { FC } from 'react'
import numeral from 'numeral'
import { useRouter } from 'next/router'
import LogoDetail from '@src/components/common/LogoDetail'
import { PAYMENT_FAIL_MESSAGE, PAYMENT_STATUS_SUCCESS, PAYMENT_SUCCESS_MESSAGE } from '@src/contains/contants'

interface OrderSuccessProps {}

const OrderSuccess: FC<OrderSuccessProps> = (props: OrderSuccessProps) => {
	const {} = props

	const router = useRouter()
	const payment_status = router?.query?.payment_status
	const amount = router?.query?.amount
	const order = router?.query?.order

	const getPaymentMessageBox = (paymentMessage: any) => {
		return (
			<>
				<p>{paymentMessage.title}</p>
				<p>{paymentMessage.message}</p>
			</>
		)
	}

	return (
		<React.Fragment>
			<div className="c-background-mb">
				<div className="container-detail">
					<div className="wrapper-detail c-order-pay-info">
						<div className="body-detail">
							<LogoDetail />
							<div className="c-order-pay-info__box">
								{getPaymentMessageBox(
									payment_status === PAYMENT_STATUS_SUCCESS ? PAYMENT_SUCCESS_MESSAGE : PAYMENT_FAIL_MESSAGE
								)}
								{amount ? <p>Số tiền: {numeral(amount).format('#,#')} VNĐ</p> : null}
								{order ? <p>Mã hóa đơn: {order} </p> : null}
								<div className="notice">
									<p></p>
									<p>Mã tham dự của bạn sẽ được gửi vào email hoặc zalo</p>
								</div>
							</div>
							<div className="c-order-pay-info__button">
								<div className="is-btn">
									<button className="btn" onClick={() => router.push('/')}>
										Trở về trang chủ
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default OrderSuccess
