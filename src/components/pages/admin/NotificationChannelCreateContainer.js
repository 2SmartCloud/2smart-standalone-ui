import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import history from '../../../history';
// import * as scenariosActions from '../../../actions/scenarios';
// import * as homieActions from '../../../actions/homie';
import * as notificationChannelsActions from '../../../actions/notificationChannels';
import { NOT_FOUND, NOTIFICATION_CHANNELS } from '../../../assets/constants/routes';
import { transformFieldsToFormInitialState } from '../../../utils/mapper/service';
import LoadingNotification from '../../base/LoadingNotification';

import CustomForm from './shared/CustomForm';

const ALLOWED_FIELD_TYPES = [ 'string', 'number', 'topic', 'topics' ];
const TOPICS_LIST = [];

class NotificationChannelCreateContainer extends PureComponent {
    static propTypes = {
        location : PropTypes.object.isRequired,
        channels : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool,
            isUpdating : PropTypes.bool
        }).isRequired,
        userChannels : PropTypes.shape({
            isFetching : PropTypes.bool
        }).isRequired,
        createUserNotificationChannel : PropTypes.func.isRequired
    }

    state = {
        isProcessing : false,
        errors       : undefined
    }

    handleAddNotificationChannel = async fields => {
        const { location: { query: { type } }, createUserNotificationChannel } = this.props;

        this.handleStartProcessing();

        const { alias, ...rest } = fields;
        const payload = {
            type,
            alias         : alias ? alias.trim() : alias,
            configuration : this.getTrimmedValues(rest)
        };

        try {
            await createUserNotificationChannel(payload);
            this.handleSuccess();
        } catch (err) {
            this.handleError(err);
        }
    }

    handlePushBack = () => history.push(NOTIFICATION_CHANNELS)

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
        const { configuration } = list.find(item => item.type === type) || {};

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

    getTrimmedValues = (object) => {
        if (!object) return object;

        const result = {};

        Object.keys(object).forEach(key => {
            result[key] = object[key] ? object[key].trim() : object[key];
        });

        return result;
    }

    getProcessErrors = (error) => {
        if (!error) return error;

        const { configuration, ...rest } = error?.fields || {};

        return {
            ...rest,
            ...configuration
        };
    }

    renderLoader() {
        return (<LoadingNotification text='Loading channel...' />);
    }

    renderForm() {
        const { location: { query: { type } } } = this.props;
        const { errors, isProcessing } = this.state;

        const channelConfiguration = this.getChannelConfiguration(type);

        if (!channelConfiguration) {
            history.push(NOT_FOUND);

            return null;
        }

        const initialState = channelConfiguration.fields
            ? transformFieldsToFormInitialState(channelConfiguration.fields, ALLOWED_FIELD_TYPES)
            : {};

        return (
            <CustomForm
                configuration={channelConfiguration}
                initialState={initialState}
                errors={errors}
                topics={TOPICS_LIST}
                isProcessing={isProcessing}
                onInteract={this.handleInteract}
                onSave={this.handleAddNotificationChannel}
                onClickBack={this.handlePushBack}
            />
        );
    }

    render() {
        const { userChannels, channels } = this.props;
        const isFetching = userChannels.isFetching || channels.isFetching;

        return (
            isFetching
                ? this.renderLoader()
                : this.renderForm()
        );
    }
}

function mapStateToProps(state) {
    return {
        channels     : state.notificationChannels.channels,
        userChannels : state.notificationChannels.userChannels
    };
}

export default connect(
    mapStateToProps,
    { ...notificationChannelsActions }
)(NotificationChannelCreateContainer);
