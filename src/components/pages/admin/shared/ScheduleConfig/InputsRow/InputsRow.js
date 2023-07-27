import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import Tooltip from '@material-ui/core/Tooltip';

import BinIcon from '../../../../../base/icons/Bin';
import ScheduleIcon from '../../../../../base/icons/Schedule';

import styles from './InputsRow.less';

const cx = classnames.bind(styles);

class InputsRow extends PureComponent {
    static propTypes = {
        startValue       : PropTypes.string,
        endValue         : PropTypes.string,
        startError       : PropTypes.string,
        endError         : PropTypes.string,
        id               : PropTypes.number,
        isInvisible      : PropTypes.bool,
        darkThemeSupport : PropTypes.bool,
        onOpenModal      : PropTypes.func,
        onRemove         : PropTypes.func
    }

    static defaultProps = {
        startValue       : '',
        endValue         : '',
        startError       : '',
        endError         : '',
        id               : null,
        isInvisible      : false,
        darkThemeSupport : true,
        onOpenModal      : undefined,
        onRemove         : undefined
    }

    state = {
        isOverflowed : false
    }

    componentDidMount() {
        this.isValueOverflowed();
    }

    componentDidUpdate() {
        this.isValueOverflowed();
    }

    handleOpenModal = () => {
        const { id, onOpenModal } = this.props;

        if (onOpenModal) onOpenModal(id);
    }

    handleRemoveField = () => {
        const { id, onRemove } = this.props;

        if (onRemove) onRemove(id);
    }

    onBlur = () => {
        this.startInput.blur();
        this.endInput.blur();
    }

    isNodeOverflowed = (node) => {
        const { scrollWidth, clientWidth } = node;

        return scrollWidth > clientWidth;
    }

    isValueOverflowed = () => {
        if (this.startInput && this.endInput) {
            const isStartOverfload = this.isNodeOverflowed(this.startInput);
            const isEndOverfload = this.isNodeOverflowed(this.endInput);

            this.setState({ isOverflowed: isStartOverfload && isEndOverfload });
            this.onBlur();
        }
    }

    render() {
        const { startValue, endValue, startError, endError, darkThemeSupport, isInvisible } = this.props;
        const { isOverflowed } = this.state;

        const StartTimeFieldCN = cx(styles.startTimeField, {
            dark    : darkThemeSupport,
            invalid : !!startError
        });
        const EndTimeFieldCN = cx(styles.endTimeField, {
            dark    : darkThemeSupport,
            invalid : !!startError
        });

        return (
            <>
                <Tooltip title={startValue} disableHoverListener={!isOverflowed}>
                    <div className={StartTimeFieldCN} onClick={this.handleOpenModal}>
                        <input
                            ref={node => this.startInput = node}
                            className={styles.input}
                            value={startValue}
                            placeholder='Set start time'
                            readOnly
                        />
                        <div className={styles.errorMessage}>{startError}</div>
                    </div>
                </Tooltip>
                <Tooltip title={endValue} disableHoverListener={!isOverflowed}>
                    <div className={EndTimeFieldCN} onClick={this.handleOpenModal}>
                        <input
                            ref={node => this.endInput = node}
                            className={styles.input}
                            value={endValue}
                            placeholder='Set end time'
                            readOnly
                        />
                        <div className={styles.errorMessage}>{endError}</div>
                    </div>
                </Tooltip>
                <div
                    className={styles.scheduleButton}
                    onClick={this.handleOpenModal}
                >
                    <ScheduleIcon />
                </div>
                <div
                    className={cx(styles.removeButton, { invisible: isInvisible })}
                    onClick={this.handleRemoveField}
                >
                    <BinIcon className={styles.deleteIcon} />
                </div>
            </>
        );
    }
}

export default InputsRow;
