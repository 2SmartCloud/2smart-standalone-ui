import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import Search                   from '../../../base/inputs/Search';
import SortButton               from '../../../base/SortButton';
import styles                   from './ListedPageHeader.less';

const cx = classnames.bind(styles);

class ListedPageHeader extends PureComponent {
    static propTypes = {
        searchQuery         : PropTypes.string.isRequired,
        sortOrder           : PropTypes.oneOf([ 'ASC', 'DESC' ]).isRequired,
        setSearchQuery      : PropTypes.func.isRequired,
        setSortOrder        : PropTypes.func.isRequired,
        isSearchRender      : PropTypes.bool.isRequired,
        isListFetching      : PropTypes.bool,
        placeholder         : PropTypes.string.isRequired,
        rightBlockClassName : PropTypes.string,
        children            : PropTypes.element,
        sortLocalStorageKey : PropTypes.string,
        renderCustomSort    : PropTypes.func,
        classes             : PropTypes.shape({
            pageHeader    : PropTypes.string,
            filters       : PropTypes.string,
            searchWrapper : PropTypes.string
        })
    }

    static defaultProps = {
        isListFetching      : false,
        children            : null,
        sortLocalStorageKey : '',
        rightBlockClassName : '',
        renderCustomSort    : void 0,
        classes             : {}
    }

    render() {
        const {
            searchQuery,
            sortOrder,
            isSearchRender,
            isListFetching,
            setSearchQuery,
            setSortOrder,
            placeholder,
            children,
            sortLocalStorageKey,
            rightBlockClassName,
            renderCustomSort,
            classes
        } = this.props;

        const listedPageHeaderCN = cx(styles.ListedPageHeader, {
            [classes?.pageHeader] : classes?.pageHeader
        });

        return (
            <div className={listedPageHeaderCN}>
                { isSearchRender
                    ? (
                        <div
                            className={cx(styles.filterButtonsWrapper, {
                                [classes?.filters] : classes?.filters
                            })}
                        >
                            <div
                                className={cx(styles.searchWrapper, {
                                    [classes?.searchWrapper] : classes.searchWrapper
                                })}
                            >
                                <Search
                                    placeholder     = {placeholder}
                                    placeholderType = 'secondary'
                                    value           = {searchQuery}
                                    onChange        = {setSearchQuery}
                                />
                            </div>
                            { renderCustomSort
                                ? renderCustomSort()
                                : (
                                    <div className={styles.sortButtonWrapper}>
                                        <SortButton
                                            searchOrder     = {sortOrder}
                                            onChange        = {setSortOrder}
                                            localStorageKey = {sortLocalStorageKey}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    ) : null
                }
                { isListFetching
                    ? null
                    : children && <div
                        className={cx(styles.createButtonWrapper, {
                            [rightBlockClassName] : rightBlockClassName
                        })}>
                        {children}
                    </div>
                }
            </div>
        );
    }
}

export default ListedPageHeader;
