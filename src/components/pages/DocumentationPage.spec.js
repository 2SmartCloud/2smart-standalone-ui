import React from 'react';
import { shallow } from 'enzyme';
import hljs from 'highlight.js/lib/highlight';
import DocumentationPage from './DocumentationPage';

jest.mock('highlight.js/lib/highlight');

describe('DocumentationPage component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        wrapper = shallow(<DocumentationPage />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should init highlight lib on mount', () => {
        expect(hljs.registerLanguage).toHaveBeenCalled();
        expect(hljs.initHighlightingOnLoad).toHaveBeenCalled();
    });
});
