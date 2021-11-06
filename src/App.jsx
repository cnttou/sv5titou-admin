import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import pages from './routes/Routes';
import { Suspense } from 'react';
import Loading from './components/Loading';
import HeaderUser from './components/HeaderUser';
import { lazy } from 'react';
const FooterContent = lazy(() => import('./components/FooterContent'));
import './App.css';
import 'antd/dist/antd.css';
import PrivateRoute from './routes/PrivateRoute';

function App() {
	const showPage = (pages) => {
		var result = null;
		if (pages.length > 0) {
			result = pages.map((page, i) =>
				page.private === true ? (
					<PrivateRoute key={i} {...page} />
				) : (
					<Route key={i} {...page} />
				)
			);
		}
		return result;
	};
	return (
		<>
			<Router>
				<HeaderUser />
				<Suspense fallback={<Loading />}>
					<Switch>
						<Redirect from="/" to="/admin" exact />
						{showPage(pages)}
					</Switch>
					<FooterContent />
				</Suspense>
			</Router>
		</>
	);
}

export default App;
