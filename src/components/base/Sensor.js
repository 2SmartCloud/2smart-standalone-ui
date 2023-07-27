import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as HomieActions from '../../actions/homie';
import CriticalValue from './CriticalValue';
import IntegerControl from './controls/Integer';
import FloatControl from './controls/Float';
import BooleanControl from './controls/Boolean';
import StringControl from './controls/String';
import EnumControl from './controls/Enum';
import ColorControl from './controls/Color';

import styles from './Sensor.less';

const hardwareType = 'node';
const propertyType = 'sensors';

class Sensor extends PureComponent {
    static propTypes = {
        deviceId                         : PropTypes.string.isRequired,
        nodeId                           : PropTypes.string.isRequired,
        id                               : PropTypes.string.isRequired,
        name                             : PropTypes.string,
        value                            : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string, PropTypes.number ]),
        isSettable                       : PropTypes.bool,
        isRetained                       : PropTypes.bool,
        unit                             : PropTypes.string,
        dataType                         : PropTypes.string,
        setAsyncAttributeDispatcher      : PropTypes.func,
        format                           : PropTypes.string,
        isValueProcessing                : PropTypes.bool,
        isDisable                        : PropTypes.bool,
        removeAttributeErrorAndHideToast : PropTypes.func.isRequired,
        isError                          : PropTypes.bool
    }

    static defaultProps = {
        name                        : '—',
        value                       : '—',
        isSettable                  : false,
        isRetained                  : true,
        unit                        : '—',
        dataType                    : '',
        setAsyncAttributeDispatcher : () => {},
        format                      : '',
        isValueProcessing           : false,
        isDisable                   : false,
        isError                     : false
    }


    handleRemoveError = () => {
        const { deviceId, nodeId, id, removeAttributeErrorAndHideToast } = this.props;

        removeAttributeErrorAndHideToast({
            hardwareType,
            propertyType,
            field      : 'value',
            deviceId,
            nodeId,
            propertyId : id
        });
    }

    setValue = ({ value }) => {
        const { deviceId, nodeId, id, setAsyncAttributeDispatcher, isRetained } = this.props;

        setAsyncAttributeDispatcher({
            hardwareType,
            propertyType,
            field      : 'value',
            deviceId,
            nodeId,
            propertyId : id,
            value,
            isRetained
        });
    }


    renderControls = () => {
        const {
            deviceId,
            nodeId,
            id,
            dataType,
            unit,
            isSettable,
            isRetained,
            format,
            isValueProcessing,
            isError,
            value,
            isDisable,
            name
        } = this.props;

        switch (dataType) {
            case 'integer':
                return (
                    <div className={styles.baseWrapper}>
                        <IntegerControl
                            value={value || '—'}
                            unit={unit}
                            isSettable={isSettable}
                            setValue={this.setValue}
                            onErrorRemove={this.handleRemoveError}
                            floatRight
                            isTransparent
                            deviceId={deviceId}
                            nodeId={nodeId}
                            propertyId={id}
                            isError={isError}
                            isProcessing={isValueProcessing}
                            darkThemeSupport
                            baseControlClassName='NodeCard'
                        />
                    </div>
                );
            case 'float':
                return (
                    <div className={styles.baseWrapper}>
                        <FloatControl
                            value={value || '—'}
                            unit={unit}
                            isSettable={isSettable}
                            setValue={this.setValue}
                            floatRight
                            isTransparent
                            isError={isError}
                            onErrorRemove={this.handleRemoveError}
                            isProcessing={isValueProcessing}
                            deviceId={deviceId}
                            nodeId={nodeId}
                            propertyId={id}
                            darkThemeSupport
                            baseControlClassName='NodeCard'
                        />
                    </div>
                );
            case 'boolean':
                return (
                    <div className={styles.booleanControlWrapper}>
                        <BooleanControl
                            value={value}
                            unit={unit}
                            isSettable={isSettable}
                            isRetained={isRetained}
                            setValue={this.setValue}
                            onErrorRemove={this.handleRemoveError}
                            deviceId={deviceId}
                            nodeId={nodeId}
                            propertyId={id}
                            isDisable = {isDisable}
                            floatRight
                            nodeCard
                            isProcessing={isValueProcessing}
                        />
                    </div>
                );
            case 'string':
                return (
                    <div className={styles.baseWrapper}>
                        <StringControl
                            value={value || '—'}
                            unit={unit}
                            isSettable={isSettable}
                            setValue={this.setValue}
                            floatRight
                            isTransparent
                            isError={isError}
                            onErrorRemove={this.handleRemoveError}
                            isProcessing={isValueProcessing}
                            deviceId={deviceId}
                            nodeId={nodeId}
                            propertyId={id}
                            darkThemeSupport
                            baseControlClassName='NodeCard'
                        />
                    </div>
                );
            case 'enum':
                return (
                    <div className={styles.enumWrapper}>
                        <EnumControl
                            value={value || '—'}
                            name={name}
                            unit={unit}
                            deviceId={deviceId}
                            nodeId={nodeId}
                            propertyId={id}
                            isSettable={isSettable}
                            onErrorRemove={this.handleRemoveError}
                            setValue={this.setValue}
                            options={format}
                            floatRight
                            nodeCard
                            isProcessing={isValueProcessing}
                            darkThemeSupport
                        />
                    </div>
                );
            case 'color':
                return (
                    <div className={styles.colorWrapper}>
                        <ColorControl
                            onErrorRemove={this.handleRemoveError}
                            value={value || ''}
                            isSettable={isSettable}
                            options={format}
                            setValue={this.setValue}
                            floatRight
                            deviceId={deviceId}
                            nodeId={nodeId}
                            propertyId={id}
                            isProcessing={isValueProcessing}
                            isError={isError}
                        />
                    </div>
                );
            default:
                return <CriticalValue value={value} className={styles.value} />;
        }
    }

    render() {
        const { name } = this.props;

        return (
            <div className={styles.Sensor}>
                <CriticalValue value={name || '—'} maxWidth='48%' className={styles.name} />
                {this.renderControls()}
            </div>
        );
    }
}


export default connect(null, { ...HomieActions })(Sensor);
