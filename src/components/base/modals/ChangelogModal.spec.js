import React               from 'react';
import { shallow }         from 'enzyme';
import ReactMarkdown       from 'react-markdown/with-html';
import ChangelogModal      from './ChangelogModal';
import LoadingNotification from '../../base/LoadingNotification';
import Modal               from '../../base/Modal';

describe('ChangelogModal component', () => {
    let wrapper;
    let instance;

    global.fetch = jest.fn().mockReturnValue({
        text : jest.fn().mockReturnValue('#Text')
    });

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ChangelogModal {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
        expect(wrapper.find(Modal).length).toBe(1);
    });

    it('should render ReactMarkdown if state.data exist', () => {
        wrapper.setState({ data : '#Some md title' });
        expect(wrapper.find(ReactMarkdown).length).toBe(1);
    });

    it('should render loader if sttae.isLoading', () => {
        wrapper.setState({ isLoading : true });
        expect(wrapper.find(LoadingNotification).length).toBe(1);
    });

    function getMockProps() {
        return {
            onClose: jest.fn()
        };
    }
});
