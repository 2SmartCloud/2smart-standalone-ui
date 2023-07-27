import Base from './Base.js';

class Users extends Base {
    show() {
        return this.apiClient.get('/users/info');
    }

    updatePin(payload) {
        return this.apiClient.post('/users/pin', payload);
    }

    updateCredentials(payload) {
        return this.apiClient.put('/users/me', payload);
    }
}

export default Users;
