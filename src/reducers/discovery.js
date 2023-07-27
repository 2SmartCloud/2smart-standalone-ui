import produce from 'immer';
import {
    GET_DISCOVERIES,
    ADD_NEW_DISCOVERY,
    ACCEPT_DISCOVERY,
    DELETE_DISCOVERY,
    CHANGE_DISCOVERY_STATUS,
    START_DELETE_LOADING,
    STOP_DELETE_LOADING
} from '../actions/discovery';


const INITIAL_STATE = {
    discoveries : { },
    isLoading   : false,
    isFetching  : true
};

export default produce((draft, action) => {
    switch (action.type) {
        case GET_DISCOVERIES:
            draft.discoveries = action.payload.discoveries;
            draft.isFetching = false;
            break;

        case ADD_NEW_DISCOVERY:  {
            const { discovery, discovery  : { id } } = action;

            draft.discoveries[id] = discovery;
            break;
        }


        case ACCEPT_DISCOVERY:  {
            const { discovery, discovery:{ id } } = action.payload;
            const discoveryDraft =   draft.discoveries[id];

            draft.discoveries[id] = {
                ...discoveryDraft,
                ...discovery
            };
            break;
        }


        case DELETE_DISCOVERY:  {
            const { id } = action.payload;

            delete draft.discoveries[id];
            break;
        }

        case CHANGE_DISCOVERY_STATUS:  {
            const { status, id } = action;

            draft.discoveries[id].status = status;
            break;
        }


        case START_DELETE_LOADING:  {
            draft.isLoading = true;
            break;
        }


        case STOP_DELETE_LOADING:  {
            draft.isLoading = false;
            break;
        }

        default:
            break;
    }
}, INITIAL_STATE);
