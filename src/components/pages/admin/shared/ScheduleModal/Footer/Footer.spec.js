import React from 'react';
import { shallow } from 'enzyme';

import Footer from './Footer';
import Button from '../../../../../base/Button';

describe('Footer', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps;

        wrapper = shallow(<Footer {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();

        const footerElement = wrapper.find(Button);

        expect(footerElement.length).toBe(2);
    });

    function getMockProps() {
        return {
            onSubmit : jest.fn(),
            onDeny   : jest.fn(),
            setRef   : jest.fn()
        }
    }
});
