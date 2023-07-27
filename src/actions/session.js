import api from '../apiSingleton';
import history from '../history';
import { AUTH_LAYOUT, ADMIN_LOGIN } from '../assets/constants/routes';
import { uttachErrorMessageToSpinner } from '../utils/removeSpinner';

export const UPDATE_SESSION_REQUEST = 'UPDATE_SESSION_REQUEST';
export const UPDATE_SESSION_SUCCESS = 'UPDATE_SESSION_SUCCESS';
export const UPDATE_SESSION_FAILURE = 'UPDATE_SESSION_FAILURE';


export function handleLogin(payload) {
    return async dispatch => {
        try {
            const data = await api.sessionsjwt.login(payload);
            const jwt = data.accessToken;

            dispatch({
                type : UPDATE_SESSION_SUCCESS
            });

            localStorage.setItem('jwt', jwt);
            api.apiAdmin.setToken(jwt);
        } catch (err) {
            localStorage.setItem('jwt', '');
            api.apiAdmin.setToken('');
            dispatch({ type: UPDATE_SESSION_FAILURE });
            throw (err);
        }
    };
}

export function handleLogout() {
    return () => {
        // const isAuthRoute = AUTH_LAYOUT.includes(history.location.pathname);

        // if (isAuthRoute) {
        localStorage.setItem('jwt', '');
        api.apiAdmin.setToken('');
        history.replace('/admin/login');
        // }
    };
}

export function updateJwtToken() {
    return async dispatch => {
        try {
            const jwt = api.apiAdmin.getToken();
            const data = await api.sessionsjwt.update({ token: jwt });
            const token = data.accessToken;

            if (token) {
                localStorage.setItem('jwt', token);
                api.apiAdmin.setToken(token);
                dispatch({
                    type : UPDATE_SESSION_SUCCESS
                });
            }
        } catch (err) {
            console.log(err);
        }
    };
}

export function intervalCheckSession(route) {
    return async dispatch => {
        try {
            await dispatch(checkSession(route));
        } catch (err) {
            if ((!err.status && err.name === 'TypeError') || err.code === 502) {
                uttachErrorMessageToSpinner();
                setTimeout(() => dispatch(intervalCheckSession(route)), 5000);
            }
        }
    };
}


export function checkSession(route) {
    return async dispatch => {
        try {
            const jwt = api.apiAdmin.getToken() || localStorage.getItem('jwt');
            const isAuthRoute = AUTH_LAYOUT.includes(route);

            if (!jwt && isAuthRoute)   {
                dispatch(handleLogout());

                return;
            }

            const data = await api.sessionsjwt.update({ token: jwt });
            const token = data.accessToken;

            dispatch({
                type : UPDATE_SESSION_REQUEST
            });

            if (token) {
                localStorage.setItem('jwt', token);
                api.apiAdmin.setToken(token);
                dispatch({
                    type : UPDATE_SESSION_SUCCESS
                });
                if (route === ADMIN_LOGIN)  history.replace('/admin');
            }
        } catch (err) {
            const isTokenInvalid = err.code === ('TOKEN_EXPIRED' || 'INVALID_SIGNATURE' || 'INVALID_TOKEN' || 'PERMISSION_DENIED');
            const isAuthRoute = AUTH_LAYOUT.includes(route);

            if (isTokenInvalid && isAuthRoute) {
                dispatch({
                    type : UPDATE_SESSION_FAILURE
                });
                dispatch(handleLogout());
            }
            throw err;
        }
    };
}
