import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as userServicesActions from '../../../actions/userServices';
import ServicesPage from './Services/ServicesPage';

class ServicesContainer extends PureComponent {
    static propTypes = {
        marketServices : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool
        }).isRequired,
        userServices : PropTypes.shape({
            list        : PropTypes.array,
            isFetching  : PropTypes.bool,
            searchQuery : PropTypes.string,
            sortOrder   : PropTypes.oneOf([ 'ASC', 'DESC' ]),
            currentPage : PropTypes.number
        }).isRequired,
        setSearchQuery        : PropTypes.func.isRequired,
        setSortOrder          : PropTypes.func.isRequired,
        setCurrentPage        : PropTypes.func.isRequired,
        deleteBridgeEntity    : PropTypes.func.isRequired,
        activateUserService   : PropTypes.func.isRequired,
        deactivateUserService : PropTypes.func.isRequired
    };

    render() {
        const {
            marketServices,
            userServices,
            setSearchQuery,
            setSortOrder,
            setCurrentPage,
            deleteBridgeEntity,
            activateUserService,
            deactivateUserService
        } = this.props;

        return (
            <ServicesPage
                marketServices={marketServices}
                userServices={userServices}
                setSearchQuery={setSearchQuery}
                setSortOrder={setSortOrder}
                setCurrentPage={setCurrentPage}
                deleteUserService={deleteBridgeEntity}
                activateUserService={activateUserService}
                deactivateUserService={deactivateUserService}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        marketServices : state.marketServices,
        userServices   : state.userServices
    };
}

export default connect(mapStateToProps, { ...userServicesActions })(ServicesContainer);
