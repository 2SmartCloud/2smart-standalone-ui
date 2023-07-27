/* eslint-disable camelcase */
import LIVR from 'livr';

export const batteryLevelValidator = new LIVR.Validator({
    value : [ 'required', { min_number: 0 }, {  max_number: 100 } ]
});

export const networkSignalValidator = new LIVR.Validator({
    value : [ 'required', { min_number: 0 }, { max_number: 100 } ]
});

export const possibleStatuses = [ 'init', 'ready', 'disconnected', 'sleeping', 'lost', 'alert' ];

export const statusValidator = new LIVR.Validator({
    status : [ 'required', { 'oneOf': possibleStatuses } ]
});

