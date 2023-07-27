import React from 'react';
import { shallow } from 'enzyme';
import Alias from './Alias';
jest.mock('../../../actions/alias');


describe('Alias', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps=getMockProps();
        wrapper = shallow(<Alias  {...mockProps} />);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should set state depend on props', () => {
    
        expect(wrapper.state().isCopyVissible).toBeFalsy();
        expect(wrapper.state().isRenderStringControl).toBeFalsy();

        wrapper.setProps({name:'name1', isNew:false})

        expect(wrapper.state().isCopyVissible).toBeTruthy();
        expect(wrapper.state().isRenderStringControl).toBeTruthy();
    });

    it('handleCopyName - should set state for copy row visibility', () => {
    
        instance.handleCopyName()

        expect(wrapper.state().isCopyOpened).toBeTruthy();
    });

    it('handleCloseCopy - should set state for copy row visibility', () => {
    
        instance.handleCloseCopy()

        expect(wrapper.state().isCopyOpened).toBeFalsy();
    });


    it('handleCreateButtonClick - should set state for string control render', () => {
    
        instance.handleCreateButtonClick()

        expect(wrapper.state().isRenderStringControl).toBeTruthy();
    });
  
  

    it('handleDeactiveteControl - should set state isNew', () => {
        wrapper.setProps({isNew: true})
        
        instance.handleDeactiveteControl()

        expect(wrapper.state().isRenderStringControl).toBeFalsy();
        expect(wrapper.state().isError).toBeFalsy();

    });


    it('handleDeactiveteControl - should set state !isNew', () => {
        wrapper.setProps({isNew: false})
        
        instance.handleDeactiveteControl()

        expect(wrapper.state().isCopyVissible).toBeTruthy();
        expect(wrapper.state().isError).toBeFalsy();

    });

    it('handleHideCopyButton - should set state for copyIcon visibility', () => {
    
        instance.handleHideCopyButton()

        expect(wrapper.state().isCopyVissible).toBeFalsy();
    });

    it('setAliasName - should create alias', async() => {
        await instance.setAliasName({ value : 'name' });

        expect(instance.state.isProcessing).toBeFalsy();
        expect(instance.props.createAlias).toHaveBeenCalled();
    });


    it('setAliasName - should edit alias', async () => {
        wrapper.setProps({isNew: false})
        await instance.setAliasName({ value : 'name' })

        expect(instance.state.isProcessing).toBeFalsy();
        expect(instance.props.onChangeAlias).toHaveBeenCalled();
    });
    
  

    it('setAliasName - should delete alias if value is empty',async () => {
        const {id} = instance.props;
        wrapper.setProps({isNew: false});
        await instance.setAliasName({ value : '' });
        
        expect(instance.state.isProcessing).toBeFalsy();
        expect(instance.props.onDeleteAlias).toHaveBeenCalledWith({entityId:id });
    });
    

    function getMockProps() {
        return {
            name          : '',
            isNew         : true,
            topic         : "sweet-home/fat/$telemetry/supply",
            id            : 'id1',
            onAliasError  : jest.fn(),
            onChangeAlias : jest.fn(),
            onDeleteAlias : jest.fn(),
            createAlias   : jest.fn(),
        };
    }
});
