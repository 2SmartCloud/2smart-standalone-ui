import React, { PureComponent } from 'react';
import Tooltip                  from '@material-ui/core/Tooltip';
import classnames               from 'classnames/bind';
import PropTypes                from 'prop-types';

import cronstrue                from '../../../../utils/cronParser';

import ScheduleModal            from '../../../pages/admin/shared/ScheduleModal';
import Schedule                 from '../../icons/Schedule';

import styles                   from './Schedule.less';

const cn = classnames.bind(styles);

class ScheduleControl extends PureComponent {
    state = {
        isOpen       : false,
        isOverflowed : false,
        cronString   : ''
    }

    componentDidMount() {
        this.isValueOverflowed();
    }

    componentDidUpdate() {
        this.isValueOverflowed();
    }

    handleOpenModal = () => {
        this.setState({ isOpen: true });
    }

    handleCloseModal = () => {
        this.setState({ isOpen: false });
    }

    handleSubmit = (cronExp) => {
        const { onChange } = this.props;

        this.setState({ isOpen: false });
        onChange(cronExp);
    }

    isValueOverflowed = () => {
        if (this.input) {
            const { scrollWidth, clientWidth } = this.input;
            const isOverflowed = scrollWidth > clientWidth;

            this.setState({ isOverflowed });
        }
    }

    transformCronToString = () => {
        const { value } = this.props;

        if (!value) return '';
        const cronExpToString = cronstrue.toString(value, {
            use24HourTimeFormat     : true,
            dayOfWeekStartIndexZero : true
        });

        return cronExpToString;
    }

    render() {
        const {
            value,
            isInvalid,
            placeholder,
            darkThemeSupport
        } = this.props;
        const { isOpen, isOverflowed } = this.state;
        const ScheduleCN = cn('ScheduleControl', {
            invalid : isInvalid,
            dark    : darkThemeSupport
        });
        const cronString = this.transformCronToString();

        return (
            <>
                <div className={ScheduleCN}>
                    <Tooltip
                        title={cronString}
                        disableHoverListener={!isOverflowed}
                    >
                        <input
                            ref         = {node => this.input = node}
                            className   = {styles.input}
                            value       = {cronString}
                            placeholder = {placeholder}
                            onClick     = {this.handleOpenModal}
                            readOnly
                        />
                    </Tooltip>
                    <div
                        className = {styles.buttonWrapper}
                        onClick   = {this.handleOpenModal}
                    >
                        <Schedule />
                    </div>
                </div>
                <ScheduleModal
                    title          = 'Schedule'
                    cronExpression = {value}
                    isOpen         = {isOpen}
                    onClose        = {this.handleCloseModal}
                    onSubmit       = {this.handleSubmit}
                />
            </>
        );
    }
}

export default ScheduleControl;

ScheduleControl.propTypes = {
    value            : PropTypes.string,
    isInvalid        : PropTypes.bool,
    placeholder      : PropTypes.string,
    onChange         : PropTypes.func.isRequired,
    darkThemeSupport : PropTypes.bool
};

ScheduleControl.defaultProps = {
    value            : '',
    isInvalid        : false,
    darkThemeSupport : false,
    placeholder      : ''
};
