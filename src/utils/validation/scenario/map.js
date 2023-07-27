export const mapValidatorFields = {
    name  : 'data/name',
    title : 'data/title'
};

export const mapErrorMessages = {
    [mapValidatorFields.name] : {
        'REQUIRED'       : 'Name is required',
        'WRONG_FORMAT'   : 'Invalid format',
        'ALREADY_EXISTS' : 'This name is already exist',
        'TOO_LONG'       : 'Name is too long'
    },
    [mapValidatorFields.title] : {
        'REQUIRED'        : 'Title is required',
        'CANNOT_BE_EMPTY' : 'Title is required',
        'TOO_LONG'        : 'Title is too long'
    }
};
