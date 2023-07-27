import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import ProcessingIndicator      from '../../base/ProcessingIndicator';
import Icon                     from '../../base/Icon';

import styles                   from './AlarmWidget.less';

const cx = classnames.bind(styles);

const mapStateToControls = {
    armed : {
        controlsButtons : [ 'disarmed', 'panic' ],
        stateLabel      : 'armed'
    },
    disarmed : {
        controlsButtons : [ 'armed', 'panic' ],
        stateLabel      : 'disarmed'
    },
    danger : {
        controlsButtons : [ 'disarmed', 'panic' ],
        stateLabel      : 'danger detected'
    }
};

const mapControlStateToControlLabel = {
    armed    : 'Arm',
    disarmed : 'Disarm',
    panic    : 'Panic'
};


class AlarmWidget extends PureComponent {
    static propTypes = {
        setValue   : PropTypes.func.isRequired,
        properties : PropTypes.array.isRequired,
        isEditMode : PropTypes.bool.isRequired
    };


    handleControlClick =(controlKey) => () => {
        const { properties } = this.props;

        const alarmStateTopic = properties.find(property => property.order === 0);
        const alarmButtonTopic = properties.find(property => property.order === 2);

        switch (controlKey) {
            case  'armed':
                this.setValue({ topic: alarmStateTopic, field: 'value', value: true });
                break;
            case  'disarmed':
                this.setValue({ topic: alarmStateTopic,  field: 'value', value: false });
                break;
            case  'panic':
                this.setValue({ topic: alarmButtonTopic, field: 'value', value: true });
                break;
            default:
                break;
        }
    }

    setValue=({ topic, field, value }) =>  {
        const {  setValue } = this.props;
        const { hardwareType, propertyType, deviceId, nodeId, propertyId } = topic;

        setValue({ hardwareType, propertyType, deviceId, nodeId, propertyId, field, value });
    }

    getConfiguration = () => {
        let state = '';
        const { properties } = this.props;
        const alarmStateTopic = properties.find(property => property.order === 0);
        const emergencyTopic = properties.find(property => property.order === 1);
        const alarmButtonTopic = properties.find(property => property.order === 2);

        if (emergencyTopic?.value === 'true') {
            state = 'danger';
        } else {
            state = alarmStateTopic?.value === 'true' ? 'armed' : 'disarmed';
        }
        const { controlsButtons } = mapStateToControls[state];
        const filteredControls = alarmButtonTopic
            ? controlsButtons
            : controlsButtons?.filter(control => control !== 'panic');

        return { state, controlsButtons: filteredControls };
    }

    renderControls = controls => controls.map(
        controlKey => (
            <div
                className = {cx(styles.control, [ controlKey ], {
                    singleControl : controls?.length === 1
                })}
                onClick   = {this.handleControlClick(controlKey)}
                key       = {controlKey}
            >
                <div className={styles.iconWrapper}>
                    <Icon type={controlKey} />
                </div>
                <p className={styles.label}>
                    {mapControlStateToControlLabel[controlKey]}
                </p>
            </div>
        ))


    renderAlarmWidget = () => {
        const { state, controlsButtons } = this.getConfiguration();
        const isNotDangerState = [ 'armed', 'disarmed' ].includes(state);
        const stateLabelCN = cx(styles.stateLabel, [ state ]);
        const { stateLabel } = mapStateToControls[state];

        return (
            <>
                <div  className={styles.stateWrapper} >
                    <div className={styles.stateIcon}>
                        <Icon type={state} />
                    </div>
                    <div className={styles.systemLabelsWrapper}>
                        {isNotDangerState &&  <span className={styles.systemLabel}>System</span>}
                        <span className={stateLabelCN}>{stateLabel}</span>
                    </div>
                </div>
                <div className={styles.controlsWrapper}>
                    {this.renderControls(controlsButtons)}
                </div>
            </>
        );
    }

    render() {
        const { isEditMode, properties } = this.props;
        const alarmStateTopic = properties.find(property => property.order === 0);
        const isProcessing =  alarmStateTopic?.isValueProcessing;
        const isWidgetDisabled = isEditMode;
        const alarmWidgetCN = cx(styles.AlarmWidget, { blur: isProcessing }, { disabled: isWidgetDisabled });

        return (
            <div className={alarmWidgetCN}>
                {isProcessing &&
                <div className={styles.ProcessingWrapper}>
                    <ProcessingIndicator size={35} />
                </div>}
                {this.renderAlarmWidget()}
            </div>
        );
    }
}
export default AlarmWidget;
