import Base from './Base.js';

class ScenarioTemplates extends Base {
    list() {
        return this.apiClient.get('scenarioTemplates');
    }
}

export default ScenarioTemplates;
