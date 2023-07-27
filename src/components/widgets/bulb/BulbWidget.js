import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';

import getPropertyUnit  from '../../../utils/getPropertyUnit';


import BulbIcon from '../../base/icons/BulbIcon';
import Slider   from '../../base/Slider';


import styles from './BulbWidget.less';

class BulbWidget extends PureComponent {
    static propTypes = {
        setValue     : PropTypes.func.isRequired,
        properties   : PropTypes.array.isRequired,
        isEditMode   : PropTypes.bool.isRequired,
        isProcessing : PropTypes.bool.isRequired,
        advanced     : PropTypes.shape({
            minValue : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
            maxValue : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
            step     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
        }).isRequired
    }

    static defaultProps = {
    }

    constructor(props) {
        super(props);

        const { properties } = this.props;
        const brightnessLevelTopic = properties.find(property => property?.order === 1);
        const bulbStateTopic = properties.find(property => property?.order === 0);
        const { value } = bulbStateTopic;
        const bulbStateValue = this.getValueChecked(value);
        const brightness = brightnessLevelTopic && bulbStateValue ?
            this.getBulbBrightness(brightnessLevelTopic?.value) : 1;

        this.state =  {
            brightness
        };
    }

    componentDidUpdate(prevProps) {
        const prevProperties = prevProps.properties;
        const prevBrightnessLevelTopic = prevProperties.find(property => property?.order === 1);

        const { properties } = this.props;
        const brightnessLevelTopic = properties.find(property => property?.order === 1);

        if (prevBrightnessLevelTopic?.value !== brightnessLevelTopic?.value) {
            const brightness = brightnessLevelTopic ?
                this.getBulbBrightness(brightnessLevelTopic?.value) : 1;

            this.setState({
                brightness
            });
        }
    }

    handleSetBulbState = () => {
        const { properties, isEditMode } = this.props;
        const bulbStateTopic = properties.find(property => property?.order === 0);
        const brightnessLevelTopic = properties.find(property => property?.order === 1);
        const { isValueProcessing, settable, value } = bulbStateTopic;
        const bulbStateValue = this.getValueChecked(value);
        const isBrightnessLevelProcessing = brightnessLevelTopic?.isValueProcessing;

        if (isValueProcessing || isEditMode || !settable || isBrightnessLevelProcessing) return;

        this.setValue({ topic: bulbStateTopic, field: 'value', value: !bulbStateValue });
        const braghtnessToSet = !brightnessLevelTopic ?
            1 : this.getBulbBrightness(brightnessLevelTopic?.value);

        this.setState({
            brightness : braghtnessToSet
        });
    }

    handleSetBrightnessLevel = (value) => {
        const { properties, isEditMode } = this.props;
        const brightnessLevelTopic = properties.find(property => property?.order === 1);
        const { isValueProcessing, settable } = brightnessLevelTopic;

        if (isValueProcessing || isEditMode || !settable) return;
        this.setValue({ topic: brightnessLevelTopic, field: 'value', value });
    }

    setValue=({ topic, field, value }) =>  {
        const { setValue } = this.props;
        const { hardwareType, propertyType, deviceId, nodeId, propertyId } = topic;

        setValue({ hardwareType, propertyType, deviceId, nodeId, propertyId, field, value });
    }

    getValueChecked = value =>  value
        ? !(value === 'false' || value === '0' || value === '—' || value === '-')
        : value;

    getBulbBrightness = value => {
        const { advanced: { minValue, maxValue } } = this.props;

        return (value - minValue) / (maxValue - minValue);
    }

    renderSlider = () => {
        const { properties, isProcessing, ...rest } = this.props;
        const bulbStateTopic = properties.find(property => property?.order === 0);
        const bulbStateValue = this.getValueChecked(bulbStateTopic?.value);
        const brightnessLevelTopic = properties.find(property => property?.order === 1);
        const isBulbStateProcessing = bulbStateTopic?.isValueProcessing;
        const { unit, isValueProcessing, settable } = brightnessLevelTopic;

        return (
            <Slider
                className    = {styles.slider}
                isProcessing = {isValueProcessing || isProcessing || isBulbStateProcessing}
                value        = {brightnessLevelTopic?.value}
                isDisabled   = {!settable || isBulbStateProcessing || !bulbStateValue || isValueProcessing}
                unit         = {getPropertyUnit(unit)}
                onSetValue   = {this.handleSetBrightnessLevel}
                {...rest}
            />
        );
    }

    render() {
        const { properties, isEditMode } = this.props;
        const bulbStateTopic = properties.find(property => property?.order === 0);
        const brightnessLevelTopic = properties.find(property => property?.order === 1);
        const {
            settable,
            isValueProcessing,
            value
        } = bulbStateTopic;
        const bulbStateValue = this.getValueChecked(value);
        const isBrightnessLevelProcessing = brightnessLevelTopic?.isValueProcessing;

        return (
            <div className={styles.BulbWidget}>
                <div className={styles.bulbWrapper}>
                    <BulbIcon
                        isDisabled   = {!settable || isEditMode}
                        isDark       = {!bulbStateValue}
                        isProcessing = {isValueProcessing || isBrightnessLevelProcessing}
                        onToggle     = {this.handleSetBulbState}
                        opacity      = {this.state.brightness}
                    />
                </div>
                {
                    brightnessLevelTopic ?
                        this.renderSlider()
                        : null
                }
            </div>
        );
    }
}

export default BulbWidget;
