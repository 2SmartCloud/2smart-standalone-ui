import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import ScheduleModal            from '../../pages/admin/shared/ScheduleModal';
import InputsRow                from '../../pages/admin/shared/ScheduleConfig/InputsRow';

import ProcessingIndicator      from '../../base/ProcessingIndicator';

import { CronValidator }        from '../../../utils/cronBuilder';
import cronstrue                from '../../../utils/cronParser';

import styles                   from './ScheduleWidget.less';

const cx = classnames.bind(styles);

class ScheduleWidget extends PureComponent {
    static propTypes = {
        setValue   : PropTypes.func.isRequired,
        properties : PropTypes.array.isRequired,
        isEditMode : PropTypes.bool.isRequired
    };

    state = {
        isOpen     : false,
        timePeriod : {}
    }

    componentDidMount() {
        this.setState({
            timePeriod : this.getPeriod()
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.properties !== this.props.properties) {
            this.setState({
                timePeriod : this.getPeriod()
            });
        }
    }

    handleOpenModal = () => {
        this.setState({ isOpen: true });
    }

    handleCloseModal = () => {
        this.setState({ isOpen: false });
    }

    handleSubmitModal = cronExpInterval => {
        const { properties } = this.props;

        const startTimeTopic = properties.find(property => property.order === 0);
        const endTimeTopic = properties.find(property => property.order === 1);

        this.setValue({ topic: startTimeTopic, field: 'value', value: cronExpInterval[0] });
        this.setValue({ topic: endTimeTopic, field: 'value', value: cronExpInterval[1] });
    }

    getTopics = () => {
        const { properties } = this.props;

        const startTimeTopic = properties.find(property => property.order === 0);
        const endTimeTopic = properties.find(property => property.order === 1);

        return {
            startTimeTopic,
            endTimeTopic
        };
    }

    getPeriod = () => {
        const { startTimeTopic, endTimeTopic } = this.getTopics();

        return {
            start : this.validateValue(startTimeTopic?.value),
            end   : this.validateValue(endTimeTopic?.value)
        };
    }

    setValue = ({ topic, field, value }) =>  {
        const { setValue } = this.props;
        const { hardwareType, propertyType, deviceId, nodeId, propertyId } = topic;

        setValue({ hardwareType, propertyType, deviceId, nodeId, propertyId, field, value });
    }

    transformCronToString = (value, label) => {
        if (!value) return '';

        try {
            const cronExpToString = cronstrue.toString(value, {
                use24HourTimeFormat     : true,
                dayOfWeekStartIndexZero : true
            });

            return `${label}: ${cronExpToString}`;
        } catch (e) {
            return `${label}: invalid`;
        }
    }

    validateValue = value => {
        try {
            if (value !== null) {
                const splitValue = value.split(' ');

                if (splitValue.length !== 5) {
                    throw new Error('Invalid cron expression; Should contains 5 values.');
                }

                CronValidator.validateString(value);

                return value;
            }
        } catch (e) {
            return null;
        }
    }

    renderField = () => {
        const { start, end } = this.state.timePeriod || {};

        const startCron = this.transformCronToString(start, 'Start time');
        const endCron = this.transformCronToString(end, 'End time');

        return (
            <div className={styles.fieldWrapper}>
                <InputsRow
                    startValue={startCron}
                    endValue={endCron}
                    onOpenModal={this.handleOpenModal}
                    isInvisible
                />
            </div>
        );
    }

    render() {
        const { isEditMode } = this.props;
        const { isOpen, timePeriod } = this.state;
        const { startTimeTopic, endTimeTopic } = this.getTopics();

        const isProcessing = startTimeTopic?.isValueProcessing || endTimeTopic?.isValueProcessing;

        const scheduleWidgetCN = cx(styles.ScheduleWidget, {
            blur     : isProcessing,
            disabled : isEditMode
        });

        return (
            <div className={scheduleWidgetCN}>
                {
                    isProcessing
                        ? <div className={styles.ProcessingWrapper}>
                            <ProcessingIndicator size={35} />
                        </div>
                        : null
                }
                {
                    this.renderField()
                }

                <ScheduleModal
                    title='Schedule'
                    cronExpInterval={[ timePeriod ]}
                    isOpen={isOpen}
                    activeField={0}
                    onlyInterval
                    onClose={this.handleCloseModal}
                    onSubmit={this.handleSubmitModal}
                />
            </div>
        );
    }
}

export default ScheduleWidget;
