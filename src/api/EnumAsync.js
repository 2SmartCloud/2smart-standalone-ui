import Base from './Base';

class EnumAsync extends Base {
    list(path, params) {
        const pathToSet = path.replace('/', '');

        return this.apiClient.get(pathToSet, { ...params, limit: 20 });
    }
}

export default EnumAsync;
