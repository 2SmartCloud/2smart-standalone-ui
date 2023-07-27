import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import CircularProgress         from '@material-ui/core/CircularProgress';

import getPropertyUnit          from '../../../utils/getPropertyUnit';

import CriticalValue            from '../../base/CriticalValue';

import styles                   from './TumblerWidget.less';

const cx = classnames.bind(styles);

class TumblerWidget extends PureComponent {
    static propTypes = {
        value        : PropTypes.string,
        unit         : PropTypes.string,
        isSettable   : PropTypes.bool.isRequired,
        isEditMode   : PropTypes.bool.isRequired,
        isLocked     : PropTypes.bool,
        isProcessing : PropTypes.bool,
        onSetValue   : PropTypes.func.isRequired
    }

    static defaultProps = {
        value        : '',
        unit         : null,
        isProcessing : false,
        isLocked     : false
    }

    handleClick = () => {
        const { onSetValue, isProcessing, isSettable, isEditMode, value } = this.props;

        if (isProcessing || !isSettable || isEditMode) return;

        onSetValue(!this.getValueChecked(value));
    }

    getValueChecked = value =>  value
        ? !(value === 'false' || value === '0' || value === '—' || value === '-')
        : value;

    render() {
        const { value, isProcessing, isSettable, isEditMode, isLocked, unit } = this.props;
        const tumblerCN = cx(styles.Tumbler, {
            active     : this.getValueChecked(value),
            processing : isProcessing,
            disabled   : !isSettable || isEditMode || isLocked || isProcessing
        });

        return (
            <div className={styles.tumblerWrapper}>
                <div className={tumblerCN} onClick={this.handleClick}>
                    <div className={styles.sectionOff}>
                        { isProcessing
                            ? (
                                <div className={styles.loaderWrapper}>
                                    <CircularProgress
                                        size={17} thickness={7} color='inherit'
                                        classes={{
                                            svg : styles.loaderOff
                                        }}
                                    />
                                </div>
                            ) : null
                        }
                    </div>
                    <div className={styles.sectionOn}>
                        { isProcessing
                            ? (
                                <div className={styles.loaderWrapper}>
                                    <CircularProgress
                                        size={17} thickness={7} color='inherit'
                                        classes={{
                                            svg : styles.loaderOn
                                        }}
                                    />
                                </div>
                            ) : null
                        }
                    </div>
                </div>
                {
                    unit ?
                        <CriticalValue value={getPropertyUnit(unit)} className={styles.unit} /> :
                        null
                }
            </div>
        );
    }
}

export default TumblerWidget;
