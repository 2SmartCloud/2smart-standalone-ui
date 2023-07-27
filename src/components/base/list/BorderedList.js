import React, { PureComponent } from 'react';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';
import BinIcon from '../icons/Bin';
import styles from './BorderedList.less';


class BorderedList extends PureComponent {
    static propTypes = {
        list        : PropTypes.array.isRequired,
        onDelete    : PropTypes.func.isRequired,
        totalLength : PropTypes.number.isRequired
    }

    componentDidMount() {
        disableBodyScroll(this.groupsContainer);
    }

    componentDidUpdate(prevProps) {
        const { totalLength } =  this.props;
        const { totalLength: prevTotalLength } = prevProps;

        if (totalLength > prevTotalLength) this.scrollToBottom();
    }
    componentWillUnmount() {
        enableBodyScroll(this.groupsContainer);
        clearAllBodyScrollLocks();
    }

    scrollToBottom() {
        setTimeout(() =>  this.groupsContainer.scrollTo(0, this.groupsContainer.scrollHeight), 0);
    }


    render() {
        const { list, onDelete } = this.props;

        return (
            <div
                ref={node => this.groupsContainer = node}
                className= {styles.BorderedList}
            >
                {list.length
                    ? list.map(group =>  (
                        <div
                            className= {styles.option}
                            key={group.id}
                        >
                            <p className={styles.label}>{group.label}</p>
                            <Tooltip title='Delete'>
                                <div>
                                    <BinIcon
                                        className={styles.deleteIcon}
                                        onClick={onDelete(group)}
                                    />
                                </div>
                            </Tooltip>
                        </div>))
                    : <div className={styles.infoLabel}>
                        <p> There is no groups</p>
                        <p> You can create them above </p>
                    </div>
                }
            </div>

        );
    }
}


export default BorderedList;

