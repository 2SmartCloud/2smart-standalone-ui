import configureMockStore from 'redux-mock-store';
import {ALIASES} from '../__mocks__/aliasesMock';
import thunk from 'redux-thunk';
import smartHome from '../smartHome/smartHomeSingleton';
import * as mapperService from '../utils/mapper/alias';
import * as homieActions from './homie';
import * as interfaceActions from './interface';


import * as actions from './alias';


const mockStore = configureMockStore([ thunk ]);

describe('Alias actions', () => {
    let store;

    beforeEach(() => {
        setupSpies();

        store = mockStore({});
    });

    it('getAliases()', async () => {

        const expectedActions = [
            { type: actions.GET_ALIAS_ENTITIES, payload: { aliases:ALIASES } }
        ];

        await store.dispatch(actions.getAliases());

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('onNewAliasEntity()', async () => {
        const newAlias = {
            name:'name1',
            id:'id1',
            connectedTopic:'sweet-home/fat/$telemetry/supply',
            rootTopic:'topics-aliases/id1'
        };
        const expectedActions = [
            { type: actions.ADD_ALIAS_ENTITY, payload: { alias:newAlias }}
        ];

        await store.dispatch(actions.onNewAliasEntity(getMockEntities()[0]));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('createAliasEntity() success', async () => {
        const payload= {
            name:'alias'
        };

        await store.dispatch(actions.createAliasEntity(payload));

        expect(smartHome.createEntityRequest).toHaveBeenCalledWith(actions.ALIAS_ENTITY_TYPE, payload);
    });

  /*   it('onAliasError',  () => {
        const error = { code: 'VALIDATION_ERROR', fieds:{name:'WRONG_FORMAT', message:'message'} };
        
        store.dispatch(actions.onAliasError(error,'id'));

        const meta = { deviceId: null, nodeId: null, propertyId: 'id' };
        const errorMessage =  actions.ERROR_MESSAGES['WRONG_FORMAT'];
        const title='Validation error';

        expect(interfaceActions.callValErrNotification).toHaveBeenCalledWith({meta,title,errorMessage});
    });
 */

    it('deleteAliasEntity() success', async () => {
        const entityId = 'id1';
        const expectedActions = [];

        await store.dispatch(actions.deleteAliasEntity({entityId}));

        expect(store.getActions()).toEqual(expectedActions);
        expect(smartHome.deleteEntityRequest).toHaveBeenCalledWith(actions.ALIAS_ENTITY_TYPE, entityId);
    });

    it('deleteAliasEntity() failed', async () => {
        const error = { code: 'VALIDATION_ERROR' };
        spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });

        const entityId = 'id1';
        const expectedActions = [ { type: 'STUB_ERROR' } ];

        try {
            await store.dispatch(actions.deleteAliasEntity(entityId));

            expect(store.getActions()).toEqual(expectedActions);
            expect(smartHome.deleteEntityRequest).toHaveBeenCalledWith(actions.ALIAS_ENTITY_TYPE, entityId);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        } catch {}
    });


    it('onDeleteAliasEntity()', async () => {
        const expectedActions = [
            { type: actions.DELETE_ALIAS_ENTITY, payload: { id: 'id1' } }
        ];

        await store.dispatch(actions.onDeleteAliasEntity('id1'));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('handlePublishEvent()', () => {
        const expected = [{ type: 'UPDATE_ALIAS', payload:{id:'id1',updated:{ name:'newAlias' }}}];

        store.dispatch(actions.handlePublishEvent({field:'name',value:'newAlias', entity:{getId:()=>'id1'} }));

        expect(store.getActions()).toEqual(expected);;
    });


    function setupSpies() {
        spyOn(smartHome, 'getEntities').and.returnValue(Promise.resolve(getMockEntities()));
        spyOn(smartHome, 'createEntityRequest').and.stub();
        spyOn(smartHome, 'deleteEntityRequest').and.stub();
        spyOn(mapperService, 'mapAliasEntityToAlias').and.callFake(item=>item);
        spyOn(interfaceActions, 'callValErrNotification').and.stub();

    }

    function getMockEntities() {
        return [
            {
                getId:()=>{},
                onAttributePublish : () => {},
                serialize          : () => ALIASES[0]
            },
            {
                onAttributePublish: () => {},
                serialize          : () => ALIASES[1]
            },
            {
                onAttributePublish: () => {},
                serialize          : () => ALIASES[2]
            }
        ];
    }
});
