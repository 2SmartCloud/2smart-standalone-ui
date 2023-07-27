import React from 'react';
import { shallow } from 'enzyme';
import List from './List';
import Option from './Option';

describe('List component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<List {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should render Option component for each option provided', () => {
        const options = wrapper.find(Option);

        expect(options).toHaveLength(3);
    });

    it('should render Option component for each option provided', () => {
        const options = wrapper.find(Option);

        expect(options).toHaveLength(3);
    });

    it('should filter options by label', () => {
      const options = instance.getOptions();

      expect(options).toHaveLength(3);
    });


    it('should filter options by value', () => {
        wrapper.setProps({isSearchByValue:true});
        const options = instance.getOptions();
        
        expect(options).toHaveLength(4);
      });
  
    function getMockProps() {
        return {
            options     : [
                { value: 'value-1', label: 'test-1' },
                { value: 'value-2', label: 'test-2' },
                { value: 'value-3', label: 'test-3' },
                { value: 'test-3', label: 'value-3' }
            ],
            searchQuery : 'test'
        };
    }
});

