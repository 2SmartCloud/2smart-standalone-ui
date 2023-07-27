import smartHome from '../../smartHome/smartHomeSingleton';
import AttributeDispatcher from './dispatcher';

jest.mock('../../smartHome/smartHomeSingleton', () => {
    return {
        getDeviceById : jest.fn().mockReturnValue({
            getNodeById : jest.fn().mockReturnValue({
                getOptionById : jest.fn().mockReturnValue({
                    setAttribute : jest.fn().mockReturnValue(Promise.resolve())
                })
            })
        }),
        getEntityById : jest.fn().mockReturnValue({
            setAttribute : jest.fn().mockReturnValue(Promise.resolve())
        })
    };
});
jest.mock('../../actions/interface');
jest.mock('../../store');

describe('AttributeDispatcher', () => {
    let dispatcher;

    beforeEach(() => {
        dispatcher = new AttributeDispatcher();
    });

    it('should be created', () => {
        expect(dispatcher).toBeTruthy();
    });


    it('setAsyncAttribute() should return call to the chosen sdk method', () => {
        const mockData = getMockData()[1];

        dispatcher.setAsyncAttribute(mockData);

        expect(smartHome.getEntityById().setAttribute).toHaveBeenCalledWith('configuration', { test: 'test' });
    });


    it('setAsyncAttribute() should get type, if type not set and return call to the chosen sdk method', () => {
        const mockData = getMockData()[2];

        dispatcher.setAsyncAttribute(mockData);

        expect(smartHome.getDeviceById().getNodeById().getOptionById().setAttribute).toHaveBeenCalledWith('value', '40');
    });


    it('setAsyncAttribute() should get type by hardware, if type not set, and return call to the chosen sdk method', () => {
        const mockData = getMockData()[3];

        dispatcher.setAsyncAttribute(mockData);

        expect(smartHome.getDeviceById().getNodeById().getOptionById().setAttribute).toHaveBeenCalledWith('value', '40');
    });

    function getMockData() {
        return [
            {
                type       : 'NODE_OPTION',
                deviceId   : 1,
                nodeId     : 2,
                propertyId : 3,
                value      : '40'
            },
            {
                type     : 'BRIDGE',
                entityId : 'test-1',
                field    : 'configuration',
                value    : { test: 'test' }
            },
            {
                type       : 'NODE_OPTION',
                filed      : 'value',
                deviceId   : 1,
                nodeId     : 2,
                propertyId : 3,
                value      : '40'
            },
            {
                hardwareType : 'node',
                propertyType : 'options',
                filed        : 'value',
                deviceId     : 1,
                nodeId       : 2,
                propertyId   : 3,
                value        : '40'
            }
        ];
    }
});
