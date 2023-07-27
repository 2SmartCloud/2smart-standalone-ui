import Base from './Base.js';

class Widgets extends Base {
    create(body) {
        return this.apiClient.post('widgets', body);
    }

    delete({ id, screen }) {
        return this.apiClient.delete(`widgets/${id}`, screen);
    }

    edit(id, body) {
        return this.apiClient.put(`widgets/${id}`, body);
    }
}

export default Widgets;
