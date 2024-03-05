/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react'
import { inject } from 'mobx-react'
import { observer } from 'mobx-react-lite'
import withLayout from '@src/lib/withLayout'
import { RootStoreHydration } from '@src/stores/RootStore'
import GlobalStore from '@src/stores/global.store'
import numeral from 'numeral'
import { Button, Divider, Input, InputGroup, SelectPicker } from 'rsuite'
import RegisterBox from './RegisterBox'
numeral.zeroFormat(0)
numeral.nullFormat(0)

interface HomeBoxProps {
	globalStore?: GlobalStore
}

const HomeBox: FC<HomeBoxProps> = (props: HomeBoxProps) => {
	const { globalStore } = props

	return (
		<>
			<div className="c-gomsu-outer">
				<div className="c-bg-top">
					<img src="/gomsu/images/gomsu/banner.jpg" />
				</div>
				<div className="c-video-top">
					<div className="container">
						<h2>VIDEO GIỚI THIỆU</h2>
						<div className="is-video">
							<div className="is-outer">
								<iframe src="https://www.youtube.com/embed/2Mss3OFalF8?si=0isVhr7CskeiZLzS"></iframe>
							</div>
						</div>
					</div>
				</div>
				<div className="c-letter">
					<div className="container">
						<h2>GIỚI THIỆU CHUNG</h2>
						<div className="is-letter">
							<div className="is-4">
								<span></span>
								<span></span>
								<span></span>
								<span></span>
							</div>
							<p>
								{`Hiệp hội gốm sứ gia dụng Việt Nam (Hiệp hội) là tổ chức xã hội nghề nghiệp được thành lập theo quyết định số 931/QĐ-BNV của Bộ Nội vụ. Hiệp hội là nơi tập hợp nhiều nhà máy sản xuất gốm sứ công nghiệp, tiêu chuẩn công nghệ cao của Việt Nam.`}
							</p>
							<p>
								Trước những hệ lụy về sức khỏe khi nhiều người sử dụng các loại gốm sứ còn tồn dư chất chì và kim loại nặng,
								với mong muốn giúp Quý cư dân tại tòa nhà được tiếp cận thông tin và chọn sử dụng bộ đồ ăn an toàn cũng như
								nhận các ưu đãi trực tiếp từ các nhà máy.
							</p>
						</div>
					</div>
				</div>
				<div className="c-letter">
					<div className="container">
						<h2>LỢI ÍCH VỚI CƯ DÂN</h2>
						<div className="is-letter">
							<div className="is-4">
								<span></span>
								<span></span>
								<span></span>
								<span></span>
							</div>
							<p>
								Hiệp hội tổ chức hoạt động hướng dẫn giúp cư dân phân biệt chất lượng gốm sứ; dấu hiệu sứ hỏng gây ảnh hưởng
								trực tiếp đến sức khỏe. Bổ sung kỹ năng nhận diện các loại gốm sứ tiêu chuẩn, chất lượng, an toàn với người
								sử dụng để có sự lựa chọn cho gia đình.
							</p>
						</div>
					</div>
				</div>
				<div className="c-letter">
					<div className="container">
						<h2>LỢI ÍCH ĐỐI VỚI NHÀ MÁY</h2>
						<div className="is-letter">
							<div className="is-4">
								<span></span>
								<span></span>
								<span></span>
								<span></span>
							</div>
							<p>
								Hiệp hội phối hợp triển khai hoạt động truyền thông giới thiệu giúp cung cấp hàng hóa tại các chung cư để cư
								dân trong tòa nhà trực tiếp chọn, mua sắm sản phẩm ưu đãi “đặc quyền mua giá tại nhà máy”.
							</p>
							<p>
								Nhà máy được lắng nghe trực tiếp các góp ý về mẫu mã, chất lượng sản phẩm và cách đóng gói combo sản phẩm để
								phù hợp với nhu cầu sử dụng hoặc làm quà tặng của cư dân.
							</p>
						</div>
					</div>
				</div>
				<div className="c-product-intro">
					<div className="container">
						<ul className="clearfix">
							<li>
								<img src="/gomsu/images/gomsu/trung-kien.png" />
								<span className="is-title">
									<b>SỨ TRUNG KIÊN</b>
								</span>
								<div className="is-flex">
									<div className="is-left">
										<span>
											<b>Mẫu trắng:</b>
										</span>
									</div>
									<div className="is-right">
										<div className="is-list">
											<span>Bao gồm:</span>
											<ul>
												<li>- 6 bát con</li>
												<li>- 1 bát tô</li>
												<li>- 3 đĩa</li>
												<li>- 1 bát chấm</li>
												<li>- 1 đĩa gia vị</li>
											</ul>
										</div>
										{/* <span className="is-origin">
											<span style={{ textDecoration: 'line-through' }}>
												<b>Giá bán: </b>300.000 đồng
											</span>
										</span> */}
										<span>
											<b>Giá ưu đãi: </b>146.000 đồng
										</span>
										{/* <span className="is-b">{'(Tiết kiệm 154.000 đồng)'}</span> */}
									</div>
								</div>
								<Divider className="c-divider" />
								<div className="is-flex">
									<div className="is-left">
										<span>
											<b>Mẫu hoa:</b>
										</span>
									</div>
									<div className="is-right">
										<div className="is-list">
											<span>Bao gồm:</span>
											<ul>
												<li>- 6 bát con</li>
												<li>- 1 bát tô</li>
												<li>- 3 đĩa</li>
												<li>- 1 bát chấm</li>
												<li>- 1 đĩa gia vị</li>
											</ul>
										</div>
										<span>
											<b>Giá ưu đãi: </b>180.000 đồng
										</span>
									</div>
								</div>
							</li>
							<li>
								<img src="/gomsu/images/gomsu/minh-chau.png" />
								<span className="is-title">
									<b>SỨ MINH CHÂU</b>
								</span>
								<div className="is-flex">
									<div className="is-left">
										<span>
											<b>Mẫu trắng:</b>
										</span>
									</div>
									<div className="is-right">
										<div className="is-list">
											<span>Bao gồm:</span>
											<ul>
												<li>- 6 bát con</li>
												<li>- 1 bát tô</li>
												<li>- 3 đĩa</li>
												<li>- 1 bát chấm</li>
												<li>- 1 đĩa gia vị</li>
											</ul>
										</div>
										{/* <span className="is-origin">
											<span style={{ textDecoration: 'line-through' }}>
												<b>Giá bán: </b>460.000 đồng
											</span>
										</span> */}
										<span>
											<b>Giá ưu đãi: </b>230.000 đồng
										</span>
										{/* <span className="is-b">{'(Tiết kiệm 230.000 đồng)'}</span> */}
									</div>
								</div>
								<Divider className="c-divider" />
								<div className="is-flex">
									<div className="is-left">
										<span>
											<b>Mẫu hoa:</b>
										</span>
									</div>
									<div className="is-right">
										<div className="is-list">
											<span>Bao gồm:</span>
											<ul>
												<li>- 6 bát con</li>
												<li>- 1 bát tô</li>
												<li>- 3 đĩa</li>
												<li>- 1 bát chấm</li>
												<li>- 1 đĩa gia vị</li>
											</ul>
										</div>
										<span>
											<b>Giá ưu đãi: </b>250.000 đồng
										</span>
									</div>
								</div>
								<Divider className="c-divider" />
								<div className="is-flex">
									<div className="is-left">
										<span>
											<b>Mẫu kẻ vàng:</b>
										</span>
									</div>
									<div className="is-right">
										<div className="is-list">
											<span>Bao gồm:</span>
											<ul>
												<li>- 6 bát con</li>
												<li>- 1 bát tô</li>
												<li>- 3 đĩa</li>
												<li>- 1 bát chấm</li>
												<li>- 1 đĩa gia vị</li>
											</ul>
										</div>
										<span>
											<b>Giá ưu đãi: </b>330.000 đồng
										</span>
									</div>
								</div>
							</li>
							<li>
								<img src="/gomsu/images/gomsu/bone.png" />
								<span className="is-title">
									<b>SỨ NGỌC (BONE)</b>
								</span>
								<div className="is-flex">
									<div className="is-left">
										<span>
											<b>Mẫu trắng:</b>
										</span>
									</div>
									<div className="is-right">
										<div className="is-list">
											<span>Bao gồm:</span>
											<ul>
												<li>- 6 bát con</li>
												<li>- 2 bát tô</li>
												<li>- 2 đĩa</li>
												<li>- 1 bát chấm</li>
												<li>- 1 đĩa gia vị</li>
											</ul>
										</div>
										{/* <span className="is-origin">
											<span style={{ textDecoration: 'line-through' }}>
												<b>Giá bán: </b>950.000 đồng
											</span>
										</span> */}
										<span>
											<b>Giá ưu đãi: </b>460.000 đồng
										</span>
										{/* <span className="is-b">{'(Tiết kiệm 490.000 đồng)'}</span> */}
									</div>
								</div>
								<Divider className="c-divider" />
								<div className="is-flex">
									<div className="is-left">
										<span>
											<b>Mẫu kẻ vàng:</b>
										</span>
									</div>
									<div className="is-right">
										<div className="is-list">
											<span>Bao gồm:</span>
											<ul>
												<li>- 6 bát con</li>
												<li>- 2 bát tô</li>
												<li>- 2 đĩa</li>
												<li>- 1 bát chấm</li>
												<li>- 1 đĩa gia vị</li>
											</ul>
										</div>
										<span>
											<b>Giá ưu đãi: </b>550.000 đồng
										</span>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<RegisterBox />
				<div className="c-news">
					<div className="container">
						<h2>TRUYỀN THÔNG VỀ CHƯƠNG TRÌNH</h2>
						<br />
						<br />
						<div className="is-news">
							<ul className="clearfix">
								<li>
									<a
										target="_blank"
										rel="noreferrer"
										href="https://quochoitv.vn/thanh-lap-hiep-hoi-gom-su-gia-dung-viet-nam-tao-luong-gio-moi-cho-gom-su-viet"
									>
										<div className="is-item">
											<div className="is-img">
												<div className="is-outer">
													<img src="https://cloudvodqh.tek4tv.vn/thang-2-2023/0402/365/4-47.jpg" />
												</div>
											</div>
											<div className="is-content">
												<b>Thành lập Hiệp hội Gốm sứ gia dụng Việt Nam, tạo luồng gió mới cho gốm sứ Việt</b>
												<span>
													{`Ngày 22/3, Hiệp hội Gốm sứ gia dụng Việt Nam tổ chức đại hội lần thứ nhất và bầu ra ban chấp hành
													nhiệm kỳ 2023 – 2028.`}
												</span>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a
										target="_blank"
										rel="noreferrer"
										href="http://baovanhoa.vn/nghe-thuat/van-hoc/artmid/486/articleid/62440/hiep-hoi-gom-su-gia-dung-viet-nam-lan-toa-ban-sac-van-hoa-viet"
									>
										<div className="is-item">
											<div className="is-img">
												<div className="is-outer">
													<img src="/gomsu/images/gomsu/tin-2.jpg" />
												</div>
											</div>
											<div className="is-content">
												<b>Hiệp hội Gốm sứ gia dụng Việt Nam lan toả bản sắc văn hoá Việt</b>
												<span>
													{`VHO- Ngày 22.3, Đại hội lần thứ I Hiệp hội Gốm sứ gia dụng Việt Nam (VCCA) nhiệm kỳ 2023 - 2028 đã  được tổ chức trang trọng tại Hà Nội. Thứ trưởng Bộ Nội vụ Vũ Chiến Thắng đã trao quyết định thành lập và phát biểu chỉ đạo giao nhiệm vụ cho Hiệp hội.`}
												</span>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a
										target="_blank"
										rel="noreferrer"
										href="https://www.qdnd.vn/xa-hoi/tin-tuc/gop-phan-lan-toa-gia-tri-va-thuc-day-phat-trien-gom-viet-722565"
									>
										<div className="is-item">
											<div className="is-img">
												<div className="is-outer">
													<img src="https://file3.qdnd.vn/data/images/0/2023/03/22/vuongha/g1.jpg?dpi=150&quality=100&w=870" />
												</div>
											</div>
											<div className="is-content">
												<b>Góp phần lan tỏa giá trị và thúc đẩy phát triển gốm Việt</b>
												<span>
													{`Đại hội lần thứ I Hiệp hội Gốm sứ gia dụng Việt Nam (VCCA) nhiệm kỳ 2023 - 2028, đã diễn ra tại Hà Nội ngày 22-3. Thứ trưởng Bộ Nội vụ Vũ Chiến Thắng đã trao quyết định thành lập và giao nhiệm vụ cho hiệp hội, nhằm góp phần thúc đẩy phát triển gốm Việt.`}
												</span>
											</div>
										</div>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="c-footer">
					<div className="container">
						<div className="row">
							<div className="col-md-12" style={{ display: 'flex', justifyContent: 'center' }}>
								<div className="b-maincontent" style={{ textAlign: 'center' }}>
									<h3>HIỆP HỘI GỐM SỨ GIA DỤNG VIỆT NAM</h3>
									<p>Số 110 Khuất Duy Tiến, Thanh Xuân, Hà Nội</p>
									<p>
										Điện thoại: <a href="tel:0905253583">0905253583</a>
									</p>
									<p>
										Email: <a href="mailto:hiephoigomsugiadung@gmail.com">hiephoigomsugiadung@gmail.com</a>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="c-gomsu-outer__height"></div>
				<div className="c-gomsu-outer__fixed">
					<img src="/gomsu/images/gomsu/zalo11.png" />
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
