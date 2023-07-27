import queryString from 'query-string';

import store from '../store';
import { handleLogout } from '../actions/session';
import  ApiBase  from './ApiBase';

class ApiAdmin extends ApiBase  {
    async request({ url, method, params = {}, body }) {
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

        try {
            const json = await this.fetch(url, query, fetchPayload);

            if (json.status === 0) {
                const { error } = json;

                if (
                    error.code === 'INVALID_SIGNATURE'
                || error.code === 'PERMISSION_DENIED'
                || error.code === 'INVALID_TOKEN'
                || error.code === 'TOKEN_EXPIRED') {
                    store.dispatch(handleLogout());
                }

                throw json.error;
            }

            return json.data;
        } catch (error) {
            throw error;
        }
    }
}

export default ApiAdmin;
