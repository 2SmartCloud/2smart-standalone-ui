import React                    from 'react';
import { shallow }              from 'enzyme';
import TopicConfiguration       from './TopicConfiguration';
import EntityControl            from '../../../../base/controls/Entity';
import EntitiesControl          from '../../../../base/controls/Entities';

describe('TopicConfiguration component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<TopicConfiguration {...mockProps} />);
        instance = wrapper.instance();
        instance.onInteract = jest.fn();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    describe('should render entity field', () => {
        it('render EntitiesControl if props.multiple == true', () => {
            wrapper.setProps({ multiple: true, value: [] });

            expect(wrapper.find(EntitiesControl).length).toBe(1);
        });

        it('render EntityControl if props.multiple == false', () => {
            wrapper.setProps({ multiple: false });

            expect(wrapper.find(EntityControl).length).toBe(1);
        });
    });

    function getMockProps() {
        return {
            label         : 'label',
            options       : [],
            onChange      : jest.fn,
            onValueDelete : jest.fn,
            onValueSelect : jest.fn,
            placeholder   : 'placeholder',
            errorText     : '',
            value         : void 0,
            multiple      : false,
        };
    }
});
