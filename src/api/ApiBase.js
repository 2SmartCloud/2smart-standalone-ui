import {
    dispatchHandleErrorCode,
    dispatchHandleSuccessResponse
} from '../actions/error';

export default class ApiBase {
    constructor({ url, prefix = '/', token = '' } = {}) {
        this.url    = url;
        this.prefix = prefix;
        this.token  = token;
    }

    async get(url, params) {
        return this.request({
            url,
            params,
            method : 'GET'
        });
    }

    async post(url, payload = {}) {
        return this.request({
            url,
            method : 'POST',
            body   : payload
        });
    }

    async put(url, payload = {}) {
        return this.request({
            url,
            method : 'PUT',
            body   : payload
        });
    }

    async patch(url, payload = {}) {
        return this.request({
            url,
            method : 'PATCH',
            body   : payload
        });
    }

    async delete(url, payload = {}) {
        return this.request({
            url,
            method : 'DELETE',
            body   : payload
        });
    }

    setToken(token) {
        this.token = token;
    }

    getToken() {
        return this.token;
    }

    async fetch(url, query, payload) {
        try {
            const response = await fetch(`${this.url}${this.prefix}${url}${query}`, payload);

            if (response.status === 502) throw (new TypeError('Failed to fetch'));

            const json = await response.json();

            if (json.status === 0) {
                const { error } = json;

                this.displayResponseErrors(url, error);
            }

            this.handleSuccessResponse();

            return json;
        } catch (error) {
            if (!error.status && error.name === 'TypeError') {
                this.handleNetworkError();
            } else if (error.status) {
                this.handleServerError(error);
            }

            throw error;
        }
    }

    request() {
        throw new Error('You should define the request method in your class!');
    }

    displayResponseErrors = (url, error) => {
        const { code } = error;

        if (code) {
            console.log(`REQUEST FAILED FOR [[ ${url} ]]: ${code}`);

            dispatchHandleErrorCode(code);
        }
    }

    handleSuccessResponse = () => {
        dispatchHandleSuccessResponse();
    }

    handleNetworkError = () => {
        dispatchHandleErrorCode('NETWORK_ERROR');
    }

    handleServerError = (error) => {
        console.log('SERVER ERROR: ', error);
    }
}
