import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../../../__mocks__/storeMock';
import BackupContainer from './BackupContainer';

describe('BackupContainer component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<BackupContainer location={{}} store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should fetch data', () => {
        spyOn(instance, 'fetchData');

        instance.componentDidMount();

        expect(instance.fetchData).toHaveBeenCalled();
    });

    it('fetchData() should load data', () => {
        instance.fetchData();

        expect(instance.props.getBackupList).toHaveBeenCalled();
    });

    function getMockAppState() {
        return {
            backup : {
                list : []
            }
        };
    }

    function getMockBoundActions() {
        return {
            getBackupList        : jest.fn(),
            restoreBackup        : jest.fn(),
        };
    }
});
