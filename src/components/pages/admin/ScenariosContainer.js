import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import * as ScenariosActions    from '../../../actions/scenarios';
import * as InterfaceActions    from '../../../actions/interface';
import * as HomieActions        from '../../../actions/homie';
import { mapSetpoint }          from '../../../utils/mapper/setpoints';
import { sortByField }          from '../../../utils/sort';

import ScenariosPage            from './Scenarios/ScenariosPage';

class ScenariosContainer extends PureComponent {
    static propTypes = {
        installedExtensions : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool,
            isUpdating : PropTypes.bool
        }).isRequired,
        scenarios : PropTypes.shape({
            list        : PropTypes.array,
            isFetching  : PropTypes.bool,
            isUpdating  : PropTypes.bool,
            searchQuery : PropTypes.string,
            sortOrder   : PropTypes.oneOf([ 'ASC', 'DESC' ]),
            currentPage : PropTypes.number
        }).isRequired,
        isTresholdFetching                : PropTypes.bool.isRequired,
        thresholds                        : PropTypes.object.isRequired,
        location                          : PropTypes.object.isRequired,
        getScenarios                      : PropTypes.func.isRequired,
        setScenariosSearchQuery           : PropTypes.func.isRequired,
        setScenariosSortOrder             : PropTypes.func.isRequired,
        setScenariosCurrentPage           : PropTypes.func.isRequired,
        updateScenario                    : PropTypes.func.isRequired,
        updateScenarioState               : PropTypes.func.isRequired,
        deleteScenario                    : PropTypes.func.isRequired,
        getThresholds                     : PropTypes.func.isRequired,
        callExtensionNotExistNotification : PropTypes.func.isRequired

    }

    componentDidMount() {
        this.props.getThresholds();
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        const { location } = this.props;

        const isLocationChange = location !== prevProps.location;

        if (isLocationChange) this.fetchData();
    }

    getSetpoinsValues() {
        const {
            thresholds,
            scenarios : { list, isFetching },
            installedExtensions:{ list:installedExtensionsList },
            isTresholdFetching
        } = this.props;

        const scenariosWithSetpoints = (isTresholdFetching || isFetching)
            ? list
            : list.map(scenario => {
                const scenarioThreshold = thresholds[scenario.name];
                const setpoints =  scenarioThreshold?.length
                    ? scenarioThreshold.map(threshold => mapSetpoint(threshold))
                    : [];
                const sortedSetpoints = sortByField(setpoints, 'name');
                const isEditAllowed = scenario.mode === 'ADVANCED' || !!installedExtensionsList.find(item => item.name === scenario.type);

                return ({
                    ...scenario,
                    isEditAllowed,
                    setpoints : sortedSetpoints
                });
            });

        return scenariosWithSetpoints;
    }

    fetchData() {
        const { getScenarios } = this.props;

        getScenarios();
    }

    render() {
        const {
            isTresholdFetching,
            scenarios,
            installedExtensions,
            setScenariosSearchQuery,
            setScenariosSortOrder,
            setScenariosCurrentPage,
            updateScenario,
            deleteScenario,
            updateScenarioState,
            callExtensionNotExistNotification
        } = this.props;
        const scenariosList = this.getSetpoinsValues();

        return (
            <ScenariosPage
                callExtensionNotExistNotification = {callExtensionNotExistNotification}
                scenarios = {{
                    ...scenarios,
                    list : scenariosList
                }}
                installedExtensions = {installedExtensions}
                isTresholdFetching  = {isTresholdFetching}
                setSearchQuery      = {setScenariosSearchQuery}
                setSortOrder        = {setScenariosSortOrder}
                setCurrentPage      = {setScenariosCurrentPage}
                updateScenario      = {updateScenario}
                updateScenarioState = {updateScenarioState}
                deleteScenario      = {deleteScenario}
            />
        );
    }
}

function mapStateToProps(state) {
    const scenariosHomie = state.homie.scenarios || {};
    const mergedScenariosList = (state?.scenarios?.list || [])?.map(scenario => {
        const homieScenario = scenariosHomie?.[scenario?.name];

        return {
            ...(scenario || {}),
            isProcessing : homieScenario?.isStateProcessing,
            rootTopic    : homieScenario?.rootTopic,
            homieState   : homieScenario?.state
        };
    });

    return {
        scenarios : {
            ...(state?.scenarios || {}),
            list       : mergedScenariosList,
            isFetching : state?.scenarios?.isFetching
        },
        installedExtensions : state.extensions.installedEntities,
        isTresholdFetching  : state.homie.isTresholdFetching,
        thresholds          : state.homie.thresholds
    };
}

export default connect(mapStateToProps, {
    ...ScenariosActions,
    ...InterfaceActions,
    ...HomieActions
})(ScenariosContainer);
