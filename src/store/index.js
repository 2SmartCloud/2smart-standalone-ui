import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware                  from 'redux-thunk';
import reducers                         from '../reducers';

const devToolsExt = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line
const enhancer = compose(devToolsExt || compose);

const createStoreWithMiddleware = enhancer(applyMiddleware(thunkMiddleware))(createStore);

const store = createStoreWithMiddleware(reducers);

if (module.hot) {
    module.hot.accept('../reducers', () => {
        const nextRootReducer = require('../reducers/index').default;

        store.replaceReducer(nextRootReducer);
    });
}

export function getClientAccessToken() {
    const state = store.getState();

    return state.user.clientPanelAccessToken;
}

export default store;
