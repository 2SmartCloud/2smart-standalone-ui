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
import {
    transformFieldsToFormInitialState
}                                    from '../../../utils/mapper/service';
import LoadingNotification           from '../../base/LoadingNotification';
import {
    insertConfigurationFields
}                                    from './Scenarios/etc/fields';
import { scenariosFlattenErrors }    from './Scenarios/etc/errors';
import CustomForm                    from './shared/CustomForm';

const ALLOWED_FIELD_TYPES = [ 'string', 'number', 'topic', 'topics', 'enum' ];

class ScenarioCreateContainer extends PureComponent {
    static propTypes = {
        location            : PropTypes.object.isRequired,
        devices             : PropTypes.object.isRequired,
        thresholds          : PropTypes.object.isRequired,
        installedExtensions : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool,
            isUpdating : PropTypes.bool
        }).isRequired,
        scenarioTemplates     : PropTypes.object.isRequired,
        getDevices            : PropTypes.func.isRequired,
        createScenario        : PropTypes.func.isRequired,
        aliases               : PropTypes.array.isRequired,
        getEnumAsyncOptions   : PropTypes.func.isRequired,
        getScenarioTemplates  : PropTypes.func.isRequired,
        getScenarioUniqueName : PropTypes.func.isRequired,
        groups                : PropTypes.array.isRequired,
        homieScenarios        : PropTypes.object.isRequired
    }

    state = {
        isProcessing     : false,
        errors           : undefined,
        enumAsyncOptions : [],
        prefilledData    : undefined
    };

    componentDidMount() {
        const {  getDevices, getScenarioTemplates } = this.props;

        getDevices();
        getScenarioTemplates();
        this.getPrefilledData();
    }

    handleAddScenario = async fields => {
        const { location: { query: { mode, type } }, createScenario } = this.props;

        this.handleStartProcessing();

        const { title, name, script, entityType, ...params } = fields;
        const payload = {
            mode,
            typeId : type,
            title,
            name,
            script,
            type   : entityType,
            params
        };

        try {
            await createScenario(payload);
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
        const processError = scenariosFlattenErrors(error);

        this.setState({ isProcessing: false, errors: processError });

        throw processError;
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

    getPrefilledData = async () => {
        const { getScenarioUniqueName, location: { query: { mode, type } },
            installedExtensions: { list } } = this.props;

        this.setState({ isProcessing: true });

        const extensionData = list.find(item => item.id === type);
        const title = mode !== 'ADVANCED'
            ? extensionData?.title || ''
            : 'Pro scenario';

        if (!title) return;

        const nameValidSymbols = title?.replace(/[^\d\s\w-]/ig, ' ')?.toLowerCase() || '';
        const formattedName = `@2smart/${nameValidSymbols?.trim()?.split(' ')?.join('-') || ''}`;

        try {
            const { name } = await getScenarioUniqueName(mode, formattedName);

            this.setState({ isProcessing: false, prefilledData: { title, name } });
        } catch (err) {
            this.setState({ isProcessing: false, prefilledData: { title, name: '' } });
        }
    }

    getScenarioConfiguration(id) {
        const { location: { query: { mode } }, installedExtensions: { list } } = this.props;
        const baseConfiguration = list.find(item => item.id === id);

        if (!baseConfiguration && mode !== 'ADVANCED') return false;

        return insertConfigurationFields(mode, baseConfiguration);
    }

    renderLoader() {
        return (<LoadingNotification text='Loading scenario...' />);
    }

    renderForm() {
        const {
            location: {
                query: {
                    type
                }
            },
            devices,
            aliases,
            scenarioTemplates,
            thresholds,
            groups,
            homieScenarios
        } = this.props;
        const { errors, isProcessing, enumAsyncOptions, prefilledData } = this.state;

        const scenarioConfiguration = this.getScenarioConfiguration(type);

        if (!scenarioConfiguration) {
            history.push(NOT_FOUND);

            return null;
        }

        const initialState = scenarioConfiguration.fields
            ? transformFieldsToFormInitialState(scenarioConfiguration.fields, ALLOWED_FIELD_TYPES)
            : {};


        const fullInitialState = {
            ...(initialState || {}),
            ...(prefilledData || {})
        };

        const topics = getTopics(devices, aliases, thresholds, groups, homieScenarios);

        return (
            <CustomForm
                configuration     = {scenarioConfiguration}
                scenarioTemplates = {scenarioTemplates}
                initialState      = {fullInitialState}
                errors            = {errors}
                topics            = {topics}
                enumAsyncOptions  = {enumAsyncOptions}
                isProcessing      = {isProcessing}
                onInteract        = {this.handleInteract}
                onSave            = {this.handleAddScenario}
                onClickBack       = {this.handlePushBack}
                onChangeEnumAsync = {this.handleGetEnumAsyncOptions}
            />
        );
    }

    render() {
        const { installedExtensions: { isFetching } } = this.props;
        const { prefilledData } = this.state;

        return (
            isFetching || !prefilledData
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
)(ScenarioCreateContainer);
