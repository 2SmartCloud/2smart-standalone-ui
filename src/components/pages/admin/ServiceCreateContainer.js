import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import history                  from '../../../history';
import * as userServicesActions from '../../../actions/userServices';
import { NOT_FOUND, SERVICES }  from '../../../assets/constants/routes';
import {
    transformFieldsToFormInitialState
}                               from '../../../utils/mapper/service';
import LoadingNotification      from '../../base/LoadingNotification';
import CustomForm               from './shared/CustomForm';

const ALLOWED_FIELD_TYPES = [
    'string', 'integer', 'json', 'modbus-config',
    'javascript', 'enum'
];
const REDIRECT_TIMEOUT = 60 * 1000;

class ServiceCreateContainer extends PureComponent {
    static propTypes = {
        location       : PropTypes.object.isRequired,
        marketServices : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool
        }).isRequired,
        createBridgeEntity : PropTypes.func.isRequired,
        scenarioTemplates  : PropTypes.object.isRequired
    }

    state = {
        isProcessing : false,
        errors       : undefined
    }

    componentWillUnmount() {
        this.clearRedirectTimeout();
    }

    handleAddService = async fields => {
        const { location: { query: { type } }, createBridgeEntity } = this.props;

        this.handleStartProcessing();

        const payload = {
            type,
            configuration : fields
        };

        try {
            await createBridgeEntity(payload);
            this.handleSuccess();
        } catch (err) {
            this.handleError(err);
        }
    }

    handlePushBack = () => {
        history.push(SERVICES);
    }

    handleStartProcessing = () => this.setState({ isProcessing: true, errors: null })

    handleSuccess = () => {
        this.setState({ isProcessing: false, errors: null });
        this.handlePushBack();
    }

    handleError = error => this.setState({ isProcessing: false, errors: error?.fields })

    handleInteract = name => this.setState(prevState => ({
        errors : {
            ...prevState.errors,
            [name] : null
        }
    }))

    getServiceConfiguration(type) {
        const { marketServices: { list } } = this.props;

        return list.find(item => item.name === type);
    }

    clearRedirectTimeout = () => {
        clearTimeout(this.redirectTimer);
    }

    redirectByTimeout = () => {
        if (this.redirectTimer) return;

        this.redirectTimer = setTimeout(() => {
            history.push(NOT_FOUND);
        }, REDIRECT_TIMEOUT);
    }

    renderLoader() {
        return (<LoadingNotification text='Loading service...' />);
    }

    renderForm() {
        const { location: { query: { type } }, scenarioTemplates } = this.props;
        const { errors, isProcessing } = this.state;

        const serviceConfiguration = this.getServiceConfiguration(type);

        if (!serviceConfiguration) {
            this.redirectByTimeout();

            return this.renderLoader();
        }

        this.clearRedirectTimeout();

        const initialState = serviceConfiguration.fields
            ? transformFieldsToFormInitialState(serviceConfiguration.fields, ALLOWED_FIELD_TYPES)
            : {};

        return (
            <CustomForm
                scenarioTemplates = {scenarioTemplates}
                configuration     = {serviceConfiguration}
                initialState      = {initialState}
                errors            = {errors}
                isProcessing      = {isProcessing}
                onInteract        = {this.handleInteract}
                onSave            = {this.handleAddService}
                onClickBack       = {this.handlePushBack}
            />
        );
    }

    render() {
        const { marketServices } = this.props;
        const isFetching = marketServices.isFetching;

        return (
            isFetching
                ? this.renderLoader()
                : this.renderForm()
        );
    }
}

function mapStateToProps(state) {
    return {
        marketServices    : state.marketServices,
        scenarioTemplates : state.scenarioTemplates
    };
}

export default connect(mapStateToProps, { ...userServicesActions })(ServiceCreateContainer);
