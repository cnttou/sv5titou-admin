import { Route, Redirect } from 'react-router-dom';
import { currentUser } from '../api/authentication';

function PrivateRoute({ ...rest }) {
    let auth = currentUser();
    return auth?.email ? (
        <Route {...rest} />
    ) : (
        <Redirect
            to={{
                pathname: '/login',
                state: { from: rest.path },
            }}
        />
    );
}

export default PrivateRoute;