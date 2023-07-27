import React, { PureComponent }      from 'react';
import PropTypes                     from 'prop-types';
import { connect }                   from 'react-redux';
import history                       from '../../../history';
import { getTopics }                 from '../../../utils/homie/getTopics';
import * as scenariosActions         from '../../../actions/scenarios';
import * as homieActions             from '../../../actions/homie';
import * as enumAsyncActions         from '../../../actions/enumAsync';
import * as scenarioTemplatesActions from '../../../actions/scenarioTemplates/';
import { NOT_FOUND, SCENARIOS }      from '../../../assets/constants/routes';
import LoadingNotification           from '../../base/LoadingNotification';
import {
    insertConfigurationFields
}                                    from './Scenarios/etc/fields';
import { scenariosFlattenErrors }    from './Scenarios/etc/errors';
import CustomForm                    from './shared/CustomForm';

class ScenarioEditContainer extends PureComponent {
    static propTypes = {
        match               : PropTypes.object.isRequired,
        devices             : PropTypes.object.isRequired,
        thresholds          : PropTypes.object.isRequired,
        installedExtensions : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool,
            isUpdating : PropTypes.bool
        }).isRequired,
        scenarioTemplates    : PropTypes.object.isRequired,
        getDevices           : PropTypes.func.isRequired,
        getScenario          : PropTypes.func.isRequired,
        updateScenario       : PropTypes.func.isRequired,
        aliases              : PropTypes.array.isRequired,
        getEnumAsyncOptions  : PropTypes.func.isRequired,
        getScenarioTemplates : PropTypes.func.isRequired,
        groups               : PropTypes.array.isRequired,
        homieScenarios       : PropTypes.object.isRequired
    }

    state = {
        isFetching       : true,
        isProcessing     : false,
        scenario         : null,
        errors           : null,
        enumAsyncActions : []
    }

    componentDidMount() {
        this.fetchData();
    }

    handleUpdateScenario = async fields => {
        const { match: { params: { id } }, updateScenario } = this.props;

        this.handleStartProcessing();

        const { title, name, script, entityType, ...params } = fields; /* eslint-disable-line no-unused-vars */
        const payload = {
            title,
            name,
            script,
            params
        };

        try {
            await updateScenario(id, payload);
            this.handleSuccess();
        } catch (err) {
            this.handleError(err);
        }
    }

    handlePushBack = () => {
        history.push(SCENARIOS);
    }

    handleStartProcessing = () => this.setState({ isProcessing: true, errors: null })

    handleSuccess = () => {
        this.setState({ isProcessing: false, errors: null });
        this.handlePushBack();
    }

    handleError = error => {
        const processErrors = scenariosFlattenErrors(error);

        this.setState({ isProcessing: false, errors: processErrors });

        throw processErrors;
    }

    handleInteract = name => this.setState(prevState => ({
        errors : {
            ...prevState.errors,
            [name] : null
        }
    }))

    handleGetEnumAsyncOptions = async (path, value) => {
        const { getEnumAsyncOptions } = this.props;

        if (!value) return;

        try {
            const { data } = await getEnumAsyncOptions(path, { search: value });

            this.setState({ enumAsyncOptions: data });
        } catch (err) {
            console.log(err);
        }
    }

    getScenarioConfiguration(scenario) {
        const { installedExtensions: { list } } = this.props;

        if (!scenario) return;
        const { mode } = scenario;
        const baseConfiguration = list.find(item => item.name === scenario.type);

        if (!baseConfiguration && mode !== 'ADVANCED') return false;

        return insertConfigurationFields(mode, baseConfiguration, true);
    }


    async fetchData() {
        const {
            match: { params: { id } },
            getScenarioTemplates,
            getDevices, getScenario } = this.props;

        getScenarioTemplates();
        getDevices();

        this.setState({ isFetching: true });

        try {
            const scenario = await getScenario(id);

            this.setState({ scenario, isFetching: false });

            if (scenario.params.CITY) this.initEnumAsyncOptions(scenario.params.CITY);
            else if (scenario.params.CITY_COORDINATES) this.initEnumAsyncOptions(scenario.params.CITY_COORDINATES);
        } catch {
            this.setState({ isFetching: false });
        }
    }

    initEnumAsyncOptions = async (value) => {
        const { getEnumAsyncOptions } = this.props;

        if (!value) return;

        try {
            const { data } = await getEnumAsyncOptions('/cities', { latlng: value });

            this.setState({ enumAsyncOptions: data });
        } catch (err) {
            console.log(err);
        }
    }

    renderLoader() {
        return (<LoadingNotification text='Loading scenario...' />);
    }

    renderForm() {
        const { scenario, errors, isProcessing, enumAsyncOptions } = this.state;
        const { devices, aliases, scenarioTemplates, thresholds, groups, homieScenarios } = this.props;

        const scenarioConfiguration = this.getScenarioConfiguration(scenario);

        if (!scenarioConfiguration || !scenario) {
            history.push(NOT_FOUND);

            return null;
        }

        const initialState = {
            ...scenario.params,
            title  : scenario.title,
            name   : scenario.name,
            script : scenario.script
        };
        const topics = getTopics(devices, aliases, thresholds, groups, homieScenarios);

        return (
            <CustomForm
                scenarioTemplates = {scenarioTemplates}
                configuration     = {scenarioConfiguration}
                topics            = {topics}
                enumAsyncOptions  = {enumAsyncOptions}
                initialState      = {initialState}
                errors            = {errors}
                isProcessing      = {isProcessing}
                onInteract        = {this.handleInteract}
                onSave            = {this.handleUpdateScenario}
                onClickBack       = {this.handlePushBack}
                onChangeEnumAsync = {this.handleGetEnumAsyncOptions}
            />
        );
    }

    render() {
        const { installedExtensions } = this.props;
        const { isFetching } = this.state;

        const isFetchingAll = installedExtensions.isFetching || isFetching;

        return (
            isFetchingAll
                ? this.renderLoader()
                : this.renderForm()
        );
    }
}


function mapStateToProps(state) {
    return {
        scenarioTemplates   : state.scenarioTemplates,
        installedExtensions : state.extensions.installedEntities,
        devices             : state.homie.devices,
        aliases             : state.aliases.list,
        thresholds          : state.homie.thresholds,
        groups              : state.groups.list,
        homieScenarios      : state.homie.scenarios
    };
}

export default connect(
    mapStateToProps,
    {
        ...scenariosActions,
        ...homieActions,
        ...enumAsyncActions,
        ...scenarioTemplatesActions
    }
)(ScenarioEditContainer);
