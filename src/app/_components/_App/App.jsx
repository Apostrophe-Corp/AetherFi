// import { AirdropDetails } from '@/components/AirdropDetails'
import { Footer } from '@/components/Footer'
import { Modal } from '@/components/Modal'
import { MiniNav, NavBar } from '@/components/NavBar'
import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import a from './App.module.css'

const Container = ({ c, children }) => {
	return <div className={cf(s.wMax, s.flex, s.flexTop, c)}>{children}</div>
}

const App = ({ children }) => {
	return (
		<div className={cf(s.wMax, s.flex, s.flexTop, s.p_relative, a.app)}>
			<Container c={cf(a.navBar)}>
				<NavBar />
			</Container>
			<Container c={cf(a.children)}>{children}</Container>
			<Container c={cf(a.footer)}>
				<Footer />
			</Container>
			{/* <Container c={cf(a.airdropDetails)}>
				<AirdropDetails />
			</Container> */}
			<Container c={cf(a.miniNavBar)}>
				<MiniNav />
			</Container>
			<Container c={cf(a.modal)}>
				<Modal />
			</Container>
		</div>
	)
}

export default App
