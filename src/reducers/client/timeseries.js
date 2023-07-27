import { RUN_TIME_SERIES } from '../../actions/client/timeseries';

const initialState = {
    isRunning : false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case RUN_TIME_SERIES:
            return {
                ...state,
                isRunning : true
            };
        default:
            return state;
    }
}
