import React                            from 'react';
import { shallow }                      from 'enzyme';
import SetpointValue, { EMPTY_LABEL }   from './SetpointValue';
import { mappedMultiScenarioSetpoints } from '../../../../../__mocks__/tresholdsMock';
import ProcessingIndicator              from '../../../../base/ProcessingIndicator';


describe('ScenariosListRow component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<SetpointValue {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('renderSetpoints should render setpoints ',  () => {
        const setpoints = wrapper.find('.setpointValue');

        expect(setpoints).toHaveLength(1);
    });
    
    it(' should render spinner ',  () => {
        wrapper.setProps({
            isLoading : true
        })

        expect(wrapper.find(ProcessingIndicator)).toHaveLength(1);
    });

    describe('getFullLabel()', () => {
        it('getLabel should return label for all setpoints  ',  () => {
            const label = instance.getLabel();
            const moreLabel= instance.getMoreLabel();
            expect(label).toEqual('value');
            expect(moreLabel).toEqual(', ...');
        });

        it('getLabel should return label for one setpoints  ',  () => {
            wrapper.setProps({ setpoints :[{value:''}] });
            const label = instance.getLabel();
            const moreLabel= instance.getMoreLabel();

            expect(label).toEqual(EMPTY_LABEL);
            expect(moreLabel).toBe(null);
        });
    })

    function getMockProps() {
        return {
            setpoints : mappedMultiScenarioSetpoints,
            isLoading : false,
            onClick   : jest.fn()
        };
    }
});
