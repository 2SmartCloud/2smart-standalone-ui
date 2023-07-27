import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../__mocks__/storeMock';
import Node from './Node';


describe('Node component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore();
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<Node {...mockProps}  store={mockStore} />).dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('if node isn\'t hidden, hidden attribute icon should be without hidden className', () => {
        wrapper.setProps({ hidden: 'false' });
        const buttonsWithHiddenCN    = wrapper.find('.toggleHiddenAttrIcon.hidden');
        const buttonsWithoutHiddenCN = wrapper.find('.toggleHiddenAttrIcon');

        expect(buttonsWithHiddenCN.length).toBe(0);
        expect(buttonsWithoutHiddenCN.length).toBe(1);
    });

    it('if node is hidden, hidden attribute icon should be with hidden className', () => {
        wrapper.setProps({ hidden: 'true' });
        const toggleHiddenNodesButtons = wrapper.find('.toggleHiddenAttrIcon.hidden');

        expect(toggleHiddenNodesButtons.length).toBe(1);
    });

    it('handleToggleHidden() should call setAttribute dispatcher', () => {
        wrapper.setProps({ hidden: 'false' });

        instance.handleToggleHidden();

        expect(instance.props.setAsyncAttributeDispatcher).toHaveBeenCalled();
    });

    describe('getDisplayedSensors()', () => {
        it('should return filtered sensor list', () => {
            const given = [
                { id: 'sensor1',  'name': 'Abc1', displayed: 'false' },
                { id: 'sensor2',  'name': 'Abc2', displayed: 'true' },
                { id: 'sensor3',  'name': 'Abc3', displayed: 'true' },
                { id: 'sensor4',  'name': 'Abc4', displayed: 'false' },
                { id: 'sensor5',  'name': 'Abc5', displayed: 'true' }
            ];
            const expected = [
                { id: 'sensor2', name: 'Abc2', displayed: 'true' },
                { id: 'sensor3', name: 'Abc3', displayed: 'true' },
                { id: 'sensor5', name: 'Abc5', displayed: 'true' }
            ];

            wrapper.setProps({ sensors: given, sortOrder: 'ASC' });

            const result = instance.getDisplayedSensors();

            expect(result).toEqual(expected);
        });

        it('should return displayed sensors sorted by sortOrder from props', () => {
            const sensors = [
                { id: 'sensor1', 'name': 'Abc',  displayed: 'true' },
                { id: 'sensor2', 'name': 'Abc2', displayed: 'true' }
            ];

            wrapper.setProps({
                sortOrder : 'ASC',
                sensors
            });
            const expectedASC = [ sensors[1], sensors[0] ];

            expect(instance.getDisplayedSensors()).toEqual(expectedASC);
            wrapper.setProps({
                sortOrder : 'DESC'
            });
            const expectedDESC = [ sensors[0], sensors[1] ];

            expect(instance.getDisplayedSensors()).toEqual(expectedDESC);
        });
        /*
        it('should return first sensor sorted by sortOrder from props if displayed.length === 0', () => {
            const sensors = [
                { id: 'sensor1', 'name' : 'Abc',  displayed: 'false' },
                { id: 'sensor2', 'name' : 'Abc2', displayed: 'false' },
            ];
            wrapper.setProps({
                sortOrder: 'ASC',
                sensors
            });
            const expectedASC = [ sensors[1] ];

            expect(instance.getDisplayedSensors()).toEqual(expectedASC);
            wrapper.setProps({
                sortOrder: 'DESC'
            });
            const expectedDESC = [ sensors[0] ];

            expect(instance.getDisplayedSensors()).toEqual(expectedDESC);
        }); */
    });


    function getMockBoundActions() {
        return {
            setAsyncAttributeDispatcher : jest.fn()
        };
    }

    function getMockProps() {
        return {
            'isDisable' : false,
            'deviceId'  : 'fat',
            'id'        : 'int-no-unit',
            'name'      : 'Integer node',
            'title'     : '',
            'sensors'   : [
                {
                    'id'        : 'int-no-unit',
                    'name'      : 'Value',
                    'value'     : '20',
                    'settable'  : 'true',
                    'retained'  : 'true',
                    'dataType'  : 'integer',
                    'unit'      : '#',
                    'format'    : '',
                    'rootTopic' : 'sweet-home/fat/int-no-unit/int-no-unit',
                    'groups'    : []
                }
            ],
            'options'   : [],
            'telemetry' : [],
            'state'     : 'init',
            'hidden'    : 'false'
        };
    }
});
