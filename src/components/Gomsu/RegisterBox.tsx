/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useState } from 'react'
import { inject } from 'mobx-react'
import { observer } from 'mobx-react-lite'
import withLayout from '@src/lib/withLayout'
import { RootStoreHydration } from '@src/stores/RootStore'
import GlobalStore from '@src/stores/global.store'
import numeral from 'numeral'
import { Button, Input, InputNumber, Modal, SelectPicker } from 'rsuite'
import province from '@src/helpers/dataMap/province.json'
import district from '@src/helpers/dataMap/district.json'
import ward from '@src/helpers/dataMap/ward.json'
import { validateRegisterParams } from '@src/schemaValidate/validator'
import { SCHEMA_PAY_PARAMS } from '@src/schemaValidate/schema'
import helper from '@src/helpers/helper'
import { toastUtil } from '@src/helpers/Toast'
import CheckIcon from '@rsuite/icons/Check'
import { flowResult } from 'mobx'
import { isEmpty } from 'lodash'
import { CreateOrderParams } from '@src/interfaces/Global'

const provincelist = province.RECORDS
const districtlistAll = district.RECORDS
const wardlistAll = ward.RECORDS

numeral.zeroFormat(0)
numeral.nullFormat(0)

interface HomeBoxProps {
	globalStore?: GlobalStore
}

const HomeBox: FC<HomeBoxProps> = (props: HomeBoxProps) => {
	const { globalStore } = props

	const company = globalStore?.company
	const calculatePriceInfo = globalStore?.calculatePriceInfo

	const typePe = [
		{ label: 'Đoàn viên', value: 'Đoàn viên' },
		{ label: 'Cán bộ', value: 'Cán bộ' },
		{ label: 'Nhà giáo', value: 'Nhà giáo' },
		{ label: 'Người lao động', value: 'Người lao động' },
	]

	const typeList = [
		{ label: 'Trắng', value: 'white' },
		{ label: 'Hoa/viền vàng', value: 'flower' },
	]

	const [name, setName] = useState<string>(''),
		[congDoan, setCongDoan] = useState<string>(''),
		[typePeople, setTypePeople] = useState<string>(''),
		// [type, setType] = useState<string>(''),
		[phone, setPhone] = useState<string>(''),
		[email, setEmail] = useState<string>(''),
		[address, setAddress] = useState<string>(''),
		[companyCode, setCompanyCode] = useState<string>(''),
		[note, setNote] = useState<string>(''),
		[province, setProvince] = useState<string>(''),
		[district, setDistrict] = useState<string>(''),
		[ward, setWard] = useState<string>(''),
		[districtListUpdate, setDistrictListUpdate] = useState([]),
		[wardListUpdate, setWardListUpdate] = useState([]),
		[quantity1, setQuantity1] = useState<number>(0),
		[quantity2, setQuantity2] = useState<number>(0),
		[quantity3, setQuantity3] = useState<number>(0),
		[quantity4, setQuantity4] = useState<number>(0),
		[quantity5, setQuantity5] = useState<number>(0),
		[quantity6, setQuantity6] = useState<number>(0),
		[quantity7, setQuantity7] = useState<number>(0),
		[errorsParams, setErrorsParams] = useState<any>(null),
		[openModal, setOpenModal] = useState<boolean>(false),
		[loading, setLoading] = useState<boolean>(false)

	const handleOpen = () => setOpenModal(true)
	const handleClose = () => setOpenModal(false)

	const clearAll = () => {
		setName('')
		setCongDoan('')
		setTypePeople('')
		// setType('')
		setPhone('')
		setEmail('')
		setAddress('')
		setCompanyCode('')
		setProvince('')
		setDistrict('')
		setWard('')
		setQuantity1(0)
		setQuantity2(0)
		setQuantity3(0)
		setQuantity4(0)
		setQuantity5(0)
		setQuantity6(0)
		setQuantity7(0)
	}

	const getRegister = async () => {
		setErrorsParams(null)
		const paramPay: any = {
			name: name,
			phone: phone,
			email: email,
			congDoan: congDoan.toString(),
			address: address,
			province: province,
			district: district,
			ward: ward,
			typePeople: typePeople,
			note: note,
			// companyCode: companyCode,
			// type: type,
		}
		const checkPayParams = validateRegisterParams.compile(SCHEMA_PAY_PARAMS)
		console.log('🚀 ~ file: RegisterBox.tsx:106 ~ getRegister ~ checkPayParams:', checkPayParams)
		const rsCheck = checkPayParams(paramPay)
		if (typeof rsCheck !== 'boolean') {
			setErrorsParams(rsCheck)
			return
		}
		if (!quantity1 && !quantity2 && !quantity3 && !quantity4 && !quantity5 && !quantity6) {
			toastUtil.error('Vui lòng điền số lượng sản phẩm cần đặt!')
			return
		}
		setLoading(true)
		const listOrderItems = []
		if (numeral(quantity1).value()) {
			listOrderItems.push({ productId: 8, quantity: numeral(quantity1).value() })
		}
		if (numeral(quantity2).value()) {
			listOrderItems.push({ productId: 10, quantity: numeral(quantity2).value() })
		}
		if (numeral(quantity3).value()) {
			listOrderItems.push({ productId: 13, quantity: numeral(quantity3).value() })
		}
		if (numeral(quantity4).value()) {
			listOrderItems.push({ productId: 9, quantity: numeral(quantity4).value() })
		}
		if (numeral(quantity5).value()) {
			listOrderItems.push({ productId: 11, quantity: numeral(quantity5).value() })
		}
		if (numeral(quantity6).value()) {
			listOrderItems.push({ productId: 14, quantity: numeral(quantity6).value() })
		}
		if (numeral(quantity7).value()) {
			listOrderItems.push({ productId: 12, quantity: numeral(quantity7).value() })
		}
		const params: CreateOrderParams = {
			listOrderItems,
			receiveName: name,
			receivePhone: phone,
			receiveEmail: email,
			address: address,
			provinceId: numeral(province).value(),
			districtId: numeral(district).value(),
			wardId: numeral(ward).value(),
			positionInTheOrganization: typePeople,
			// companyCode: companyCode,
			// companyId: numeral(congDoan).value(),
		}
		if (companyCode) {
			Object.assign(params, { companyCode: companyCode })
		}
		if (congDoan == '0') {
			Object.assign(params, { note: note })
		} else {
			Object.assign(params, { companyId: numeral(congDoan).value() })
		}
		const resGetCalculate = await flowResult<any>(globalStore?.createOrder?.(params))
		if (resGetCalculate?.code == 0) {
			setOpenModal(true)
			clearAll()
			setLoading(false)
		} else {
			toastUtil.error(resGetCalculate?.message || 'Có lỗi')
			setLoading(false)
		}
	}

	useEffect(() => {
		const listDistrict = districtlistAll
			.filter((item) => item.province === province)
			.sort((a, b) =>
				a.name.localeCompare(b.name, undefined, {
					numeric: true,
					sensitivity: 'base',
				})
			)
		setDistrictListUpdate(listDistrict)
		setDistrict('')
		setWard('')
		setWardListUpdate([])
	}, [province])

	useEffect(() => {
		const listWard = wardlistAll
			.filter((item) => item.district === district)
			.sort((a, b) =>
				a.name.localeCompare(b.name, undefined, {
					numeric: true,
					sensitivity: 'base',
				})
			)
		setWardListUpdate(listWard)
		setWard('')
	}, [district])

	const calculatePrice = async () => {
		const listOrderItems = []
		if (numeral(quantity1).value()) {
			listOrderItems.push({ productId: 8, quantity: numeral(quantity1).value() })
		}
		if (numeral(quantity2).value()) {
			listOrderItems.push({ productId: 10, quantity: numeral(quantity2).value() })
		}
		if (numeral(quantity3).value()) {
			listOrderItems.push({ productId: 13, quantity: numeral(quantity3).value() })
		}
		if (numeral(quantity4).value()) {
			listOrderItems.push({ productId: 9, quantity: numeral(quantity4).value() })
		}
		if (numeral(quantity5).value()) {
			listOrderItems.push({ productId: 11, quantity: numeral(quantity5).value() })
		}
		if (numeral(quantity6).value()) {
			listOrderItems.push({ productId: 14, quantity: numeral(quantity6).value() })
		}
		if (numeral(quantity7).value()) {
			listOrderItems.push({ productId: 12, quantity: numeral(quantity7).value() })
		}
		const params = {
			listOrderItems,
		}
		const resGetCalculate = await flowResult<any>(globalStore?.calculatePrice?.(params))
		console.log('🚀 ~ file: RegisterBox.tsx:139 ~ calculatePrice ~ resGetCalculate:', resGetCalculate)
		setLoading(false)
	}

	useEffect(() => {
		if (
			numeral(quantity1).value() ||
			numeral(quantity2).value() ||
			numeral(quantity3).value() ||
			numeral(quantity4).value() ||
			numeral(quantity5).value() ||
			numeral(quantity6).value() ||
			numeral(quantity7).value()
		) {
			setLoading(true)
		}
		const delayDebounceFn = setTimeout(() => {
			if (
				numeral(quantity1).value() ||
				numeral(quantity2).value() ||
				numeral(quantity3).value() ||
				numeral(quantity4).value() ||
				numeral(quantity5).value() ||
				numeral(quantity6).value() ||
				numeral(quantity7).value()
			) {
				calculatePrice()
			} else {
				globalStore?.setCalculatePriceInfoNull()
				setLoading(false)
			}
		}, 1000)
		return () => clearTimeout(delayDebounceFn)
	}, [quantity1, quantity2, quantity3, quantity4, quantity5, quantity6, quantity7])

	return (
		<>
			<div className="c-register">
				<div className="container">
					<div className="row">
						<div className="col-md-6">
							<div className="is-text">
								<div className="is-4">
									<span></span>
									<span></span>
									<span></span>
									<span></span>
								</div>
								<h2>HƯỚNG DẪN ĐẶT MUA</h2>
								<ul>
									<li>Bước 1: Lựa chọn sản phẩm và số lượng</li>
									<li>Bước 2: Nhập đầy đủ thông tin</li>
									<li>Bước 3: Xác nhận đặt mua</li>
								</ul>

								<br />
								<div className="row">
									<div className="col-4">
										<div className="is-img-l is-big">
											<img src="/gomsu/images/gomsu/trung-kien.png" />
										</div>
										<label>{'Bộ "Sứ Trung Kiên" (trắng), số lượng:'}</label>
										<InputNumber min={0} onChange={(e: number) => setQuantity1(e)} value={quantity1} />
									</div>
									<div className="col-4">
										<div className="is-img-l is-big">
											<img src="/gomsu/images/gomsu/minh-chau.png" />
										</div>
										<label>{'Bộ "Sứ Minh Châu" (trắng), số lượng:'}</label>
										<InputNumber min={0} onChange={(e: number) => setQuantity2(e)} value={quantity2} />
									</div>
									<div className="col-4">
										<div className="is-img-l is-big">
											<img src="/gomsu/images/gomsu/bone.png" />
										</div>
										<label>{'Bộ "Sứ Ngọc (Bone)" (trắng), số lượng:'}</label>
										<InputNumber min={0} onChange={(e: number) => setQuantity3(e)} value={quantity3} />
									</div>
								</div>
								<br />
								<div className="row">
									<div className="col-4">
										{/* <div className="is-img-l is-big">
											<img src="/gomsu/images/gomsu/trung-kien.png" />
										</div> */}
										<label>{'Bộ "Sứ Trung Kiên" (hoa), số lượng:'}</label>
										<InputNumber min={0} onChange={(e: number) => setQuantity4(e)} value={quantity4} />
									</div>
									<div className="col-4">
										{/* <div className="is-img-l is-big">
											<img src="/gomsu/images/gomsu/minh-chau.png" />
										</div> */}
										<label>{'Bộ "Sứ Minh Châu" (hoa), số lượng:'}</label>
										<InputNumber min={0} onChange={(e: number) => setQuantity5(e)} value={quantity5} />
									</div>
									<div className="col-4">
										{/* <div className="is-img-l is-big">
											<img src="/gomsu/images/gomsu/bone.png" />
										</div> */}
										<label>{'Bộ "Sứ Ngọc (Bone)" (kẻ vàng), số lượng:'}</label>
										<InputNumber min={0} onChange={(e: number) => setQuantity6(e)} value={quantity6} />
									</div>
								</div>
								<br />
								<div className="row">
									<div className="col-4"></div>
									<div className="col-4">
										{/* <div className="is-img-l is-big">
											<img src="/gomsu/images/gomsu/minh-chau.png" />
										</div> */}
										<label>{'Bộ "Sứ Minh Châu" (kẻ vàng), số lượng:'}</label>
										<InputNumber min={0} onChange={(e: number) => setQuantity7(e)} value={quantity7} />
									</div>
									<div className="col-4"></div>
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="is-form">
								<div className="is-4">
									<span></span>
									<span></span>
									<span></span>
									<span></span>
								</div>
								<h2>ĐĂNG KÝ TRỰC TUYẾN</h2>
								<br />
								<div className="row">
									<div className="col-md-8">
										<label>Họ và tên:</label>
										<Input value={name} onChange={setName} />
										{helper.getErrorValidateBox(errorsParams, 'name')}
										<br />
									</div>
									<div className="col-md-4">
										<label>Chức danh:</label>
										<SelectPicker
											placeholder="Chọn"
											data={typePe}
											style={{ width: '100%' }}
											value={typePeople}
											onChange={setTypePeople}
											searchable={false}
										/>
										{helper.getErrorValidateBox(errorsParams, 'typePeople')}
										<br />
									</div>
								</div>
								<br />
								<label>Mã thẻ đặc quyền (nếu có):</label>
								<Input value={companyCode} onChange={setCompanyCode} />
								{/* {helper.getErrorValidateBox(errorsParams, 'companyCode')} */}
								<br />
								<label>KĐT/chung cư:</label>
								<br />
								<SelectPicker
									placeholder="Chọn"
									data={company}
									labelKey="name"
									valueKey="id"
									style={{ width: '100%' }}
									value={congDoan}
									onChange={setCongDoan}
									// searchable={false}
								/>
								<br />
								{helper.getErrorValidateBox(errorsParams, 'congDoan')}
								{congDoan == '0' ? (
									<>
										<br />
										<Input placeholder="Nhập tên công đoàn khác" value={note} onChange={setNote} />
										<br />
										{helper.getErrorValidateBox(errorsParams, 'note')}
									</>
								) : null}
								<br />
								<label>Số điện thoại:</label>
								<Input value={phone} onChange={setPhone} />
								{helper.getErrorValidateBox(errorsParams, 'phone')}
								<br />
								<label>Email:</label>
								<Input value={email} onChange={setEmail} />
								{helper.getErrorValidateBox(errorsParams, 'email')}
								<br />
								<div className="row">
									<div className="col-md-12">
										<label>Địa chỉ:</label>
										<Input value={address} onChange={setAddress} />
										{helper.getErrorValidateBox(errorsParams, 'address')}
									</div>
									{/* <div className="col-md-4">
										<label>Loại sản phẩm:</label>
										<SelectPicker
											placeholder="Chọn"
											data={typeList}
											style={{ width: '100%' }}
											value={type}
											onChange={setType}
											searchable={false}
										/>
										{helper.getErrorValidateBox(errorsParams, 'type')}
										<br />
									</div> */}
								</div>
								<br />
								<div className="row">
									<div className="col-md-4">
										<label>{'Tỉnh/Thành:'}</label>
										<SelectPicker
											placeholder="Chọn"
											data={provincelist}
											valueKey={'id'}
											labelKey={'name'}
											block
											onChange={(e) => {
												setProvince(e)
											}}
											value={province}
										/>
										{helper.getErrorValidateBox(errorsParams, 'province')}
										<br />
									</div>
									<div className="col-md-4">
										<label>{'Quận/Huyện:'}</label>
										<SelectPicker
											placeholder="Chọn"
											data={districtListUpdate}
											valueKey={'id'}
											labelKey={'name'}
											block
											onChange={(e) => {
												setDistrict(e)
											}}
											value={district}
										/>
										{helper.getErrorValidateBox(errorsParams, 'district')}
										<br />
									</div>
									<div className="col-md-4">
										<label>{'Xã/thị trấn/phường:'}</label>
										<SelectPicker
											placeholder="Chọn"
											data={wardListUpdate}
											valueKey={'id'}
											labelKey={'name'}
											block
											onChange={setWard}
											value={ward}
										/>
										{helper.getErrorValidateBox(errorsParams, 'ward')}
										<br />
									</div>
								</div>

								<br />
								<div className="is-btn">
									{!isEmpty(calculatePriceInfo) ? (
										<div className="is-price">
											<b>Tổng số tiền: </b>
											<span>{numeral(calculatePriceInfo?.totalMoney).format('#,#')} đồng</span>
										</div>
									) : null}
									<Button disabled={!isEmpty(calculatePriceInfo) ? false : true} onClick={getRegister}>
										Xác nhận
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Modal className="c-modal-success" open={openModal} onClose={handleClose}>
				<Modal.Body>
					<CheckIcon />
					<span>Bạn đã đăng ký thành công!</span>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={handleClose} appearance="subtle">
						Đóng
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default withLayout(
	inject(({ store }: { store: RootStoreHydration }) => ({
		globalStore: store.globalStore,
		store,
	}))(observer(HomeBox))
)
