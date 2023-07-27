import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from './index.js';
import smartHome from '../../smartHome/smartHomeSingleton';
import * as mapper from '../../utils/mapper/extensions/index';
import { dumpExtension } from '../../utils/dump/extensions';
import * as interfaceActions from '../interface';

import { attributeDispatcher } from '../../utils/homie/dispatcherSingleton';
import * as homieActions from '../homie';

jest.mock('../../smartHome/smartHomeSingleton');
jest.mock('../../utils/mapper/service', () => {
    return {
        mapExtension : jest.fn().mockImplementation(item => item),
        mapExtensionEntityUpdate : jest.fn().mockImplementation(item => item),
        mapExtensionEntity: jest.fn().mockImplementation(item => item)
    };
});

jest.mock('../../components/base/toast/callToast', () => ({
    callToast  : jest.fn(() => 'toastId')
}));

jest.mock('../homie');
jest.mock('../../utils/homie/dispatcherSingleton');

const mockStore = configureMockStore([ thunk ]);

describe('extensions actions', () => {
    let store;

    beforeEach(() => {
        setupSpies();

        store = mockStore({
            installedEntities : {
                list       : [{

                    title: 'test1',
                    name: 'test1',
                    fields: [],
                    id: 'id1',
                    state: 'installed',
                },{

                    title: 'test2',
                    name: 'test2',
                    fields: [],
                    id: 'id2',
                    state: 'installed',
                } ],
                isFetching : true
            },
    
            list       : [
                {
                    name: 'test3',
                    id: 'id3',
                    state: 'uninstalled',
                }
            ],
            isFetching : true,
            isUpdating : false,
        });
    });



    it('getInstalledExtensions() success', async () => {
         const expectedServices = [
            { id: '1', name: 'test', title: 'test' },
            { id: '2', name: 'test2',title: 'test2' }
        ];
        const expectedActions = [
            { type: actions.GET_EXTENSION_ENTITIES, payload: { extensions: expectedServices } }
        ];

        await store.dispatch(actions.getInstalledExtensions());

        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('createExtensionEntity()', () => {
        it('success', async () => {
            const payload = {
                name: '2smart-test-module',
                version: '0.4.0',
                description: '2smart test package',
                link: 'https://www.npmjs.com/package/2smart-test-module',
                language: 'JS'
            };
    
    
            await store.dispatch(actions.createExtensionEntity(payload));
    

            expect(smartHome.createEntityRequest).toHaveBeenCalledWith('EXTENSION', payload, payload.name);
        });
    })

    describe('checkExtensionUpdate()', () => {
        it('success', async () => {
            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.resolve());

            const expected = { type: 'EXTENSION', entityId: 'id1', field: 'event', value: 'check' };

            await store.dispatch(actions.checkExtensionUpdate('id1'));

            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);

        });

        it('failed', async () => {
            const error = { code: 'INSTALL_ERROR' };

            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject(error));

            const expected = { type: 'EXTENSION', entityId: 'id1', field: 'event', value: 'check' };
         

            const expectedActions = [ {
                    type    : 'CHANGE_EXTENSION_PROCCESSING',
                    payload : {
                        entityId:'id1',
                        processingLabel:'checking',
                        name:undefined,
                        isProcessing    : true
                    }
                },
                {
                    type    : 'CHANGE_EXTENSION_PROCCESSING',
                    payload : {
                        entityId:'id1',
                        name:undefined,
                        processingLabel : '',
                        isProcessing : false
                    }
                },
                {type:'STUB_ERROR_NOTIFICATION'}
            ];
            try {
                await store.dispatch(actions.checkExtensionUpdate('id1'));
            } catch {}

            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
            expect(store.getActions()).toEqual(expectedActions);
            
        });
    });


    it('onNewExtensionAdded()', async () => {
        const expectedActions = [
            { type : actions.ADD_EXTENSION_ENTITY, payload: { extension: { id: '1', name: 'test',title: 'test'  } } }
        ];

        await store.dispatch(actions.onNewExtensionAdded(getMockEntities()[0]));

        expect(store.getActions()).toEqual(expectedActions);
    });

    function setupSpies() {
        actions.onErrorPublish = jest.fn().mockReturnValue({ type: 'STUB_ERROR' });
        interfaceActions.callValErrNotification = jest.fn().mockReturnValue({ type: 'STUB_ERROR_NOTIFICATION' });

        spyOn(smartHome, 'getEntities').and.returnValue(Promise.resolve(getMockEntities()));     
        spyOn(mapper, 'mapExtensionEntity').and.callFake(item=>item);
    }

    function getMockEntities() {
        return [
            {
                onAttributePublish : () => {},
                onErrorPublish     : () => {},
                getId              : () => {},
                serialize          : () => ({ id: '1', name: 'test',title: 'test'  })
            },
            {
                onAttributePublish : () => {},
                onErrorPublish     : () => {},
                getId              : () => {},
                serialize          : () => ({ id: '2', name: 'test2',title: 'test2'  })
            }
        ];
    }
});


