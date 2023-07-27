export function mapScenarioHomie(scenario) {
    const { id, state, rootTopic } = scenario;

    return {
        id,
        state,
        rootTopic,
        name     : id,
        dataType : 'boolean'
    };
}
