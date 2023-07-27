import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import history                  from '../../../history';
import * as notificationChannelsActions from '../../../actions/notificationChannels';
import { NOT_FOUND, NOTIFICATION_CHANNELS }  from '../../../assets/constants/routes';
import LoadingNotification      from '../../base/LoadingNotification';
import CustomForm              from './shared/CustomForm';
import ConfirmationModal        from './shared/ConfirmationModal';

const REDIRECT_TIMEOUT = 60 * 1000;
const TOPICS_LIST = [];

class NotificationChannelEditContainer extends PureComponent {
    static propTypes = {
        match    : PropTypes.object.isRequired,
        channels : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool
        }).isRequired,
        userChannels : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool
        }).isRequired,
        updateUserNotificationChannel : PropTypes.func.isRequired
    }

    state = {
        isProcessing : false,
        modal        : {
            isOpen : false
        },
        errors : null
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

    handleUpdateChannel = fields => {
        this.updateChannel(fields);
    }

    handleConfirmUpdate = () => {
        this.handleModalClose();
        this.updateChannel(this.modalContext);
    }

    handlePushBack = () => {
        history.push(NOTIFICATION_CHANNELS);
    }

    handleStartProcessing = () => this.setState({ isProcessing: true, errors: null })

    handleSuccess = () => {
        this.setState({ isProcessing: false, errors: null });
        this.handlePushBack();
    }

    handleError = error => {
        this.setState({ isProcessing: false, errors: this.getProcessErrors(error) });
    }

    handleInteract = name => this.setState(prevState => ({
        errors : {
            ...prevState.errors,
            [name] : null
        }
    }))

    getChannelConfiguration(type) {
        const { channels: { list } } = this.props;
        const { configuration } = list?.find(item => item.type === type) || {};

        if (!configuration) return null;

        return {
            fields : [
                {
                    name        : 'alias',
                    type        : 'string',
                    label       : 'Name*',
                    placeholder : 'Name'
                },
                ...configuration?.fields || []
            ]
        };
    }

    getChannelToEdit() {
        const { match: { params: { id } }, userChannels: { list } } = this.props;

        return list?.find(item => item.id === id);
    }

    getProcessErrors = (error) => {
        if (!error) return error;

        const { configuration, ...rest } = error?.fields || {};

        return {
            ...rest,
            ...configuration
        };
    }

    getTrimmedValues = (object) => {
        if (!object) return object;

        const result = {};

        Object.keys(object).forEach(key => {
            result[key] = object[key] ? object[key].trim() : object[key];
        });

        return result;
    }

    clearRedirectTimeout = () => {
        clearTimeout(this.redirectTimer);
    }

    updateChannel = async fields => {
        const { match: { params: { id } }, updateUserNotificationChannel } = this.props;

        this.handleStartProcessing();

        try {
            const { alias, ...rest } = fields;
            const channel = this.getChannelToEdit();

            const payload = {
                type          : channel.type,
                alias         : alias ? alias.trim() : alias,
                configuration : this.getTrimmedValues(rest)
            };

            await updateUserNotificationChannel(id, payload);
            this.handleSuccess();
        } catch (err) {
            this.handleError(err);
        }
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

        const channel = this.getChannelToEdit();
        const channelConfiguration = this.getChannelConfiguration(channel?.type);

        if (!(channelConfiguration && channel)) {
            this.redirectByTimeout();

            return this.renderLoader();
        }

        this.clearRedirectTimeout();

        const initialState = {
            alias : channel.alias,
            ...(channel.configuration || {})
        };

        return (
            <CustomForm
                configuration={channelConfiguration}
                initialState={initialState}
                errors={errors}
                topics={TOPICS_LIST}
                isProcessing={isProcessing}
                onInteract={this.handleInteract}
                onSave={this.handleUpdateChannel}
                onClickBack={this.handlePushBack}
            />
        );
    }

    renderModal() {
        const { modal: { title, text, labels, isOpen, isProcessing } } = this.state;

        return (
            <ConfirmationModal
                title={title}
                text={text}
                labels={labels}
                isOpen={isOpen}
                isLoading={isProcessing}
                onSubmit={this.handleConfirmUpdate}
                onClose={this.handleModalClose}
            />
        );
    }

    render() {
        const { channels, userChannels } = this.props;
        const isFetching = channels.isFetching || userChannels.isFetching;

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
        channels     : state.notificationChannels.channels,
        userChannels : state.notificationChannels.userChannels
    };
}

export default connect(mapStateToProps, { ...notificationChannelsActions })(NotificationChannelEditContainer);
