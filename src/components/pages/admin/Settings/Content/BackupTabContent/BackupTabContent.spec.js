import React from 'react';
import { shallow } from 'enzyme';
import BackupTabContent from './BackupTabContent';
import BackupSelect from '../../../../../base/select/BackupSelect';

describe('BackupTabContent component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<BackupTabContent {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });


    it('should render BackupSelect component', () => {
        wrapper.setProps({
            backup : {
                ...instance.props.backup,
                list        : [ { test: 'test' } ],
                isFetching  : false,
                isUpdating  : false
            }
        });
        const block = shallow(instance.renderFirstTab())
        
        const list = block.find(BackupSelect);

        expect(list).toHaveLength(1);
    });

    it('handleModalOpen() should set open modal state', () => {
        instance.handleModalOpen({ title: 'Modal title', text: 'modal text', labels: { submit: 'Submit' } });

        const expected = {
            isOpen       : true,
            title        : 'Modal title',
            text         : 'modal text',
            labels       : { submit: 'Submit' }
        };

        expect(wrapper.state().modal).toEqual(expected);
    });

    it('handleModalClose() should set closed state', () => {
        wrapper.setState({ modal: { isOpen: true } });

        instance.handleModalClose();

        expect(wrapper.state().modal.isOpen).toBeFalsy();
    });

    it('handleRestoreBackup() should set context and call open modal handler', () => {
        spyOn(instance, 'handleModalOpen');
        spyOn(instance, 'restoreBackup');

        const backup = { name: 'dump_11.tar.gz' };
        instance.handleSelectBackup(backup)
        const expected = {
            title  : 'Restore dump_11.tar.gz',
            text   : 'If you have new data it will be lost!',
            labels : { submit: 'Yes, restore data', cancel: 'Cancel' }
        };

        instance.handleRestoreBackup( { preventDefault: () => null });

        expect(instance.restoreBackup).toHaveBeenCalledWith('dump_11.tar.gz');
        expect(instance.handleModalOpen).toHaveBeenCalledWith(expected);
    });

    it('handleCreateBackup() should call action for backup create',async () => {
        await instance.handleChangeName('backupName');
        await instance.handleCreateBackup({ preventDefault: () => {} });
       
        expect(instance.props.createBackup).toHaveBeenCalledWith('backupName');
        expect (instance.state.newBackupName).toEqual('');
    });


    it('handleCreateBackup() - failed ',async () => {

        wrapper.setState({
            newBackupName: 'backupName'
        })
    
        wrapper.setProps({
            createBackup : jest.fn().mockReturnValue(Promise.reject({ code: 'FORMAT_ERROR',fields:{'data/backupBaseName':"WRONG_FORMAT"} }))
        });
        
        await instance.handleCreateBackup({ preventDefault: () => {} });


        expect(instance.props.createBackup).toHaveBeenCalledWith('backupName');
        expect (instance.state.newBackupNameError).toEqual('The name of the backup must be characters (A-z), digits (0-9)');
    });


    it('restoreBackup() should return func that calls restoreBackup prop and closes modal', () => {
        spyOn(instance, 'handleModalClose');

        instance.restoreBackup('dump_10.tar.gz')();

        expect(instance.handleModalClose).toHaveBeenCalled();
        expect(instance.props.restoreBackup).toHaveBeenCalledWith('dump_10.tar.gz');
    });

    function getMockProps() {
        return {
            backup : {
                list        : [],
                isFetching  : false,
                isUpdating  : false,
                restoring   : undefined,
                isRestored  : false
            },
            restoreBackup  : jest.fn(),
            createBackup: jest.fn()
        };
    }
});
