/** @jest-environment node */
// jest.mock('next');

// import next from 'next';

// next.mockReturnValue({
// 	prepare: () => Promise.resolve(),
// 	getRequestHandler: () => (req, res) => res.status(200),
// 	getConfig: () => ({
// 		publicRuntimeConfig: {} /* This is where you import the mock values */
// 	})
// });
import '@testing-library/jest-dom/extend-expect'

jest.mock('next/config', () => () => ({
	publicRuntimeConfig: {},
}))

jest.mock('next/router', () => ({
	useRouter() {
		return {
			route: '/',
			pathname: '',
			query: '',
			asPath: '',
			push: jest.fn(),
			events: {
				on: jest.fn(),
				off: jest.fn(),
			},
			beforePopState: jest.fn(() => null),
			prefetch: jest.fn(() => null),
		}
	},
}))
