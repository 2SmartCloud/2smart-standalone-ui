/* eslint-disable react/jsx-no-bind, react/no-multi-comp*/
import React from 'react';
import PropTypes from 'prop-types';
import { Route }  from 'react-router';
import Theme, { getTheme, applyTheme } from '../utils/theme';
import MainLayout from '../components/layouts/MainLayout';
import LoginPage from '../components/pages/admin/LoginPage';
import ToastNotification from '../components/base/ToastNotification';

export default function LoginRoute({ ...rest }) {
    function getActualTheme() {
        const theme = getTheme('adminTheme');

        applyTheme(theme);

        return theme;
    }

    return (
        <Route
            {...rest}
            render={props => {
                const { path } = props.match;

                return (
                    <Theme.Provider
                        value={{
                            theme : getActualTheme()
                        }}
                    >
                        <MainLayout location={props.location}>
                            <ToastNotification />
                            <LoginPage route={path} {...props} />
                        </MainLayout>
                    </Theme.Provider>
                );
            }}
        />
    );
}

LoginRoute.propTypes = {
    location : PropTypes.object.isRequired,
    match    : PropTypes.object.isRequired
};
