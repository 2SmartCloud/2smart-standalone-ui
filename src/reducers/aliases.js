import produce from 'immer';
import {
    GET_ALIAS_ENTITIES,
    ADD_ALIAS_ENTITY,
    DELETE_ALIAS_ENTITY,
    UPDATE_ALIAS
} from '../actions/alias';


const INITIAL_STATE = {
    list       : [],
    isFetching : false
};

export default produce((draft, action) => {
    switch (action.type) {
        case GET_ALIAS_ENTITIES:
            draft.list = action.payload.aliases;
            draft.isFetching = false;
            break;

        case ADD_ALIAS_ENTITY: {
            const { alias } = action.payload;
            const index = draft.list.findIndex(item => item.id === alias.id);

            if (index >= 0) {
                draft.list[index] = alias;
            } else {
                draft.list.push(alias);
            }
            break;
        }

        case DELETE_ALIAS_ENTITY:
            draft.list = draft.list.filter(item => item.id !== action.payload.id);
            break;


        case UPDATE_ALIAS: {
            const { id, updated } = action.payload;
            const index = draft.list.findIndex(item => item.id === id);

            if (index >= 0) {
                draft.list[index] = {
                    ...draft.list[index],
                    ...updated
                };
            }
            break;
        }


        default:
            break;
    }
}, INITIAL_STATE);
