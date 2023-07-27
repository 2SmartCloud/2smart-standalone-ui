import React from 'react';
import { shallow } from 'enzyme';
import LoadingNotification from '../../../../base/LoadingNotification';
import { EXTENSIONS_ENTITIES_MOCK_LIST } from '../../../../../__mocks__/extensionServiceMock';
import ExtensionsTab from './ExtensionsTab';

describe('ExtensionsTab component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ExtensionsTab {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render loader', () => {
        wrapper.setProps({ marketServices: { isFetching: true } });

        const loader = wrapper.find(LoadingNotification);

        expect(loader).toBeTruthy();
    });

    it('handleModalOpen() should set open state for modal', () => {
        instance.handleModalOpen({ title: 'Modal title', text: 'modal text', labels: { submit: 'Submit' } });

        const expected = {
            isOpen : true,
            title  : 'Modal title',
            text   : 'modal text',
            labels : { submit: 'Submit' }
        };

        expect(wrapper.state().modal).toEqual(expected);
    });

    it('handleModalClose() should set closed state', () => {
        wrapper.setState({ modal: { isOpen: true } });
        expect(wrapper.state().modal.isOpen).toBeTruthy();

        instance.handleModalClose();

        expect(wrapper.state().modal.isOpen).toBeFalsy();
    });


    it('handleUpdateService() should set context and call open modal handler', () => {
        spyOn(instance, 'handleModalOpen');
        spyOn(instance, 'runModalAction').and.callFake(action => action());

        const extension = { name: 'Test module', entityId: 'b31fbd8f7f2d835d613c5be963301f0e' };
        const expected = {
            title  : 'Update Test module',
            text   : 'All instances of this extension will be restarted!',
            labels : { submit: 'Yes, update extension', cancel: 'Cancel' }
        };

        instance.handleUpdateService(extension);

        expect(instance.handleModalOpen).toHaveBeenCalledWith(expected);

        instance.modalSubmitHandler();

        expect(instance.props.updateExtension).toHaveBeenCalledWith('b31fbd8f7f2d835d613c5be963301f0e');
    });

    it('handleDeleteService() should set context and call open modal handler', () => {
        spyOn(instance, 'handleModalOpen');
        spyOn(instance, 'runModalAction').and.callFake(action => action());

        const extension = {  name: 'Test module', title: 'Test module', entityId: 'b31fbd8f7f2d835d613c5be963301f0e' };
        const expected = {
            title  : 'Delete Test module',
            text   : 'Are you sure you want to delete this extension?',
            labels : { submit: 'Yes, delete extension', cancel: 'Cancel' }
        };

        instance.handleDeleteService(extension);

        expect(instance.handleModalOpen).toHaveBeenCalledWith(expected);

        instance.modalSubmitHandler();

        expect(instance.props.deleteExtension).toHaveBeenCalledWith('b31fbd8f7f2d835d613c5be963301f0e', 'Test module');
    });


    it('fulfillServicesInfo() should add additional fields to services list', () => {
        const extensions = [
            { name: '@2smart/test-module', title: 'Test module', icon: 'static/icon.svg' },
            { name: '@2smart/another-module', title: 'Another module' }
        ];
        const expected = [
            {
                name  : '@2smart/test-module',
                icon  : (<Image src='static/icon.svg' renderFallback={() => 'K'} />),
                title : 'Test module'
            },
            {
                name  : '@2smart/another-module',
                icon  : 'AN',
                title : 'Another module'
            }
        ];

        const result = instance.fulfillServicesInfo(extensions);

        expect(result[0].name).toEqual(expected[0].name);
        expect(result[0].label).toEqual(expected[0].label);
        expect(result[0].icon).toBeDefined();

        expect(result[1]).toEqual(expected[1]);
    });

    it('runModalAction() should call given action and close modal', () => {
        spyOn(instance, 'handleModalClose').and.stub();
        const action = jest.fn();

        instance.runModalAction(action);

        expect(action).toHaveBeenCalled();
        expect(instance.handleModalClose).toHaveBeenCalled();
    });


    function getMockProps() {
        return {
            extensions : {
                installedEntities : {
                    list       : EXTENSIONS_ENTITIES_MOCK_LIST,
                    isFetching : true
                },
                list        : [],
                isFetching  : false,
                isUpdating  : false,
                searchQuery : '',
                sortOrder   : 'ASC',
                currentPage : 1
            },
            setExtensionsCurrentPage : jest.fn(),
            installExtension         : jest.fn(),
            checkExtensionUpdate     : jest.fn(),
            updateExtension          : jest.fn(),
            deleteExtension          : jest.fn(),
            getExtensions            : jest.fn(),
            location                 : { pathname: 'market#extensions' }
        };
    }
});
