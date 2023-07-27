import LIVR from 'livr';

export function lessThan(field) {
    return (value, data) => {
        const secondaryValue = parseInt(data[field], 10);
        const primaryValue = parseInt(value, 10);
        const isValueInt = Number.isInteger(primaryValue);
        const isSecondaryValueInt = Number.isInteger(secondaryValue);

        if (!isSecondaryValueInt && !isValueInt) return;
        if (isSecondaryValueInt && !isValueInt) return 'REQUIRED';
        if (primaryValue >= secondaryValue) return 'TOO_HIGH';
    };
}

export function greaterThan(field) {
    return (value, data) => {
        const secondaryValue = parseInt(data[field], 10);
        const primaryValue = parseInt(value, 10);
        const isValueInt = Number.isInteger(primaryValue);
        const isSecondaryValueInt = Number.isInteger(secondaryValue);

        if (!isSecondaryValueInt && !isValueInt) return;
        if (isSecondaryValueInt && !isValueInt) return 'REQUIRED';
        if (primaryValue <= secondaryValue) return 'TOO_LOW';
    };
}

export function withinRange(startField, endField) {
    return (value, data) => {
        const startValue = parseFloat(data[startField], 10);
        const endValue = parseFloat(data[endField], 10);
        const range = endValue - startValue;
        const validator = new LIVR.Validator({ value: { 'max_number': range } });
        const isValid = validator.validate({ value });

        if (!isValid) return 'OUT_OF_RANGE';
    };
}
