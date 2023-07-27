export function flattenErrors(error) {
    const errorFields = error?.fields || {};
    const flatErrors = {};

    for (const key of Object.keys(errorFields)) {
        if (errorFields.hasOwnProperty(key)) {
            const pattern = /\/([^/]+)$/g;
            const match = pattern.exec(key);
            const fieldName = match?.[1];

            if (fieldName) flatErrors[fieldName] = errorFields[key];
        }
    }

    return flatErrors;
}

export function scenariosFlattenErrors(error) {
    const errorFields = error?.fields || {};
    const flatErrors = {
        name  : errorFields.data?.name,
        title : errorFields.data?.title,
        ...errorFields.data?.params
    };

    return flatErrors;
}
