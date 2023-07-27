import React from 'react';
import { shallow } from 'enzyme';   
import AutoDiscoveryItem from './AutoDiscoveryItem';
import ProcessingIndicator from '../../ProcessingIndicator'
import Button from '../../../base/Button';

import Icon  from '../../Icon';


describe('AutoDiscoveryItem', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockBoundActions = getMockProps();

        wrapper = shallow(<AutoDiscoveryItem {...mockBoundActions} />);
        
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });


    it('shoold render appropriate status icon - status isNew', () => {
        expect((wrapper).find ({ text:'Add'}).find(Button)).toHaveLength(1);
    });


    it('shoold render appropriate status icon status isPending', () => {
        wrapper.setProps({
            device: {
                name: 'device 1',
                status: 'isPending'
            },
        })
        expect((wrapper).find({type:'pending-clock'})).toHaveLength(1)
        
    });

    it('shoold render appropriate status icon status isFetching', () => {
        wrapper.setProps({
            device: {
                name: 'device 1',
                status: 'isFetching'
            },
        });
        wrapper.update();
        expect((wrapper).find ({ isFetching:true}).find(Button)).toHaveLength(1)
        
    });

    function getMockProps() {
        return {
            device: {
                name: 'device 1',
                status: 'isNew'
            },
            onDeleteIconClick: jest.fn(),
            onAcceptClick: jest.fn(),
        };
    }
});
