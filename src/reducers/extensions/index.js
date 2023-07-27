import produce                  from 'immer';
import { EXTENSIONS_SORT_ORDER } from '../../assets/constants/localStorage';
import { getData }              from '../../utils/localStorage';
import {
    GET_EXTENSIONS_REQUEST,
    GET_EXTENSIONS_SUCCESS,
    GET_EXTENSIONS_FAILURE,
    SET_EXTENSIONS_CURRENT_PAGE,
    SET_EXTENSIONS_SEARCH_QUERY,
    SET_EXTENSIONS_SORT_ORDER,
    ADD_EXTENSION_ENTITY,
    GET_EXTENSION_ENTITIES,
    DELETE_EXTENSION_ENTITY,
    UPDATE_EXTENSION_ENTITY,
    CHANGE_EXTENSION_PROCCESSING,
    // GET_SINGLE_EXTENSION_REQUEST,
    GET_SINGLE_EXTENSION_SUCCESS
    // GET_SINGLE_EXTENSION_FAILURE,
} from '../../actions/extensions/';


const initialState = {
    installedEntities : {
        list       : [],
        isFetching : true
    },

    list       : [],
    isFetching : true,
    isUpdating : false,

    searchQuery : '',
    sortOrder   : getData(EXTENSIONS_SORT_ORDER) || 'ASC',
    currentPage : 1
};

export default produce((draft, action) => {
    const installedEntitiesList = draft.installedEntities.list;

    switch (action.type) {
        case  GET_EXTENSIONS_REQUEST:
            if (draft.list.length) {
                draft.isUpdating = true;
            } else {
                draft.isFetching = true;
            }
            break;

        case GET_EXTENSIONS_SUCCESS:
            draft.list = action.payload.extensions;
            draft.isFetching = false;
            draft.isUpdating = false;
            break;

        case GET_EXTENSIONS_FAILURE: {
            draft.isFetching = false;
            draft.isUpdating = false;
            break;
        }

        case GET_EXTENSION_ENTITIES: {
            draft.installedEntities.list = action.payload.extensions;
            draft.installedEntities.isFetching = false;
            break;
        }
        case UPDATE_EXTENSION_ENTITY: {
            const { id, updated } = action.payload;
            const index = installedEntitiesList.findIndex(item => item.id === id);

            if (index >= 0) {
                installedEntitiesList[index] = {
                    ...installedEntitiesList[index],
                    ...updated
                };
            }
            break;
        }
        case ADD_EXTENSION_ENTITY: {
            const { extension } = action.payload;
            const index = installedEntitiesList.findIndex(item => item.id === extension.id);

            if (index >= 0) {
                installedEntitiesList[index] = extension;
            } else {
                installedEntitiesList.push(extension);
            }
            break;
        }

        case GET_SINGLE_EXTENSION_SUCCESS: {
            const { extension } = action.payload;
            const list = draft.list;
            const index = list.findIndex(item => item.name === extension.name);

            if (index >= 0) {
                list[index] = extension;
            } else {
                list.push(extension);
            }
            break;
        }

        case DELETE_EXTENSION_ENTITY:
            draft.installedEntities.list = installedEntitiesList.filter(item => item.id !== action.payload.id);
            break;

        case SET_EXTENSIONS_SEARCH_QUERY:
            draft.searchQuery = action.payload.searchQuery;
            break;

        case SET_EXTENSIONS_SORT_ORDER:
            draft.sortOrder = action.payload.sortOrder;
            break;

        case SET_EXTENSIONS_CURRENT_PAGE:
            draft.currentPage = action.payload.currentPage;
            break;

        case CHANGE_EXTENSION_PROCCESSING: {
            const { entityId, isProcessing, name, processingLabel = ''  } = action.payload;

            const index = installedEntitiesList.findIndex(item => item.id === entityId);
            const extensionsList = draft.list;

            if (index >= 0) {
                installedEntitiesList[index] = {
                    ...installedEntitiesList[index],
                    processingLabel,
                    isProcessing
                };
            } else {
                const notInstalledExtensionIndex = extensionsList.findIndex(item => item.name === name);

                if (notInstalledExtensionIndex >= 0) {
                    extensionsList[notInstalledExtensionIndex] = {
                        ...extensionsList[notInstalledExtensionIndex],
                        processingLabel,
                        isProcessing
                    };
                }
            }
            break;
        }
        default:
            break;
    }
}, initialState);
