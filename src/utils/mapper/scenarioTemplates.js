export function mapScenarioTemplate(scenario) {
    const { name, code } = scenario;

    return {
        label : name,
        value : code
    };
}
