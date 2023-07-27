import queryString from 'query-string';
import store from '../store';
import { showPinForm, hidePinForm } from '../actions/interface';
import { removeClientPanelAccess } from '../actions/user';
import  ApiBase  from './ApiBase';

const REJECT_ERROR = {
    code : 'REQUEST_REJECTED'
};

class ApiClient extends ApiBase  {
    constructor({ url, prefix = 'v1/', token = '', type } = {}) {
        super({ url, prefix, token, type });

        this.requestsControllersMap = {};
    }

    processAbortController(method, url) {
        const patternsMap = [
            { pattern: /screens$/g, key: 'screens' },
            { pattern: /screens\/\d+$/g, key: 'screen' }
        ];

        const match = patternsMap.find(pattern => pattern.pattern.test(url));

        if (match) {
            try {
                const requestKey = `${method}:${match.key}`;
                const controller = new AbortController();
                const { signal } = controller;

                if (this.requestsControllersMap[requestKey]) this.requestsControllersMap[requestKey].abort();
                this.requestsControllersMap[requestKey] = controller;

                return signal;
            } catch (e) {
                console.error('AbortController is not supported in the current browser!');
            }
        }
    }

    async request({ url, method, params = {}, body }) {
        const signal = this.processAbortController(method, url);
        const query = Object.keys(params).length ? `?${queryString.stringify(params)}` : '';

        const fetchPayload = {
            method,
            headers : {
                'Content-Type'  : 'application/json',
                'Cache-Control' : 'no-cache',
                'pragma'        : 'no-cache',
                ...(this.token ? { 'x-access-token': this.token } : {})
            },
            withCredentials : true,
            crossDomain     : false,
            body            : method !== 'GET' ? JSON.stringify({ data: body }) : undefined
        };


        if (signal) {
            fetchPayload.signal = signal;
        }

        try {
            const json = await this.fetch(url, query, fetchPayload);

            if (json.status === 0) {
                const { error } = json;
                const { code } = error;

                if (code === 'PERMISSION_DENIED') {
                    return this.requestPin(method, url, params, body);
                }

                throw json.error;
            }

            return json.data;
        } catch (error) {
            if (!error.status && error.name === 'TypeError') {
                this.handleNetworkError();
            } else if (error.status) {
                this.handleServerError(error);
            }

            throw error;
        }
    }

    isPinClosable(method, url) {
        const requests = [
            { method: 'POST', urlPattern: /screens$/g },
            { method: 'PUT', urlPattern: /screens\/\d+$/g }
        ];

        const screens = store.getState().client.dashboard.screens;
        const activeScreen = screens.find(screen => screen.isActive);
        const isScreenLocked = activeScreen.isParentControlEnabled;

        const isClosableRequest = requests.some(request =>
            request.method === method
            && request.urlPattern.test(url)
        );

        return isClosableRequest && !isScreenLocked;
    }

    requestPin = async (method, url, params, body) => {
        store.dispatch(removeClientPanelAccess());

        await new Promise((resolve, reject) => {
            store.dispatch(showPinForm({
                isCloseable : this.isPinClosable(method, url),
                cb          : () => {
                    resolve();
                    store.dispatch(hidePinForm());
                },
                reject : () => {
                    reject(REJECT_ERROR);
                }
            }));
        });

        return this.request({ url, method, params, body });
    }
}

export default ApiClient;
