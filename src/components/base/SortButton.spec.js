import React        from 'react';
import { shallow }  from 'enzyme';
import SortButton   from './SortButton';
import { saveData } from  '../../utils/localStorage';

jest.mock('../../utils/localStorage');

describe('SortButton', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<SortButton {...mockProps} />);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should save to localStorage data if localStorageKey exist', () => {
        instance.handleChangeOrder();
        wrapper.setProps({
            searchOrder: 'ASC'
        });
        const localStorageKey = instance.props.localStorageKey;

        expect(saveData).toHaveBeenCalledWith(localStorageKey, 'DESC');
    });

    function getMockProps() {
        return {
            searchOrder     : 'ASC',
            onChange        : jest.fn,
            localStorageKey : 'some_key'
        }
    };
});
