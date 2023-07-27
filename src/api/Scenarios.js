import Base from './Base.js';

class Scenarios extends Base {
    list(params) {
        return this.apiClient.get('scenarios', { ...params, limit: 100, sortBy: 'createdAt' });
    }

    create(payload) {
        return this.apiClient.post('scenarios', payload);
    }

    update(id, payload) {
        return this.apiClient.put(`scenarios/${id}`, payload);
    }

    show(id, params) {
        return this.apiClient.get(`scenarios/${id}`, params);
    }

    delete(id, payload) {
        return this.apiClient.delete(`scenarios/${id}`, payload);
    }

    getUniqueName(params) {
        return this.apiClient.get('scenariosUniqueName', params);
    }
}

export default Scenarios;
