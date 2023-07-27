import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import SendMessageIcon from '../../../base/icons/SendMessage';
import { NOTIFICATION_CHANNELS } from '../../../../assets/constants/routes';
import ListRow from '../../../base/list/ListRow';
import ProcessingIndicator from '../../../base/ProcessingIndicator';

import styles from './ChannelsListRow.less';

class ChannelsListRow extends PureComponent {
    static propTypes = {
        channel : PropTypes.shape({
            id            : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
            configuration : PropTypes.shape({
                chatId : PropTypes.string,
                token  : PropTypes.string
            }),
            alias : PropTypes.string,
            state : PropTypes.string,
            icon  : PropTypes.node
        }).isRequired,
        deleteChannel     : PropTypes.func.isRequired,
        activateChannel   : PropTypes.func.isRequired,
        deactivateChannel : PropTypes.func.isRequired,
        sendTestMessage   : PropTypes.func.isRequired
    }

    state = {
        isProcessing : false,
        isSending    : false
    }

    handleSwitchChange = async () => {
        const { channel, activateChannel, deactivateChannel } = this.props;

        this.setState({
            isProcessing : true
        });

        const handler = channel.state === 'enabled'
            ? deactivateChannel
            : activateChannel;

        try {
            await handler(channel.id);
        } catch {
            // pass
        }

        this.setState({
            isProcessing : false
        });
    }

    handleDeleteChannel  = () => {
        const { channel, deleteChannel } = this.props;

        deleteChannel(channel);
    }

    handleTestMessage = async () => {
        const { sendTestMessage, channel } = this.props;

        this.setState({ isSending: true });

        await sendTestMessage(channel.id);

        this.setState({ isSending: false });
    }

    checkIsProcessing() {
        return !!this.state.isProcessing;
    }

    renderControls = () => {
        const { isSending } = this.state;

        return (
            <div className={styles.controls}>
                <div className={styles.testMessageWrapper}>
                    {
                        isSending
                            ? <ProcessingIndicator size={20} />
                            : <Tooltip
                                classes={{
                                    tooltip : styles.tooltip
                                }}
                                title='Test message'
                            >
                                <SendMessageIcon className={styles.label} onClick={this.handleTestMessage} />
                            </Tooltip>
                    }
                </div>
            </div>
        );
    }

    render() {
        const { channel: { id, state, alias, icon } } = this.props;

        const isProcessing = this.checkIsProcessing();
        const servicePath = `${NOTIFICATION_CHANNELS}/${id}`;
        const status = state === 'enabled' ? 'ACTIVE' : 'INACTIVE';

        return (
            <ListRow
                type={icon}
                title={alias}
                status={status}
                statusHint={status?.toLowerCase() || ''}
                editPath={servicePath}
                isProcessing={isProcessing}
                isDisabled={isProcessing}
                renderContent={this.renderControls()}
                onSwitchToggle={this.handleSwitchChange}
                onDeleteItem={this.handleDeleteChannel}
            />
        );
    }
}

export default ChannelsListRow;
