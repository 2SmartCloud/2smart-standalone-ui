import React                     from 'react';
import { shallow }               from 'enzyme';
import EntityModal               from './EntityModal';
import Modal                     from '../Modal';
import Search                    from '../../base/inputs/Search';
import EntitiesEmptyList         from '../nothingToShowNotification/Entities';
import {
    DEVICES_MOCK
}                                from '../../../__mocks__/deviceMock';
import getMockStore              from '../../../__mocks__/storeMock';

jest.mock('../../../utils/homie/getEntities', () => ({
    getEntitiesTreeByTopics: jest.fn(() => ({
        selectedFirstId: {
            info    : { id: 'selectedFirstId', name: 'fat' },
            children :  {
                'selectedSecondId' : {
                    info       : { id    : 'selectedSecondId', name : 'selectedSecondId' },
                    value      : { topic : 'Unique' },
                    searchMeta : [ 'selectedSecondId', 'Unique' ],
                    children   : null
                },
                children : null
            },
            searchMeta: [ 'selectedFirstId', 'Unique' ]
        },
        fat: {
            info     : { id: 'fat', name: 'fat' },
            children : {
                'firstChild' : {
                    info  : { id    : 'firstChild', name : 'fat' },
                    value : { topic : 'topicName3' },
                    searchMeta : [ 'firstChild', 'topicName3' ]
                }
            },
            searchMeta: [ 'fat' ]
        },
        deep: {
            info     : { id: 'deep', name: 'deep' },
            children : {
                'firstLevel' : {
                    info  : { id    : 'firstLevel', name : 'firstLevel' },
                    searchMeta : [ 'firstLevel' ],
                    children   : {
                        'secondLevel' : {
                            info  : { id    : 'secondLevel', name : 'secondLevel' },
                            searchMeta : [ 'secondLevel' ],
                            children   : {
                                'thirdLevel' : {
                                    info  : { id    : 'thirdLevel', name : 'thirdLevel' },
                                    value : { topic : 'topicLevel3' },
                                    searchMeta : [ 'thirdLevel' ],
                                    children   : null
                                }
                            }
                        }
                    }
                }
            },
            searchMeta: [ 'deep' ]
        }
    })),
}));

jest.mock('../../../utils/sort', () => ({
    sortEntitiesByType: jest.fn((list) => list),
}));

describe('EntityModal component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();

        wrapper = shallow(<EntityModal  {...mockProps} store={mockStore}  />).dive().dive();

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();

        expect(wrapper.find(Modal)).toHaveLength(1);
    });

    describe('handleSelectOption()()', () => {
        it('should set valid options as selected', () => {
            const selectedUri = 'fat#firstChild';
            instance.handleSelectOption( 'firstChild', selectedUri )();
            expect(instance.state.selected).toEqual(expect.arrayContaining([selectedUri]));
        });

        it('should not set options with children as selected', () => {
            const selectedUri = 'fat';
            instance.handleSelectOption( selectedUri, selectedUri )();
            expect(instance.state.selected).toEqual(expect.arrayContaining([]));
        });

        it('should reset forward selected values if they\'re were selected', () => {
            wrapper.setState({
                selected: ['deep#firstLevel#secondLevel']
            });
            const expectedSelected = 'fat#firstChild';
            instance.handleSelectOption('firstChild', expectedSelected)();

            expect(instance.state.selected).toEqual(expect.arrayContaining([expectedSelected]));
        });

        it('should reset forward selected values if they\'re were selected', () => {
            wrapper.setState({
                selected: ['selectedFirstId#selectedSecondtId']
            });

            const expectedSelected = 'fat#firstChild';
            instance.handleSelectOption('firstChild', expectedSelected)();

            expect(instance.state.selected).toEqual(expect.arrayContaining([expectedSelected]));
        });

        it('should set isSearchPriority -> false', () => {
            instance.handleSelectOption('second', 'selectedID');

            expect(instance.state.isSearchPriority).toBeFalsy();
        });
    });

    it('should render empty icon if there is no entities', () => {
        wrapper.setProps({ data: {} });

        expect(wrapper.find(EntitiesEmptyList)).toHaveLength(1);
    });

    it('should render search field', () => {
        expect(wrapper.find(Search)).toHaveLength(1);
    });

    it('should render selectedOptions', () => {
        wrapper.setState({
            selected: ['selectedFirstId']
        });

        expect(wrapper.find("#selectedFirstId")).toHaveLength(1);
        // expect(wrapper.find("#secondSelectedOption")).toHaveLength(1);
    });

    it('syncSelectedWithSearch(), should sync state with new selected if state.selected changed', () => {
        jest.useFakeTimers();
        wrapper.setState({
            selected: []
        });
        const uriToSet = 'selectedFirstId#selectedSecondId';
        instance.syncSelectedWithSearch(uriToSet);

        jest.advanceTimersByTime(300);

        expect(instance.state.selected).toEqual(expect.arrayContaining([uriToSet]));
    });

    describe('handleChangeSearch()', () => {
        it('should change state search', () => {
            instance.handleChangeSearch('ssss');

            expect(instance.state.search).toBe('ssss');
        });

        it('should change state search with left trimmed value', () => {
            instance.handleChangeSearch('   ssss  ');

            expect(instance.state.search).toBe('ssss  ');
        });

        it('should set isSearchPriority -> true', () => {
            instance.handleChangeSearch('   ssss  ');

            expect(instance.state.isSearchPriority).toBeTruthy();
        });
    });

    describe('getFilteredDataBySearch()', () => {
        it('should return data filtered by search', () => {
            wrapper.setState({ search: 'fat' });
            const expected  = {
                fat: {
                    info     : { id: 'fat', name: 'fat' },
                    children :  {
                        'firstChild' : {
                            info  : { id    : 'firstChild', name : 'fat' },
                            value : { topic : 'topicName3' },
                            searchMeta : [ 'firstChild', 'topicName3' ]
                        }
                    },
                    searchMeta: [ 'fat' ]
                }
            };
            const result = instance.getFilteredDataBySearch();

            expect(result).toEqual(expected);
        });

        it('should return data filtered by search', () => {
            wrapper.setState({ search: 'selectedFirstId' });
            const expected  = {
                selectedFirstId: {
                    info    : { id: 'selectedFirstId', name: 'fat' },
                    children :  {
                        'selectedSecondId' : {
                            info       : { id : 'selectedSecondId', name : 'selectedSecondId' },
                            value      : { topic : 'Unique' },
                            searchMeta : [ 'selectedSecondId', 'Unique' ],
                            children   : null
                        },
                        children : null
                    },
                    searchMeta: [ 'selectedFirstId', 'Unique' ]
                }
            };
            const result = instance.getFilteredDataBySearch();

            expect(result).toEqual(expected);
        });

        it('should trigger syncSelectedWithSearch if state.isSearchPriority === true', () => {
            instance.syncSelectedWithSearch = jest.fn();
            wrapper.setState({ isSearchPriority: true, search: 'Unique' });

            instance.getFilteredDataBySearch();

            expect(instance.syncSelectedWithSearch).toHaveBeenCalled();
        });

        it('shouldn\'t trigger syncSelectedWithSearch if state.isSearchPriority === false', () => {
            instance.syncSelectedWithSearch = jest.fn();
            wrapper.setState({ isSearchPriority: false });

            instance.getFilteredDataBySearch();

            expect(instance.syncSelectedWithSearch).not.toHaveBeenCalled();
        });
    });

    describe('handleFormSubmit()', () => {
        it('should trigger props.onSubmit if value to submit exist', () => {
            // instance.getValueToSubmit = jest.fn(() => 'value');
            wrapper.setState({ selected: ['selectedFirstId#selectedSecondId'] });

            instance.handleFormSubmit();

            expect(instance.props.onSubmit).toHaveBeenCalled();
        });

        it('shouldn\'t trigger props.onSubmit if value to submit not exist', () => {
            instance.getValueToSubmit = jest.fn(() => void 0);

            instance.handleFormSubmit();

            expect(instance.props.onSubmit).not.toHaveBeenCalled();
        });
    })

    xit('getValueToSubmit should return value for submit', () => {
        wrapper.setState({
            selected: {
                first  : 'selectedFirstId',
                second : 'selectedSecondId',
                last   : null
            }
        });

        const selected = instance.getValueToSubmit();

        expect({ topic: 'topicName' }).toEqual(selected);
    });

    it('props.onCLose() should be triggerred on close button click', () => {
        const closeControls = wrapper.find('.closeButton');

        closeControls.at(0).simulate('click');

        expect(instance.props.onClose).toHaveBeenCalled();
    });

    function getMockAppState() {
        return {
            homie: {
                devices: {
                    ...DEVICES_MOCK
                }
            }
        };
    }

    function getMockProps() {
        return {
            isOpen   : true,
            onClose  : jest.fn(),
            onSubmit : jest.fn(),
            topics   : [ {} ]
        };
    }
});
