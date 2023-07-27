/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';

import cronstrue                from '../../../../../utils/cronParser';
import InfoIcon                 from '../../../../base/icons/Info';

import ScheduleModal            from '../ScheduleModal';
import InputsRow                from './InputsRow';

import styles                   from './ScheduleConfig.less';

const VALIDATION_ERRORS_MAP = {
    'REQUIRED'     : 'Value is required',
    'FORMAT_ERROR' : 'Format error'
};

class ScheduleConfig extends PureComponent {
    static propTypes = {
        initialState : PropTypes.array.isRequired,
        field        : PropTypes.shape({
            label   : PropTypes.string,
            name    : PropTypes.string,
            default : PropTypes.array
        }),
        errors      : PropTypes.object.isRequired,
        onInteract  : PropTypes.func,
        onChange    : PropTypes.func,
        description : PropTypes.string,
        onOpenInfo  : PropTypes.func
    }

    static defaultProps = {
        field : {
            label   : '',
            name    : '',
            default : [ { start: '', end: '' } ]
        },
        onChange    : undefined,
        onInteract  : undefined,
        description : void 0,
        onOpenInfo  : void 0
    }

    state = {
        isOpen      : false,
        activeField : null,
        timePeriods : []
    }

    componentDidMount() {
        const { initialState, field } = this.props;

        if (!initialState) return this.setState({ timePeriods: field.default });

        this.setState({ timePeriods: initialState });
    }

    componentWillUnmount() {
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    }

    handleOpenInfo = (e) => {
        const { onOpenInfo, description } = this.props;

        if (!onOpenInfo || !description) return;

        onOpenInfo(description)(e);
    }

    handleOpenModal = (activeField) => {
        this.setState({ isOpen: true, activeField });
    }

    handleCloseModal = () => {
        this.setState({ isOpen: false, activeField: null });
    }

    handleAddField = () => {
        const { onChange } = this.props;
        const { timePeriods } = this.state;
        const dataToAdd = { start: '', end: '' };
        const dataToSet = [ ...timePeriods, dataToAdd ];

        this.setState({ timePeriods: dataToSet }, () => {
            this.scrollTo();
            this.onInteract();
        });

        if (onChange) onChange(dataToSet);
    }

    handleRemoveField = (id) => {
        const { onChange } = this.props;
        const { timePeriods } = this.state;
        const prevTimePeriods = [ ...timePeriods ];
        const dataToSet = prevTimePeriods.filter((item, index) => index !== id);

        this.setState({
            timePeriods : dataToSet
        });

        if (onChange) onChange(dataToSet);
        this.onInteract();
    };

    handleSumbitModal = (cronExpInterval, activeField) => {
        const { onChange } = this.props;
        const { timePeriods } = this.state;
        const timePeriodsToSet = [ ...timePeriods ];

        const result = timePeriodsToSet.map((timeObj, index) => {
            if (index === activeField) {
                return {
                    start : cronExpInterval[0],
                    end   : cronExpInterval[1]
                };
            }

            return timeObj;
        });

        this.setState({ timePeriods: result, activeField: null });

        if (onChange) onChange(result);
        this.onInteract();
    }

    getError(code, index, key) {
        if (!code) return;
        if (typeof code === 'string') return VALIDATION_ERRORS_MAP[code];

        if (!code[index]) return;

        const text = code[index][key];

        return VALIDATION_ERRORS_MAP[text];
    }

    scrollTo = (direction = 'bottom') => {
        this.scrollTimeout = setTimeout(() => {
            const position = direction === 'bottom' ? 'end' : 'start';

            this.scheduleConfig.scrollIntoView({ block: position, behavior: 'smooth' });
        }, 0);
    }

    transformCronToString = (value, label) => {
        if (!value) return '';
        const cronExpToString = cronstrue.toString(value, {
            use24HourTimeFormat     : true,
            dayOfWeekStartIndexZero : true
        });

        return `${label}: ${cronExpToString}`;
    }

    onInteract = () => {
        const { onInteract, errors } = this.props;

        if (onInteract && errors) onInteract('start');
    }

    renderField = () => {
        const { errors } = this.props;
        const { timePeriods = [] } = this.state;

        return (
            <div className={styles.formFieldWrapper}>
                {timePeriods.map((data, index) => {
                    const startCron = this.transformCronToString(data.start, 'Start time');
                    const endCron = this.transformCronToString(data.end, 'End time');
                    const startError = this.getError(errors, index, 'start');
                    const endError = this.getError(errors, index, 'end');
                    const isInvisible = timePeriods.length === 1;

                    return (
                        <div key={index} className={styles.fieldWrapper}>
                            <InputsRow
                                id={index}
                                startValue={startCron}
                                endValue={endCron}
                                startError={startError}
                                endError={endError}
                                isInvisible={isInvisible}
                                onOpenModal={this.handleOpenModal}
                                onRemove={this.handleRemoveField}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        const { field, description } = this.props;
        const { isOpen, activeField, timePeriods } = this.state;

        return (
            <div className={styles.PeriodicallyConfig} ref={node => this.scheduleConfig = node}>
                <div className={styles.header}>
                    <div className={styles.formInfo}>
                        <h3 className={styles.fieldLabel}>
                            {field.label}
                            { description
                                ? (
                                    <div
                                        className = {styles.infoButton}
                                        onClick   = {this.handleOpenInfo}
                                    >
                                        <InfoIcon />
                                    </div>
                                ) : null
                            }
                        </h3>
                        <div
                            className={styles.addFieldButton}
                            onClick={this.handleAddField}
                        >
                            +
                        </div>
                    </div>
                </div>
                {this.renderField()}
                <ScheduleModal
                    title='Schedule'
                    cronExpInterval={timePeriods}
                    activeField={activeField}
                    isOpen={isOpen}
                    onlyInterval
                    onClose={this.handleCloseModal}
                    onSubmit={this.handleSumbitModal}
                />
            </div>
        );
    }
}

export default ScheduleConfig;
