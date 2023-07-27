import React, { PureComponent, Fragment } from 'react';
import { connect }                        from 'react-redux';
import PropTypes                          from 'prop-types';
import { DEVICES_SORT_ORDER }             from '../../../assets/constants/localStorage';
import * as HomieActions                  from '../../../actions/homie';
import * as SessionActions                from '../../../actions/session';
import * as InterfaceActions              from '../../../actions/interface';
import Search                             from '../../base/inputs/Search';
import { sortDevices }                    from '../../../utils/sort';
import { getDevicesWithAlias }            from '../../../utils/homie/getTopics';
import LoadingNotification                from '../../base/LoadingNotification';
import NoDevicesNotification              from '../../base/nothingToShowNotification/Devices';
import SortButton                         from '../../base/SortButton';
import { getDataFromSearch } from '../../../utils/search';
import Device                             from './Dashboard/Device';
import styles                             from './Dashboard.less';

class Dashboard extends PureComponent {
    static propTypes = {
        devices : PropTypes.arrayOf(PropTypes.shape({
            id                : PropTypes.string.isRequired,
            name              : PropTypes.string.isRequired,
            title             : PropTypes.string,
            isTitleProcessing : PropTypes.bool,
            localIp           : PropTypes.string.isRequired,
            mac               : PropTypes.string.isRequired,
            implementation    : PropTypes.string.isRequired,
            state             : PropTypes.string.isRequired,
            options           : PropTypes.array,
            nodes             : PropTypes.array,
            telemetry         : PropTypes.array,
            firmware          : PropTypes.objectOf(PropTypes.string)
        })).isRequired,
        route           : PropTypes.string.isRequired,
        isFetching      : PropTypes.bool.isRequired,
        sortOrder       : PropTypes.oneOf([ 'ASC', 'DESC' ]).isRequired,
        getDevices      : PropTypes.func.isRequired,
        checkSession    : PropTypes.func.isRequired,
        setDevicesOrder : PropTypes.func.isRequired
    }

    state = {
        searchQuery : ''
    }

    componentDidMount() {
        const { getDevices, checkSession, route } = this.props;

        checkSession(route);
        getDevices();
    }

    handleSearchChange = value => this.setState({ searchQuery: value })

    handleChangeSortOrder = value => {
        const { setDevicesOrder } = this.props;

        setDevicesOrder(value);
    }


    renderDevices = () => {
        const {  sortOrder, devices } = this.props;
        const { searchQuery } = this.state;
        const devicesFromSearch = getDataFromSearch(devices, searchQuery);


        return devicesFromSearch.length
            ? sortDevices(devicesFromSearch, sortOrder)
                .map((device, index) => {
                    const { name, nodes, id, options, telemetry, state, title, isTitleProcessing, titleError } = device;

                    return (
                        /* eslint-disable  react/no-array-index-key*/
                        <div key={`${id}${index}`}  className={styles.deviceWrapper}>
                            <Device
                                id={id}
                                name={name}
                                title={title}
                                isTitleProcessing={isTitleProcessing}
                                nodes={nodes}
                                options={options}
                                telemetry={telemetry}
                                state={state}
                                titleError={titleError}
                                sortOrder={sortOrder}
                            />
                        </div>
                    );
                })
            : <div className={styles.noDevicesMessage}>{'Sorry, we couldn\'t find any results for your search'}</div>;
    }

    render() {
        const { devices, isFetching, sortOrder } = this.props;
        const { searchQuery } = this.state;


        return (
            <div className={styles.Dashboard}>
                {
                    isFetching ? // eslint-disable-line
                        <LoadingNotification text={'Loading your devices'} />
                        : Object.keys(devices).length ?
                            <Fragment>
                                <div className={styles.controlPanel} >
                                    <div className={styles.searchBlock}>
                                        <div className={styles.searchWrapper}>
                                            <Search
                                                placeholder='Search for a device, node or sensor'
                                                value={searchQuery}
                                                onChange={this.handleSearchChange}
                                            />
                                        </div>

                                        <SortButton
                                            searchOrder     = {sortOrder}
                                            onChange        = {this.handleChangeSortOrder}
                                            localStorageKey = {DEVICES_SORT_ORDER}
                                        />
                                    </div>
                                </div>
                                <div className={styles.devicesWrapper}>
                                    {this.renderDevices()}
                                </div>
                            </Fragment> :
                            <NoDevicesNotification />
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { list:aliasList }  = state.aliases;

    const devicesWithAlias = getDevicesWithAlias({ devices: state.homie.devices, aliasList });

    return {
        devices    : devicesWithAlias,
        isFetching : state.homie.isFetching,
        sortOrder  : state.applicationInterface.devicesSortOrder
    };
}

export default connect(mapStateToProps, { ...HomieActions, ...SessionActions, ...InterfaceActions })(Dashboard);
