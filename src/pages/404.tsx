import React, { FC } from 'react'

interface IPage404 {}

const Page404: FC<IPage404> = (props: IPage404) => {
	const {} = props
	return (
		<React.Fragment>
			<h1>Trang không tồn tại!</h1>
		</React.Fragment>
	)
}

export default Page404
