import enGB from 'date-fns/locale/en-GB'

const Calendar = {
	sunday: 'Su',
	monday: 'Mo',
	tuesday: 'Tu',
	wednesday: 'We',
	thursday: 'Th',
	friday: 'Fr',
	saturday: 'Sa',
	ok: 'OK',
	today: 'Today',
	yesterday: 'Yesterday',
	hours: 'Hours',
	minutes: 'Minutes',
	seconds: 'Seconds',
	/**
	 * Format of the string is based on Unicode Technical Standard #35:
	 * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
	 **/
	formattedMonthPattern: 'MMM yyyy',
	formattedDayPattern: 'dd MMM yyyy',
	dateLocale: enGB,
}

export const locale = {
	common: {
		loading: 'Đang tải...',
		emptyMessage: 'Không có dữ liệu',
	},
	Plaintext: {
		unfilled: 'Unfilled',
		notSelected: 'Not selected',
		notUploaded: 'Not uploaded',
	},
	Pagination: {
		more: 'Thêm',
		prev: 'Trước',
		next: 'Sau',
		first: 'Đầu',
		last: 'Cuối',
		limit: '{0} / trang',
		total: 'Tổng: {0}',
		skip: 'Đến{0}',
	},
	Calendar,
	DatePicker: {
		...Calendar,
	},
	DateRangePicker: {
		...Calendar,
		last7Days: 'Last 7 Days',
	},
	Picker: {
		noResultsText: 'Không có kết quả',
		placeholder: 'Chọn',
		searchPlaceholder: 'Tìm',
		checkAll: 'Tất cả',
	},
	InputPicker: {
		newItem: 'New item',
		createOption: 'Create option "{0}"',
	},
	Uploader: {
		inited: 'Initial',
		progress: 'Uploading',
		error: 'Error',
		complete: 'Finished',
		emptyFile: 'Empty',
		upload: 'Upload',
	},
	CloseButton: {
		closeLabel: 'Close',
	},
	Breadcrumb: {
		expandText: 'Show path',
	},
	Toggle: {
		on: 'Open',
		off: 'Close',
	},
}
