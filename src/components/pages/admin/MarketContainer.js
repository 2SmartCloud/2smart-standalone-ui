import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as marketServicesActions from '../../../actions/marketServices';
import * as extensionsActions from '../../../actions/extensions';

import MarketPage from './Market/MarketPage/';

class MarketContainer extends PureComponent {
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
        setMarketSearchQuery     : PropTypes.func.isRequired,
        setMarketSortOrder       : PropTypes.func.isRequired,
        setMarketCurrentPage     : PropTypes.func.isRequired,
        installMarketService     : PropTypes.func.isRequired,
        checkMarketServiceUpdate : PropTypes.func.isRequired,
        updateMarketService      : PropTypes.func.isRequired,
        deleteMarketService      : PropTypes.func.isRequired,
        setExtensionsSearchQuery : PropTypes.func.isRequired,
        setExtensionsSortOrder   : PropTypes.func.isRequired,
        checkExtensionUpdate     : PropTypes.func.isRequired,
        setExtensionsCurrentPage : PropTypes.func.isRequired,
        getExtensions            : PropTypes.func.isRequired,
        updateExtension          : PropTypes.func.isRequired,
        deleteExtension          : PropTypes.func.isRequired,
        createExtensionEntity    : PropTypes.func.isRequired,
        extensions               : PropTypes.object.isRequired,
        location                 : PropTypes.string.isRequired
    }


    render() {
        const {
            location,
            marketServices,
            userServices,
            setMarketSearchQuery,
            setMarketSortOrder,
            setMarketCurrentPage,
            installMarketService,
            checkMarketServiceUpdate,
            updateMarketService,
            deleteMarketService,

            extensions,
            setExtensionsSearchQuery,
            setExtensionsSortOrder,
            setExtensionsCurrentPage,
            createExtensionEntity,
            getExtensions,
            checkExtensionUpdate,
            updateExtension,
            deleteExtension
        } = this.props;

        return (
            <MarketPage
                location={location}
                marketServices={marketServices}
                userServices={userServices}
                setMarketSearchQuery={setMarketSearchQuery}
                setMarketSortOrder={setMarketSortOrder}
                setMarketCurrentPage={setMarketCurrentPage}
                installMarketService={installMarketService}
                checkMarketServiceUpdate={checkMarketServiceUpdate}
                updateMarketService={updateMarketService}
                deleteMarketService={deleteMarketService}

                extensions={extensions}
                getExtensions={getExtensions}
                checkExtensionUpdate={checkExtensionUpdate}
                updateExtension={updateExtension}
                deleteExtension={deleteExtension}

                setExtensionsSearchQuery={setExtensionsSearchQuery}
                setExtensionsSortOrder={setExtensionsSortOrder}
                setExtensionsCurrentPage={setExtensionsCurrentPage}
                installExtension={createExtensionEntity}
            />
        );
    }
}

function mapStateToProps(state) {
    const availableExtensions = state.extensions.list;
    const installedExtensions = state.extensions.installedEntities.list;

    const notInstalled = availableExtensions.filter(extension => {
        return !installedExtensions.find(installed => installed.name === extension.name);
    });

    const fullExtentionsList = [ ...notInstalled, ...installedExtensions ];


    return {
        userServices   : state.userServices,
        marketServices : state.marketServices,
        extensions     : {
            ...state.extensions,
            list : fullExtentionsList
        }
    };
}

export default connect(mapStateToProps, { ...marketServicesActions, ...extensionsActions })(MarketContainer);
