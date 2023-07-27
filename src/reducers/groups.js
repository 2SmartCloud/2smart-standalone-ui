import produce from 'immer';
import {
    GET_GROUP_ENTITIES,
    ADD_GROUP_ENTITY,
    DELETE_GROUP_ENTITY,
    UPDATE_GROUP,
    CHANGE_GROUP_VALUE_PROCESSING,
    SET_GROUP_VALUE_ERROR,
    REMOVE_GROUP_VALUE_ERROR

} from '../actions/groups';


const INITIAL_STATE = {
    list       : [],
    isFetching : false
};

export default produce((draft, action) => {
    switch (action.type) {
        case GET_GROUP_ENTITIES:
            draft.list = action.payload.groups;
            draft.isFetching = false;
            break;

        case ADD_GROUP_ENTITY: {
            const { group } = action.payload;
            const index = draft.list.findIndex(item => item.id === group.id);

            if (index >= 0) {
                draft.list[index] = group;
            } else {
                draft.list.push(group);
            }
            break;
        }

        case DELETE_GROUP_ENTITY:
            draft.list = draft.list.filter(item => item.id !== action.payload.id);
            break;


        case UPDATE_GROUP: {
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
        case CHANGE_GROUP_VALUE_PROCESSING: {
            const { id, status } = action.payload;
            const group = draft.list.find(({ id:itemId }) => itemId === id);

            group.isValueProcessing = status;
            break;
        }

        case SET_GROUP_VALUE_ERROR: {
            const { id, error } = action.payload;
            const group = draft.list.find(({ id:itemId }) => itemId === id);

            group.valueError = {
                isExist : true,
                error
            };
            group.isValueProcessing = false;

            break;
        }
        case REMOVE_GROUP_VALUE_ERROR: {
            const { id } = action.payload;
            const group = draft.list.find(({ id:itemId }) => itemId === id);

            group.valueError = {};
            break;
        }

        default:
            break;
    }
}, INITIAL_STATE);
