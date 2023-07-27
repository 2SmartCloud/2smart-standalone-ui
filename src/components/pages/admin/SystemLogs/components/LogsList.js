import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import ProcessingIndicator      from '../../../../base/ProcessingIndicator';
import Icon                     from '../../../../base/Icon';
import Button                   from '../../../../base/Button';
import LogsListRow              from './LogsListRow';
import styles                   from './LogsList.less';

const cx = classnames.bind(styles);

class LogsList extends PureComponent {
    static propTypes = {
        list          : PropTypes.array.isRequired,
        isLoading     : PropTypes.bool,
        showLoadMore  : PropTypes.bool,
        sortOrder     : PropTypes.oneOf([ 'asc', 'desc' ]).isRequired,
        onChangeOrder : PropTypes.func.isRequired,
        onLoadMore    : PropTypes.func.isRequired
    }

    static defaultProps = {
        isLoading    : false,
        showLoadMore : false
    }

    handleChangeOrder = () => {
        const { sortOrder, onChangeOrder } = this.props;

        onChangeOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    }

    handleLoadMore = () => {
        const { onLoadMore } = this.props;

        onLoadMore();
    }

    scrollToTop() {
        if (this.wrapper) this.wrapper.scrollTo(0, 0);
    }

    renderHeader() {
        const { sortOrder } = this.props;

        return (
            <div className={styles.header}>
                <div className={styles.cell} />
                <div className={styles.cell}>Container</div>
                <div className={cx('cell', 'message')}>Message</div>
                <div className={styles.cell}>
                    <div className={cx('sort', sortOrder)} onClick={this.handleChangeOrder}>
                        Time
                        <Icon type='sort' />
                    </div>
                </div>
                <div className={styles.cell} />
            </div>
        );
    }

    renderContent() {
        const { list } = this.props;

        return (
            <div className={styles.content}>
                {list.map(item => (
                    <LogsListRow
                        key         = {item.id}
                        item        = {item}
                        rowClasses  = {styles.row}
                        cellClasses = {styles.cell}
                    />
                ))}
            </div>
        );
    }

    renderLoadMoreButton() {
        const { showLoadMore } = this.props;

        if (!showLoadMore) return null;

        return (
            <div className={styles.loadMoreWrapper}>
                <Button
                    text='Load more logs'
                    onClick={this.handleLoadMore}
                />
            </div>
        );
    }

    renderTable() {
        return (
            <>
                {this.renderHeader()}
                {this.renderContent()}
                {this.renderLoadMoreButton()}
            </>
        );
    }

    renderNoLogsMessage() {
        return (
            <div className={styles.noLogsMessage}>
                Sorry, we couldn&apos;t find any results for your search
            </div>
        );
    }

    render() {
        const { list, isLoading } = this.props;

        return (
            <div className={styles.LogsList}>
                {
                    isLoading
                        ? <div className={styles.overflow}>
                            <ProcessingIndicator size={70} />
                        </div>
                        : null
                }
                <div ref={el => this.wrapper = el} className={cx('wrapper', { blur: isLoading })}>
                    {
                        list.length
                            ? this.renderTable()
                            : this.renderNoLogsMessage()
                    }
                </div>
            </div>
        );
    }
}

export default LogsList;
