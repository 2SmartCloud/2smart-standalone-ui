import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../../__mocks__/storeMock';
import * as sort from '../../../../utils/sort';
import PropertiesList from './PropertiesList';

jest.mock('../../../../utils/sort', () => ({
    sortDisplayedProperties : jest.fn(x => x)
}));

describe('PropertiesList component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore();
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<PropertiesList {...mockProps} store={mockStore} />).dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should sort properties', () => {
        expect(sort.sortDisplayedProperties).toHaveBeenCalled();
    });

    describe('show displayed button', () => {
        it('should not show if propertyType is not sensors', () => {
            spyOn(instance, 'renderPropertyRow');

            wrapper.setProps({ propertyType: 'options' });

            expect(instance.renderPropertyRow).toHaveBeenNthCalledWith(1, { id: 'test1' }, false);
            expect(instance.renderPropertyRow).toHaveBeenNthCalledWith(2, { id: 'test2' }, false);
            expect(instance.renderPropertyRow).toHaveBeenNthCalledWith(3, { id: 'test3' }, false);
        });

        /* it('should not show if propertyType is sensors and properties length is equal 1', () => {
            spyOn(instance, 'renderPropertyRow');

            wrapper.setProps({ properties: [ { id: 'test1' } ] });

            expect(instance.renderPropertyRow).toHaveBeenNthCalledWith(1, { id: 'test1' }, false);
        }); */

        it('should show if propertyType is sensors and properties length is greater than 1', () => {
            spyOn(instance, 'renderPropertyRow');

            instance.render();

            expect(instance.renderPropertyRow).toHaveBeenNthCalledWith(1, { id: 'test1' }, true);
            expect(instance.renderPropertyRow).toHaveBeenNthCalledWith(2, { id: 'test2' }, true);
            expect(instance.renderPropertyRow).toHaveBeenNthCalledWith(3, { id: 'test3' }, true);
        });
    });

    function getMockProps() {
        return {
            properties   : [ { id: 'test1' }, { id: 'test2' }, { id: 'test3' } ],
            hardwareType : 'device',
            propertyType : 'sensors',
            deviceId     : 'device1',
            showGroups   : true,
            sortOrder    : 'ASC'
        };
    }

    function getMockBoundActions() {
        return {
        };
    }
});
