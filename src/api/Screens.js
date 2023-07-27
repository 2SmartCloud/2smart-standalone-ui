import Base from './Base.js';

class Screens extends Base {
    list(params) {
        return this.apiClient.get('screens', params);
    }

    create(body) {
        return this.apiClient.post('screens', body);
    }

    update(id, payload) {
        return this.apiClient.put(`screens/${id}`, payload);
    }

    show(id) {
        return this.apiClient.get(`screens/${id}`);
    }

    edit(id, body) {
        return this.apiClient.put(`screens/${id}`, body);
    }

    delete(id) {
        return this.apiClient.delete(`screens/${id}`);
    }
}

export default Screens;
