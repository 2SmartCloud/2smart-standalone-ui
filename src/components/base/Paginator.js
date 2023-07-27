import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import Icon from './Icon';
import styles from './Paginator.less';

const cx = classnames.bind(styles);

class Paginator extends PureComponent {
    static propTypes = {
        length       : PropTypes.number.isRequired,
        currentPage  : PropTypes.number.isRequired,
        perPage      : PropTypes.number.isRequired,
        onPageChange : PropTypes.func.isRequired
    }

    componentDidUpdate(prevProps) {
        const { length, currentPage } = this.props;
        const maxPageIndex = this.getMaxPageIndex();

        if (prevProps.length !== length && currentPage > maxPageIndex) {
            this.handleChangePageIndex(maxPageIndex);
        }
    }

    handlePrevButtonClick = () => {
        const { currentPage } = this.props;
        let nextIndex = currentPage - 1;

        if (nextIndex < 1) nextIndex = 1;

        this.handleChangePageIndex(nextIndex);
    }

    handleNextButtonClick = () => {
        const { currentPage } = this.props;
        const maxPageIndex = this.getMaxPageIndex();
        let nextIndex = currentPage + 1;

        if (nextIndex > maxPageIndex) nextIndex = maxPageIndex;

        this.handleChangePageIndex(nextIndex);
    }

    handlePageButtonClick = value => {
        const maxPageIndex = this.getMaxPageIndex();
        let nextIndex = value;

        if (nextIndex < 1) nextIndex = 1;
        if (nextIndex > maxPageIndex) nextIndex = maxPageIndex;

        this.handleChangePageIndex(nextIndex);
    }

    handleChangePageIndex = nextIndex => {
        const { onPageChange } = this.props;

        onPageChange(nextIndex);
    }

    getMaxPageIndex = () => {
        const { length, perPage } = this.props;

        return Math.ceil(length / perPage);
    }

    getExtraClassname = (pageIndex, value, isEmphasis) => {
        if (isEmphasis) return null;

        return pageIndex === value ? 'current' : 'button';
    }

    getPaginationControlsIndexes = () => {
        const { currentPage, perPage, length } = this.props;

        const count         = Math.ceil(length / perPage);
        const siblingCount  = 1;
        const boundaryCount = 1;

        const hideNextButton  = true;
        const hidePrevButton  = true;
        const showFirstButton = false;
        const showLastButton  = false;

        function getRange(start, end) {
            const rangeLength = end - start + 1;

            return Array.from({ length: rangeLength }, (_, i) => start + i);
        }

        const startPages = getRange(1, Math.min(boundaryCount, count));
        const endPages = getRange(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

        const siblingsStart = Math.max(
            Math.min(
                // Natural start
                currentPage - siblingCount,
                // Lower boundary when page is high
                count - boundaryCount - siblingCount * 2 - 1,
            ),
            // Greater than startPages
            boundaryCount + 2,
        );

        const siblingsEnd = Math.min(
            Math.max(
                // Natural end
                currentPage + siblingCount,
                // Upper boundary when page is low
                boundaryCount + siblingCount * 2 + 2,
            ),
            // Less than endPages
            endPages.length > 0 ? endPages[0] - 2 : count - 1,
        );

        // Basic list of items to render
        // e.g. itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next', 'last']
        const itemList = [
            ...(showFirstButton ? [ 'first' ] : [ ]),
            ...(hidePrevButton  ? [ ] : [ 'previous' ]),
            ...startPages,

            // Start ellipsis
            // eslint-disable-next-line no-nested-ternary
            ...(siblingsStart > boundaryCount + 2
                ? [ 'start-ellipsis' ]
                : boundaryCount + 1 < count - boundaryCount
                    ? [ boundaryCount + 1 ]
                    : [ ]),

            // Sibling pages
            ...getRange(siblingsStart, siblingsEnd),

            // End ellipsis
            // eslint-disable-next-line no-nested-ternary
            ...(siblingsEnd < count - boundaryCount - 1
                ? [ 'end-ellipsis' ]
                : count - boundaryCount > boundaryCount
                    ? [ count - boundaryCount ]
                    : [ ]),

            ...endPages,
            ...(hideNextButton ? [ ] : [ 'next' ]),
            ...(showLastButton ? [ 'last' ] : [ ])
        ];

        function getButtonPage(type) {
            switch (type) {
                case 'first':
                    return 1;
                case 'previous':
                    return currentPage - 1;
                case 'next':
                    return currentPage + 1;
                case 'last':
                    return count;
                default:
                    return null;
            }
        }

        // Convert the basic item list to PaginationItem list
        return itemList.map((item) => {
            const pageNumber = typeof item === 'number' ? item : getButtonPage(item);

            return ({
                value      : pageNumber,
                isEmphasis : !pageNumber
            });
        });
    }

    setFirstPage = () => {
        this.handleChangePageIndex(1);
    }

    setLastPage = () => {
        const maxPageIndex = this.getMaxPageIndex();

        this.handleChangePageIndex(maxPageIndex);
    }

    renderPageIndexes = () => {
        const { currentPage } = this.props;
        const paginationControlsIndexes = this.getPaginationControlsIndexes();

        return paginationControlsIndexes.map(({ value, isEmphasis, noDisplayMobile }) => {
            return (
                <div
                    key={Math.random()}
                    className={cx('pageIndex', this.getExtraClassname(currentPage, value, isEmphasis), { noneMobile: noDisplayMobile })}
                    onClick={isEmphasis  // eslint-disable-line react/jsx-no-bind
                        ? undefined
                        : () => this.handlePageButtonClick(value)
                    }
                >
                    {isEmphasis ? '...' : value}
                </div>
            );
        });
    }

    render() {
        const { currentPage, perPage, length } = this.props;

        if (length <= perPage) return null;

        const minPageIndex = 1;
        const maxPageIndex = this.getMaxPageIndex();

        const isFirstArrowDisabled = minPageIndex === currentPage;
        const isLastArrowDisabled  = maxPageIndex === currentPage;

        return (
            <div className={styles.Paginator}>
                <button
                    className = {cx(styles.paginationButton, { disabled: isFirstArrowDisabled })}
                    onClick   = {isFirstArrowDisabled ? void 0 : this.handlePrevButtonClick}
                >
                    <Icon type='left-arrow' />
                </button>

                {this.renderPageIndexes()}

                <button
                    className = {cx(styles.paginationButton, { disabled: isLastArrowDisabled })}
                    onClick   = {isLastArrowDisabled ? void 0 : this.handleNextButtonClick}
                >
                    <Icon type='right-arrow' />
                </button>
            </div>
        );
    }
}

export default Paginator;
