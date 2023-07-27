import '@babel/polyfill';
import 'isomorphic-fetch';

import React            from 'react';
import ReactDOM         from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider }     from 'react-redux';
import store   from './store/index';
import smartHome from './smartHome/smartHomeSingleton';

function render(Component) {
    ReactDOM.render(
        <Provider store={store}>
            <AppContainer>
                <Component />
            </AppContainer>
        </Provider>,
        document.getElementById('root')
    );
}

export function mountApp() {
    const NextApp = require('./App.js').default;

    render(NextApp);
}

smartHome.init();
mountApp();

if (module.hot) {
    module.hot.accept('./App.js', () => mountApp());
}
