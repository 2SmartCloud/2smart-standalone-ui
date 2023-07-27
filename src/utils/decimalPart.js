export function getDecimalPart(value) {
    return value.toString().split('.')[1];
}

export function getDecimalPartLength(value) {
    const decimalPart = getDecimalPart(value);

    return decimalPart && decimalPart.length ? decimalPart.length : 0;
}
