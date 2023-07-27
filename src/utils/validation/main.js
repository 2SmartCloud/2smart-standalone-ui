import LIVR from 'livr';

export const requiredValidator = new LIVR.Validator({
    value : 'required'
});


export function decodeErrors(err) {
    const decodedErrors = { };

    for (const [ key, value ] of Object.entries(err)) {
        const errorField = key.replace('data/', '');

        decodedErrors[errorField] = decodeErrorCode(errorField, value);
    }

    return decodedErrors;
}

function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function decodeErrorCode(errorField, errCode) {
    const field = ERROR_NAMES_MAPPING[errorField] || errorField;

    switch (errCode) {
        case 'REQUIRED':
            return `${capitalize(field)} is required`;
        case 'BAD_CREDENTIALS':
            switch (errorField) {
                case 'oldPassword':
                    return 'The current password you entered is incorrect';
                case 'password':
                    return 'The values you entered are incorrect';
                default:
                    break;
            }
            break;
        case 'FIELDS_NOT_EQUAL':
            return 'Passwords are not equal';
        case 'TOO_SHORT':
            switch (errorField) {
                case 'oldPassword':
                case 'newPasswordConfirm':
                case 'newPassword':
                    return `The ${field} must be at least 6 characters`;
                default:
                    return `${capitalize(field)} is too short`;
            }
        case 'WRONG_FORMAT':
            switch (errorField) {
                case 'username':
                    return 'The login must be characters (A-z), digits (0-9)';
                case 'oldPassword':
                case 'newPasswordConfirm':
                case 'newPassword':
                    return 'The password must be characters (A-z), digits (0-9)';
                default:
                    return 'Wrong characters';
            }
        case 'EXIST':
            switch (errorField) {
                case 'name':
                    return 'Group already exists';

                default:
                    return 'Already exist';
            }
        default:
            return 'Error value';
    }
}

const ERROR_NAMES_MAPPING = {
    'username'           : 'login',
    'oldPassword'        : 'current password',
    'newPasswordConfirm' : 'confirm password',
    'newPassword'        : 'new password'
};

