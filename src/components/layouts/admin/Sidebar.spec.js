import React from 'react';
import { shallow } from 'enzyme';
import Sidebar from './Sidebar';
import * as detect from '../../../utils/detect';

jest.mock('../../../utils/detect');

describe('Sidebar admin component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();
        const mockContext = getMockContext();

        wrapper = shallow(<Sidebar {...mockProps} />);

        instance = wrapper.instance();
        instance.context = mockContext;
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    describe('handleLinkClick() should call onToggle if isMobileDevice condition is true', () => {
        it('desktop', () => {
            detect.isMobileDevice = jest.fn().mockReturnValue(false);

            instance.handleLinkClick();

            expect(instance.props.onToggle).not.toHaveBeenCalled();
        });

        it('mobile', () => {
            detect.isMobileDevice = jest.fn().mockReturnValue(true);

            instance.handleLinkClick();

            expect(instance.props.onToggle).toHaveBeenCalled();
        });
    });

    describe('handleChangeTheme() should call onToogleTheme', () => {
        it('toggle is enabled', () => {
            const event = { target: { checked: true } };

            instance.handleChangeTheme(event);

            expect(instance.context.onToogleTheme).toHaveBeenCalledWith('DARK');
        })
    });

    function getMockProps() {
        return {
            currentPathname : 'foo/bar',
            onToggle        : jest.fn()
        };
    }

    function getMockContext() {
        return {
            onToogleTheme : jest.fn()
        };
    }
});
