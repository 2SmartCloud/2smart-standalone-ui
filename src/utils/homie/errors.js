export const HOMIE_ERROR_MAP = {
    ERROR      : 'ERROR',
    VALIDATION : 'VALIDATION',
    TIMEOUT    : 'TIMEOUT'
};

const HOMIE_ERROR_MESSAGES = {
    [HOMIE_ERROR_MAP.ERROR]      : 'Error',
    [HOMIE_ERROR_MAP.VALIDATION] : 'Validation error',
    [HOMIE_ERROR_MAP.TIMEOUT]    : 'Timeout error'
};

export function getHomieErrorMessage(code) {
    const message = HOMIE_ERROR_MESSAGES[code]
        ? HOMIE_ERROR_MESSAGES[code]
        : `${code.charAt(0).toUpperCase()}${code.slice(1).replace(/_/g, ' ').toLowerCase()}`;

    return message;
}
