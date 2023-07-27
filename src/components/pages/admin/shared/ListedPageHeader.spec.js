import React from 'react';
import { shallow } from 'enzyme';
import ListedPageHeader from './ListedPageHeader';

describe('ListedPageHeader component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ListedPageHeader {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });


    it('should renderSearch', () => {
        wrapper.setProps({
            isSearchRender:true
        })

        expect(wrapper.find('.searchWrapper')).toHaveLength(1);
        expect(wrapper.find('.sortButtonWrapper')).toHaveLength(1);

    });

   

    function getMockProps() {
        return {
            searchQuery    : '',
            sortOrder      : 'ASC',
            setSearchQuery : jest.fn(),
            setSortOrder   : jest.fn(),
            isSearchRender : false,
            isListFetching : false,
            placeholder    : 'placeholder'
        };
    }
});
