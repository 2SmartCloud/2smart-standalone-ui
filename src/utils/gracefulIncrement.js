import { getDecimalPartLength } from './decimalPart';

export default function gracefulIncrement(value, step = 1) {
    const stringValue = value.toString();
    const stepDecimalPartLength = getDecimalPartLength(step);
    const valueDecimalPartLength = getDecimalPartLength(value);
    const decimalPartLength = valueDecimalPartLength > stepDecimalPartLength ?
        valueDecimalPartLength :
        stepDecimalPartLength;
    const multiplier = Math.pow(10, decimalPartLength);
    const result = Math.round((parseFloat(stringValue) + step) * multiplier) / multiplier;

    return result;
}
