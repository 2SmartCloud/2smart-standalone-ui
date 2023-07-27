import LIVR from 'livr';

const validator = new LIVR.Validator({
    value : [ 'required', 'decimal' ]
});

export default validator;
