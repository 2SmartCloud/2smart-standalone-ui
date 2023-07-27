import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { sortNotificationChannels } from '../../../../utils/sort';
import ProcessingIndicator from '../../../base/ProcessingIndicator';
import Paginator from '../../../base/Paginator';
import ChannelsListRow from './ChannelsListRow';
import styles from './ChannelsList.less';

const cx = classnames.bind(styles);
const PER_PAGE = 10;

class ChannelsList extends PureComponent {
    static propTypes = {
        list              : PropTypes.array.isRequired,
        isUpdating        : PropTypes.bool,
        searchQuery       : PropTypes.string,
        sortOrder         : PropTypes.string.isRequired,
        currentPage       : PropTypes.number.isRequired,
        onChangePage      : PropTypes.func.isRequired,
        onDeleteChannel   : PropTypes.func.isRequired,
        activateChannel   : PropTypes.func.isRequired,
        deactivateChannel : PropTypes.func.isRequired,
        sendTestMessage   : PropTypes.func.isRequired
    }

    static defaultProps = {
        searchQuery : '',
        isUpdating  : false
    }

    componentDidUpdate(prevProps) {
        const { searchQuery } = this.props;

        if (searchQuery !== prevProps.searchQuery) {
            this.paginator?.setFirstPage();
        }
    }

    getFilteredList = () => {
        const { searchQuery, sortOrder, list } = this.props;
        const filtered = list.filter(item => item.alias?.toLowerCase().includes(searchQuery?.toLowerCase()));
        const sorted = sortNotificationChannels(filtered, sortOrder);

        return sorted;
    }

    getPaginatedList = list => {
        const { currentPage } = this.props;
        const offset = (currentPage - 1) * PER_PAGE;

        return list.slice(offset, offset + PER_PAGE);
    }

    renderList(filteredList) {
        const { currentPage, isUpdating, onChangePage } = this.props;
        const paginatedList = this.getPaginatedList(filteredList);

        return (
            <>
                { isUpdating
                    ? <div className={styles.overflow}>
                        <ProcessingIndicator size={70} />
                    </div>
                    : null
                }
                <div className={styles.rowsWrapper}>
                    { paginatedList.map(channel => this.renderChannel(channel)) }
                </div>
                <div className={styles.paginationControls}>
                    <Paginator
                        ref={el => this.paginator = el}
                        length={filteredList.length}
                        currentPage={currentPage}
                        perPage={PER_PAGE}
                        onPageChange={onChangePage}
                    />
                </div>
            </>
        );
    }

    renderChannel(channel) {
        const { onDeleteChannel, activateChannel, deactivateChannel, sendTestMessage } = this.props;

        return (
            <ChannelsListRow
                key={channel.id}
                channel={channel}
                deleteChannel={onDeleteChannel}
                activateChannel={activateChannel}
                deactivateChannel={deactivateChannel}
                sendTestMessage={sendTestMessage}
            />
        );
    }

    renderNoChannelsMessage() {
        return (
            <div className={styles.noChannelsMessage}>
                Sorry, we couldn&apos;t find any results for your search
            </div>
        );
    }

    render() {
        const { isUpdating } = this.props;

        const channelsListCN = cx('ChannelsList', { blur: isUpdating });
        const filteredList = this.getFilteredList();

        return (
            <div className={channelsListCN}>
                { filteredList.length
                    ? this.renderList(filteredList)
                    : this.renderNoChannelsMessage()
                }
            </div>
        );
    }
}

export default ChannelsList;
