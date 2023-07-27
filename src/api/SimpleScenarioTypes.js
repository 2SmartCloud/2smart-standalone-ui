import Base from './Base.js';

class SimpleScenarioTypes extends Base {
    list() {
        return this.apiClient.get('simpleScenarioTypes');
    }
}

export default SimpleScenarioTypes;
