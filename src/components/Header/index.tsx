import { FC } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Link from 'next/link'
import AuthStore from '@src/stores/auth.store'
import { observer } from 'mobx-react-lite'
import { RootStoreHydration } from '@src/stores/RootStore'
import withLayout from '@src/lib/withLayout'
import { inject } from 'mobx-react'

interface HeaderProps {
	authStore?: AuthStore
}
const Header: FC<HeaderProps> = (props: HeaderProps) => {
	const { authStore } = props
	const user = authStore

	const handleLogout = () => {
		authStore.logout()
	}

	// const router = useRouter()

	// const handleLogout = () => {
	// 	router.push('/login')
	// }

	//   useEffect(() => {
	//     if (user && user.auth !== null) {
	//       router.push("/");
	//     } else {
	//       router.push("/login");
	//     }
	//   }, [user]);

	return (
		<>
			<Navbar expand="lg" className="bg-body-tertiary is-header">
				<Container>
					{user?.auth?.id ? (
						<Navbar.Brand href="/">Booking Ticket</Navbar.Brand>
					) : (
						<Navbar.Brand href="/login">Booking Ticket</Navbar.Brand>
					)}
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						{user?.auth?.id != null && (
							<>
								<Nav className="me-auto">
									<Link href="/" passHref>
										<Nav.Link className="is-link">Home</Nav.Link>
									</Link>
									{user && user?.auth?.roles === 'Manager' && (
										<Link href="/users" passHref>
											<Nav.Link className="is-link">Manager Users</Nav.Link>
										</Link>
									)}
								</Nav>
								{user && user.auth && <span className="">Welcome {user?.auth?.userName}</span>}
							</>
						)}
						<Nav>
							<NavDropdown title="Setting">
								{user && user?.auth?.id != null ? (
									<Link href="/login" passHref>
										<NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
									</Link>
								) : (
									<Link href="/login" passHref>
										<NavDropdown.Item>Login</NavDropdown.Item>
									</Link>
								)}
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	)
}

export default withLayout(
	inject(({ store }: { store: RootStoreHydration }) => ({
		authStore: store.authStore,
		loading: store.loading,
	}))(observer(Header))
)
