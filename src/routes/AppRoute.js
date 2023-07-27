/* eslint-disable react/jsx-no-bind, react/no-multi-comp*/
import React     from 'react';
import PropTypes                from 'prop-types';
import { Route, Redirect }        from 'react-router';
import { AUTH_LAYOUT } from '../assets/constants/routes';
import ToastNotification from '../components/base/ToastNotification';
import api from '../apiSingleton';
import MainLayout from '../components/layouts/MainLayout';

function dummyLayout(props) {
    return props.children;
}

export default function AppRoute({ component: Page, layout, ...rest }) {
    return (
        <Route
            {...rest}
            render={props => {
                const Layout = layout ? layout : dummyLayout;
                const { path } = props.match;
                const token  = api.apiAdmin.getToken();
                const isShowPage  = token || !AUTH_LAYOUT.includes(path);

                return (
                    <MainLayout location={props.location}>
                        <ToastNotification />
                        <Layout {...props} route={path}>
                            {isShowPage
                                ?  <Page route={path} {...props} />
                                : (
                                    <Redirect
                                        to={{
                                            pathname : '/admin/login',
                                            state    : { from: props.location }
                                        }}
                                    />
                                )
                            }
                        </Layout>
                    </MainLayout>
                );
            }}
        />
    );
}

AppRoute.propTypes = {
    component : PropTypes.any.isRequired,
    location  : PropTypes.object.isRequired,
    match     : PropTypes.object.isRequired,
    layout    : PropTypes.any
};

AppRoute.defaultProps = {
    layout : undefined
};
