import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import getPropertyUnit          from '../../utils/getPropertyUnit';
import Switch                   from './Switch';
import CriticalValue            from './CriticalValue';
import styles                   from './GenericToggle.less';

const cn = classnames.bind(styles);

class GenericToggle extends PureComponent {
    static propTypes = {
        value        : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]).isRequired,
        unit         : PropTypes.string,
        isSettable   : PropTypes.bool,
        isProcessing : PropTypes.bool,
        floatRight   : PropTypes.bool,
        className    : PropTypes.string,
        onToggle     : PropTypes.func.isRequired
    }

    static defaultProps = {
        unit         : '',
        className    : '',
        isSettable   : false,
        isProcessing : false,
        floatRight   : false
    }

    handleSwitchToggle = () => {
        const { value, onToggle } = this.props;
        const nextValue = !this.getValueChecked(value);

        onToggle({ value: `${nextValue}` });
    }

    handleStopPropagation = e => e.stopPropagation()

    getValueChecked = value => typeof value === 'boolean' ? value : value === 'true'

    render() {
        const {
            value,
            unit,
            isSettable,
            isProcessing,
            floatRight,
            className
        } = this.props;

        const GenericToggleCN = cn('GenericToggle', {
            floatRight,
            [className] : className
        });

        return (
            <div className={GenericToggleCN} onClick={this.handleStopPropagation}>
                <Switch
                    checked={this.getValueChecked(value)}
                    onChange={this.handleSwitchToggle}
                    disabled={!isSettable || isProcessing}
                    isProcessing={isProcessing}
                />
                {
                    unit ?
                        <div className={styles.criticalValueWrapper}>
                            <CriticalValue value={getPropertyUnit(unit)} maxWidth='100%' className={styles.unit} />
                        </div> :
                        null
                }
            </div>
        );
    }
}

export default GenericToggle;
