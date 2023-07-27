import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import AddonsTab                from '../AddonsTab';
import history                  from '../../../../../history';

import ExtensionsTab            from '../ExtensionsTab/';
import Tabs                     from '../../../../base/TabsWrapper';
import {
    MARKET_SORT_ORDER,
    MARKET_VIEW_MODE
}                               from '../../../../../assets/constants/localStorage';
import * as ROUTES              from '../../../../../assets/constants/routes';
import {
    MAX_MOBILE_WIDTH
}                               from '../../../../../assets/constants';
import localStorageUtils        from '../../../../../utils/localStorage';
import Addon                    from '../../../../base/icons/Addon';
import Extension                from '../../../../base/icons/Extension';
import ListedPageHeader         from '../../shared/ListedPageHeader';
import ViewModeControl          from './ViewModeControl.js';
import styles                   from './MarketPage.less';

export const TABS = [
    { value: 'addons', label: 'Addons', icon: Addon, hash: '#addons' },
    { value: 'extensions', label: 'Extensions', icon: Extension,  hash: '#extensions' }
];

const isMobile = window.innerWidth <= MAX_MOBILE_WIDTH;

class MarketPage extends PureComponent {
    static propTypes = {
        marketServices : PropTypes.shape({
            list        : PropTypes.array,
            isFetching  : PropTypes.bool,
            searchQuery : PropTypes.string,
            sortOrder   : PropTypes.oneOf([ 'ASC', 'DESC' ]),
            currentPage : PropTypes.number
        }).isRequired,
        userServices : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool
        }).isRequired,
        extensions : PropTypes.shape({
            list        : PropTypes.array,
            isFetching  : PropTypes.bool,
            searchQuery : PropTypes.string,
            sortOrder   : PropTypes.oneOf([ 'ASC', 'DESC' ]),
            currentPage : PropTypes.number
        }).isRequired,
        location                 : PropTypes.string.isRequired,
        setMarketSearchQuery     : PropTypes.func.isRequired,
        setExtensionsSearchQuery : PropTypes.func.isRequired,
        setExtensionsSortOrder   : PropTypes.func.isRequired,
        setMarketSortOrder       : PropTypes.func.isRequired,
        installMarketService     : PropTypes.func.isRequired,
        updateMarketService      : PropTypes.func.isRequired,
        setMarketCurrentPage     : PropTypes.func.isRequired,
        deleteMarketService      : PropTypes.func.isRequired,
        checkMarketServiceUpdate : PropTypes.func.isRequired,
        installExtension         : PropTypes.func.isRequired,
        checkExtensionUpdate     : PropTypes.func.isRequired,
        setExtensionsCurrentPage : PropTypes.func.isRequired,
        getExtensions            : PropTypes.func.isRequired,
        updateExtension          : PropTypes.func.isRequired,
        deleteExtension          : PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        const { hash } = history.location || {};
        const activeTabIndex = TABS.findIndex(option => option.hash === hash);


        this.state = {
            activeTab : activeTabIndex > -1 ? activeTabIndex : 0,
            viewMode  : isMobile
                ? 'list'
                : localStorageUtils.getData(MARKET_VIEW_MODE) || 'list' // [ card, list ]
        };
    }

    handleTabChange = tabIndex => {
        this.setState({
            activeTab : tabIndex
        });

        const { hash } = TABS[tabIndex];

        if (hash) history.push(`${ROUTES.MARKET}${hash}`);
    }

    handleToggleViewMode = () => {
        const { viewMode } = this.state;
        const nextViewMode = viewMode === 'card' ? 'list' : 'card';

        this.setState({
            viewMode : nextViewMode
        });
        localStorageUtils.saveData(MARKET_VIEW_MODE, nextViewMode);
    }

    getHeaderData = () => {
        const { activeTab } = this.state;
        const { setMarketSearchQuery, setExtensionsSearchQuery,
            setExtensionsSortOrder, setMarketSortOrder,
            marketServices : {
                searchQuery : marketSearchQuery,
                sortOrder   : marketSortOrder,
                list        : marketList
            },
            extensions : {
                searchQuery : extensionSearchQuery,
                sortOrder   : extensionSortOrder,
                list        : extensionsList
            }
        } = this. props;

        return activeTab === 0
            ? {
                setSearchQuery : setMarketSearchQuery,
                setSortOrder   : setMarketSortOrder,
                searchQuery    : marketSearchQuery,
                sortOrder      : marketSortOrder,
                isSearchRender : marketList?.length
            }
            : {
                setSearchQuery : setExtensionsSearchQuery,
                setSortOrder   : setExtensionsSortOrder,
                searchQuery    : extensionSearchQuery,
                sortOrder      : extensionSortOrder,
                isSearchRender : extensionsList?.length
            };
    }


    renderContent = () => {
        const { activeTab, viewMode } = this.state;
        const { location, marketServices, userServices, installMarketService, checkMarketServiceUpdate,
            updateMarketService, setMarketCurrentPage, deleteMarketService, setMarketSortOrder,
            extensions, installExtension, setExtensionsSortOrder, setExtensionsCurrentPage,
            getExtensions,
            checkExtensionUpdate, updateExtension, deleteExtension  } = this.props;

        switch (activeTab) {
            case 0:
                return (
                    <AddonsTab
                        marketServices           = {marketServices}
                        userServices             = {userServices}
                        setSortOrder             = {setMarketSortOrder}
                        setCurrentPage           = {setMarketCurrentPage}
                        installMarketService     = {installMarketService}
                        checkMarketServiceUpdate = {checkMarketServiceUpdate}
                        updateMarketService      = {updateMarketService}
                        deleteMarketService      = {deleteMarketService}
                        viewMode                 = {viewMode}
                    />);
            case 1:
                return (
                    <ExtensionsTab
                        location                 = {location}
                        extensions               = {extensions}
                        getExtensions            = {getExtensions}
                        setExtensionsSortOrder   = {setExtensionsSortOrder}
                        setExtensionsCurrentPage = {setExtensionsCurrentPage}
                        installExtension         = {installExtension}
                        checkExtensionUpdate     = {checkExtensionUpdate}
                        updateExtension          = {updateExtension}
                        deleteExtension          = {deleteExtension}
                        viewMode                 = {viewMode}
                    />);

            default:
                return null;
        }
    }


    render() {
        const { setSearchQuery,
            setSortOrder,
            searchQuery,
            sortOrder,
            isSearchRender
        } = this.getHeaderData();
        const { activeTab, viewMode } = this.state;
        const withViewModeControls = isSearchRender && !isMobile;

        return (
            <div className={styles.MarketPage}>
                <ListedPageHeader
                    isSearchRender      = {isSearchRender}
                    placeholder         = 'Search for a service'
                    setSearchQuery      = {setSearchQuery}
                    setSortOrder        = {setSortOrder}
                    searchQuery         = {searchQuery}
                    sortOrder           = {sortOrder}
                    sortLocalStorageKey = {MARKET_SORT_ORDER}
                    rightBlockClassName = {withViewModeControls ? styles.tabsWrapper : null}
                >
                    { withViewModeControls
                        ? (
                            <ViewModeControl
                                viewMode         = {viewMode}
                                onToggleViewMode = {this.handleToggleViewMode}
                            />
                        ) : null
                    }
                    <Tabs
                        value    = {activeTab}
                        onChange = {this.handleTabChange}
                        tabs     = {TABS}
                        classes  = {{
                            root : styles.tabsRoot
                        }}
                    />
                </ListedPageHeader>
                <div className={styles.contentWrapper}>
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}

export default MarketPage;
