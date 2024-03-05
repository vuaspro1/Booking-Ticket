const helper = {
	testClipboard: (key) => {
		navigator.clipboard.writeText(key).then(
			(v) => console.log('Success' + v),
			(e) => console.log('Fail\n' + e)
		)
		const input = document.body.appendChild(document.createElement('input'))
		input.value = key
		input.focus()
		input.select()
		document.execCommand('copy')
		input.parentNode.removeChild(input)
		// window?.['android']?.NativeAndroid?.copyToClipboard(key)
	},
	getErrorValidateBox: (errorsParamsList: any, field: string) => {
		return errorsParamsList && errorsParamsList?.find((item) => item.field == field)?.message ? (
			<span className="mt-1" style={{ color: 'red', display: 'block', marginBottom: 10 }}>
				{errorsParamsList?.find((item) => item.field == field).message}
			</span>
		) : null
	},
}
export default helper
