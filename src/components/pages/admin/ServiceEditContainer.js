import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import history                  from '../../../history';
import * as userServicesActions from '../../../actions/userServices';
import { NOT_FOUND, SERVICES }  from '../../../assets/constants/routes';
import LoadingNotification      from '../../base/LoadingNotification';
import CustomForm               from './shared/CustomForm';
import ConfirmationModal        from './shared/ConfirmationModal';

const REDIRECT_TIMEOUT = 60 * 1000;

class ServiceEditContainer extends PureComponent {
    static propTypes = {
        match          : PropTypes.object.isRequired,
        marketServices : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool
        }).isRequired,
        userServices : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool
        }).isRequired,
        updateBridgeEntity : PropTypes.func.isRequired,
        scenarioTemplates  : PropTypes.object.isRequired
    }

    state = {
        isProcessing : false,
        modal        : {
            isOpen : false
        },
        errors : null
    }

    getInitialState(service) {
        const { match: { params: { id } } } = this.props;

        return { ...service?.params, ID: id };
    }

    componentWillUnmount() {
        this.clearRedirectTimeout();
    }

    handleModalOpen = ({ title, text, labels }) => {
        this.setState({ modal: { title, text, labels, isOpen: true, isProcessing: false } });
    }

    handleModalClose = () => {
        this.setState({ modal: { isOpen: false } });
    }

    handleUpdateService = fields => {
        this.updateService(fields);
        // const service = this.getServiceToEdit();

        // return [ 'starting', 'started' ].includes(service.state)
        //     ? this.handleConfirmModalOpen(service, fields)
        //     : this.updateService(fields);
    }

    handleConfirmUpdate = () => {
        this.handleModalClose();
        this.updateService(this.modalContext);
    }

    // handleConfirmModalOpen = (service, fields) => {
    //     this.modalContext = fields;

    //     const serviceConfiguration = this.getServiceConfiguration(service?.type);
    //     const serviceLabel = serviceConfiguration?.label;

    //     const title = `Update ${serviceLabel}`;
    //     const text = `To add the change for the instance ${serviceLabel}\nwe will do an update for this instance.`;
    //     const labels = { submit: 'Yes, update', cancel: 'Cancel' };

    //     this.handleModalOpen({ title, text, labels });
    // }

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
        const serviceConfiguration = list.find(item => item.name === type);

        const idField = {
            label : 'Service ID',
            name  : 'ID',
            type  : 'id'
        };

        if (!serviceConfiguration) return;

        const fields = [];

        if (serviceConfiguration?.fields && Array.isArray(serviceConfiguration.fields)) {
            fields.push(...serviceConfiguration.fields);
        }

        fields.push(idField);

        return serviceConfiguration && {
            ...serviceConfiguration,
            fields
        };
    }

    getServiceToEdit() {
        const { match: { params: { id } }, userServices: { list } } = this.props;

        return list.find(item => item.id === id);
    }

    updateService = async fields => {
        const { match: { params: { id } }, updateBridgeEntity } = this.props;

        this.handleStartProcessing();

        try {
            await updateBridgeEntity(id, fields);
            this.handleSuccess();
        } catch (err) {
            this.handleError(err);
        }
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
        const { errors, isProcessing } = this.state;
        const { marketServices, userServices, scenarioTemplates } = this.props;

        if (marketServices.isFetching || userServices.isFetching) return;
        const service = this.getServiceToEdit();

        const initialState = this.getInitialState(service);
        const serviceConfiguration = this.getServiceConfiguration(service?.type);

        if (!(serviceConfiguration && service)) {
            this.redirectByTimeout();

            return this.renderLoader();
        }

        this.clearRedirectTimeout();

        return (
            <CustomForm
                scenarioTemplates = {scenarioTemplates}
                configuration     = {serviceConfiguration}
                initialState      = {initialState}
                errors            = {errors}
                isProcessing      = {isProcessing}
                onInteract        = {this.handleInteract}
                onSave            = {this.handleUpdateService}
                onClickBack       = {this.handlePushBack}
            />
        );
    }

    renderModal() {
        const { modal: { title, text, labels, isOpen, isProcessing } } = this.state;

        return (
            <ConfirmationModal
                title     = {title}
                text      = {text}
                labels    = {labels}
                isOpen    = {isOpen}
                isLoading = {isProcessing}
                onSubmit  = {this.handleConfirmUpdate} // eslint-disable-line react/jsx-handler-names
                onClose   = {this.handleModalClose}
            />
        );
    }

    render() {
        const { marketServices, userServices } = this.props;
        const isFetching = marketServices.isFetching || userServices.isFetching;

        return (
            <>
                { isFetching
                    ? this.renderLoader()
                    : this.renderForm()
                }
                {this.renderModal()}
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        marketServices    : state.marketServices,
        userServices      : state.userServices,
        scenarioTemplates : state.scenarioTemplates
    };
}

export default connect(mapStateToProps, { ...userServicesActions })(ServiceEditContainer);
