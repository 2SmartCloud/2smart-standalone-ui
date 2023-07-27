import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import * as HomieActions from '../../../actions/homie';
import * as InterfaceActions from '../../../actions/interface';
import CriticalValue from '../CriticalValue';
import Switch from '../../base/Switch';
import PushButton from '../../base/PushButton';
import getPropertyUnit from '../../../utils/getPropertyUnit';

import styles from './Boolean.less';

const cn = classnames.bind(styles);

class Boolean extends PureComponent {
    static propTypes = {
        value         : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]).isRequired,
        isSettable    : PropTypes.bool.isRequired,
        setValue      : PropTypes.func,
        unit          : PropTypes.string,
        floatRight    : PropTypes.bool,
        onErrorRemove : PropTypes.func,
        isDisable     : PropTypes.bool,
        isRetained    : PropTypes.bool,
        isProcessing  : PropTypes.bool
    };

    static defaultProps = {
        setValue      : () => {},
        onErrorRemove : () => {},
        unit          : '',
        floatRight    : false,
        isDisable     : false,
        isRetained    : false,
        isProcessing  : false
    };

    constructor(props) {
        super(props);

        this.state = {
            checked : typeof props.value === 'boolean' ? props.value : props.value === 'true'
        };
        this.timeout = null;
    }

    componentWillReceiveProps(nextProps) {
        const { value } = nextProps;

        this.setState({
            checked : value === 'true'
        });
    }

    handleSwitchToggle = () => {
        this.props.onErrorRemove();

        const checked = !this.state.checked;

        this.props.setValue({ value: `${checked}` });

        this.setState({
            checked
        });
    }

    handleNotRetainedPush   =() => {
        this.props.onErrorRemove();

        this.props.setValue({ value: 'true' });
    }

    handleControlClick = (e) => {
        e.stopPropagation();
    }

    render() {
        const { isSettable, unit, floatRight, isDisable, isRetained, isProcessing } = this.props;
        const { checked } = this.state;
        const BooleanControlCN = cn('BooleanControl', { floatRight });


        return (
            <div className={BooleanControlCN}>
                <div  onClick={this.handleControlClick}>
                    {
                        isRetained
                            ? <Switch
                                checked={checked}
                                onChange={this.handleSwitchToggle}
                                disabled={!isSettable || isProcessing || isDisable}
                                isProcessing={isProcessing}
                            />
                            : <PushButton
                                onClick={this.handleNotRetainedPush}
                                isDisable={!isSettable || isProcessing || isDisable}
                                isProcessing={isProcessing}
                            />
                    }
                </div>
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

export default connect(null, { ...HomieActions, ...InterfaceActions })(Boolean);
