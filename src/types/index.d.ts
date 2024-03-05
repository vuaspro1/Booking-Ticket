export {}

declare global {
	interface Window {
		myListAddress: any
	}
	interface Attributes {
		minimized: any
		logged_in_greeting?: any
		logged_out_greeting?: any
		page_id?: any
		theme_color?: any
	}
}
