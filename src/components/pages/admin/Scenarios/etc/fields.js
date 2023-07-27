export function insertConfigurationFields(mode, configuration = {}, isUpdating = false) {
    let title;

    const fields = [
        {
            name        : 'title',
            label       : 'Scenario\'s title*',
            placeholder : 'Scenario\'s title',
            type        : 'string'
        },
        {
            name        : 'name',
            label       : 'Scenario\'s name*',
            placeholder : 'Scenario\'s name',
            type        : 'string',
            disabled    : isUpdating
        }
    ];

    if (mode === 'ADVANCED') {
        title = 'Pro Scenario';
        fields.push({
            name  : 'script',
            label : 'Scenario\'s script',
            type  : 'javascript'
        });
    } else if (mode === 'SIMPLE') {
        title = configuration?.title;
        fields.unshift({
            name : 'description',
            type : 'description'
        });
        fields.push(...(configuration?.fields || []));
    }

    return {
        ...(configuration || {}),
        title,
        fields
    };
}
