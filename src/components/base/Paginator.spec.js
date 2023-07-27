import React from 'react';
import { shallow } from 'enzyme';
import Paginator from './Paginator';

describe('Paginator component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<Paginator {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('getMaxPageIndex() should return max available page index', () => {
        const result = instance.getMaxPageIndex();

        expect(result).toBe(10);
    });

    it('getExtraClassname() returns extra classes depending on condition', () => {
        expect(instance.getExtraClassname(1, 1, false)).toBe('current');
        expect(instance.getExtraClassname(1, 2, false)).toBe('button');
        expect(instance.getExtraClassname(1, 1, true)).toBeNull();
        expect(instance.getExtraClassname(1, 2, true)).toBeNull();
    });

    it('getPaginationControlsIndexes() should return correct indexes', () => {
        const result = instance.getPaginationControlsIndexes();
        // I haven't fully got the logic, so just left it hardcoded
        const expected = [
            { value: 1, isEmphasis: false },
            { value: 2, isEmphasis: false },
            { value: 3, isEmphasis: false },
            { value: 4, isEmphasis: false },
            { value: 5, isEmphasis: false },
            { value: null, isEmphasis: true },
            { value: 10, isEmphasis: false }
        ];

        expect(result).toEqual(expected);
    });

    describe('paginationButton should be disabled if', () => {
        it('current page === 1', () => {
            wrapper.setProps({ currentPage: 1, length: 20, perPage: 10 });

            const buttons = wrapper.find('.paginationButton.disabled');

            expect(buttons.length).toBe(1);

            buttons.at(0).simulate('click');

            expect(instance.props.onPageChange).not.toHaveBeenCalled();
        });

        it('current page === last page', () => {
            wrapper.setProps({ currentPage: 2, length: 20, perPage: 10 });

            const buttons = wrapper.find('.paginationButton.disabled');

            expect(buttons.length).toBe(1);

            buttons.at(0).simulate('click');

            expect(instance.props.onPageChange).not.toHaveBeenCalled();
        });
    });

    it('setFirstPage() should set first page', () => {
        instance.setFirstPage();

        expect(instance.props.onPageChange).toHaveBeenCalledWith(1);
    });

    it('setLastPage() should set last page', () => {
        instance.setLastPage();

        expect(instance.props.onPageChange).toHaveBeenCalledWith(10);
    });

    it('handleChangePageIndex() should call onPageChange callback', () => {
        instance.handleChangePageIndex(5);

        expect(instance.props.onPageChange).toHaveBeenCalledWith(5);
    });

    it('should set available max page if the current page exists no more', () => {
        wrapper.setProps({ currentPage: 10 });
        wrapper.setProps({ length: 60 });

        expect(instance.props.onPageChange).toHaveBeenCalledWith(6);
    });

    it('handlePrevButtonClick() should set prev page', () => {
        instance.handlePrevButtonClick();

        expect(instance.props.onPageChange).toHaveBeenCalledWith(2);
    });

    it('handlePrevButtonClick() should set first page if currentPage is lower than 1', () => {
        wrapper.setProps({ currentPage: 0 });
        instance.handlePrevButtonClick();

        expect(instance.props.onPageChange).toHaveBeenCalledWith(1);
    });

    it('handleNextButtonClick() should set next page', () => {
        instance.handleNextButtonClick();

        expect(instance.props.onPageChange).toHaveBeenCalledWith(4);
    });

    it('handleNextButtonClick() should set last page if currentPage is higher than max page', () => {
        wrapper.setProps({ currentPage: 12 });

        instance.handleNextButtonClick();
        expect(instance.props.onPageChange).toHaveBeenCalledWith(10);
    });

    it('handlePageButtonClick() should set given page in available page range', () => {
        instance.handlePageButtonClick(4);
        expect(instance.props.onPageChange).toHaveBeenCalledWith(4);

        instance.handlePageButtonClick(11);
        expect(instance.props.onPageChange).toHaveBeenCalledWith(10);

        instance.handlePageButtonClick(0);
        expect(instance.props.onPageChange).toHaveBeenCalledWith(1);
    });

    it('click on buttons should call onPageChange with correct values', () => {
        const buttons = wrapper.find('.button');
        const arrowButtons = wrapper.find('button');

        buttons.at(1).simulate('click');
        expect(instance.props.onPageChange).toHaveBeenLastCalledWith(2);

        buttons.at(3).simulate('click');
        expect(instance.props.onPageChange).toHaveBeenLastCalledWith(5);

        arrowButtons.at(0).simulate('click');
        expect(instance.props.onPageChange).toHaveBeenLastCalledWith(2);

        arrowButtons.at(1).simulate('click');
        expect(instance.props.onPageChange).toHaveBeenLastCalledWith(4);
    });

    function getMockProps() {
        return {
            length       : 100,
            currentPage  : 3,
            perPage      : 10,
            onPageChange : jest.fn()
        };
    }
});
