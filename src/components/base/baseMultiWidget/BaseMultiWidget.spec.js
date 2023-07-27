import React from 'react';
import { shallow } from 'enzyme'
import getMockStore from '../../../__mocks__/storeMock';
import {TOPICS_LIST, PROPERTIES_LIST} from '../../../__mocks__/topicsList';
import {DEVICES_MOCK} from '../../../__mocks__/deviceMock';

import BaseMultiWidget from './BaseMultiWidget';
import NoDataMessage from '../../widgets/etc/NoDataMessage';

jest.mock('../../../utils/theme/widget/getColors');
jest.mock('../../../utils/theme');

describe('BaseMultiWidget component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();

        wrapper = shallow(<BaseMultiWidget {...mockProps} store={mockStore} />).shallow().dive();

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    }); 
    
    it('handleMenuSelect() should should select menu item', () => {
        instance.handleMenuSelect('edit');
        expect(instance.props.onMenuSelect).toBeCalled();
    });

    function getMockProps() {
        return {
            widget           : props => <div {...props} />,
            name             : '',
            bgColor          : '#FFF',
            topics           : TOPICS_LIST,
            properties       : PROPERTIES_LIST,
            isEditMode       : false,
            screenId         : '1',
            widgetId         : '2',
            onMenuSelect     : jest.fn()
        };
    }

    function getMockAppState() {
        return {
            homie : {
                devices    : DEVICES_MOCK
            }
        }
    }

});
