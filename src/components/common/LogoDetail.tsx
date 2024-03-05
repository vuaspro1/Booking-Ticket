import React from 'react'
import { observer } from 'mobx-react'
import Link from 'next/link'

const LogoDetail = () => {
	return (
		<div className="logo-detail">
			<Link href="/">
				<a>
					<img className="img-detail" src={'/images/mbeer/logo.png'} alt="Mbeer Logo" />
				</a>
			</Link>
		</div>
	)
}

export default observer(LogoDetail)
