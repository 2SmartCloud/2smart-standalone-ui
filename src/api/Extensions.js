import Base from './Base.js';

class Extensions extends Base {
    list(params) {
        return this.apiClient.get('extensions', { ...params });
    }

    show(id) {
        return this.apiClient.get(`extensions/${id}`);
    }
}

export default Extensions;
