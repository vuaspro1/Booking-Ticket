/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react'
import { inject } from 'mobx-react'
import { observer } from 'mobx-react-lite'
import withLayout from '@src/lib/withLayout'
import { RootStoreHydration } from '@src/stores/RootStore'
import GlobalStore from '@src/stores/global.store'
import numeral from 'numeral'
import { Button, Carousel, Input, InputGroup, SelectPicker } from 'rsuite'
import RegisterBox from './RegisterBox'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper'

interface HomeBoxProps {
	globalStore?: GlobalStore
}

const HomeBox: FC<HomeBoxProps> = (props: HomeBoxProps) => {
	const { globalStore } = props

	return (
		<>
			<div className="c-bg-top">
				<div className="container">
					<Carousel autoplay className="custom-slider">
						<img src="https://metiz.vn/media/slide_home/gap-lai-chi-bau11.jpg" height="250" />
						<img src="https://metiz.vn/media/slide_home/Mai.jpg" height="250" />
						<img src="https://metiz.vn/media/slide_home/sieu_diep_vien.png" height="250" />
						<img src="https://metiz.vn/media/slide_home/dau_truong_muon_thu.png" height="250" />
						<img src="https://metiz.vn/media/slide_home/gia_dinh_diep_vien.jpg" height="250" />
					</Carousel>
					<div className="is-title">PHIM ĐANG CHIẾU</div>
					<Swiper
						slidesPerView={4}
						spaceBetween={30}
						loop={true}
						autoplay={{
							delay: 2000,
						}}
						modules={[Autoplay]}
						className="mySwiper"
					>
						<SwiperSlide>
							<img src="https://metiz.vn/media/slide_home/gap-lai-chi-bau11.jpg" height="250" />
						</SwiperSlide>
						<SwiperSlide>
							<img src="https://metiz.vn/media/slide_home/gap-lai-chi-bau11.jpg" height="250" />
						</SwiperSlide>
						<SwiperSlide>
							<img src="https://metiz.vn/media/slide_home/gap-lai-chi-bau11.jpg" height="250" />
						</SwiperSlide>
						<SwiperSlide>
							<img src="https://metiz.vn/media/slide_home/gap-lai-chi-bau11.jpg" height="250" />
						</SwiperSlide>
					</Swiper>
				</div>
			</div>
		</>
	)
}

export default withLayout(
	inject(({ store }: { store: RootStoreHydration }) => ({
		globalStore: store.globalStore,
		store,
	}))(observer(HomeBox))
)
