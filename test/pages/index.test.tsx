import { render /* , screen */ } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../../src/pages/_app'
import Home from '../../src/pages/index'
/* import { createRouter } from 'next/router'

window.__NEXT_DATA__ = {
	props: {},
	page: '',
	query: {},
	buildId: '',
}

const router = createRouter('', { user: 'nikita' }, '', {
	subscription: jest.fn(),
	initialProps: {
		props: {},
	},
	pageLoader: jest.fn(),
	App: jest.fn(),
	Component: jest.fn(),
	wrapApp: jest.fn(),
	isFallback: false,
}) */
const useRouter = jest.spyOn(require('next/router'), 'useRouter')
const router: any = useRouter

describe('Home', () => {
	it('renders a heading', () => {
		const { container } = render(<App Component={Home} pageProps={{}} router={router} />)
		expect(container).toMatchSnapshot()

		/* const heading = screen.getByRole('heading', {
			name: /welcome to next\.js!/i,
		})

		expect(heading).toBeInTheDocument() */
	})
})
