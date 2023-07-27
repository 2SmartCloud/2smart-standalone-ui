import Base from './Base.js';

class Changelog extends Base {
    get() {
        return this.apiClient.get('changelogs');
    }
}

export default Changelog;
