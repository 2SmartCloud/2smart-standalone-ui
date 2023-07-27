import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { default as MaterialSwitch } from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './Switch.less';

const cn = classnames.bind(styles);

class Switch extends PureComponent {
    static propTypes = {
        checked      : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]).isRequired,
        disabled     : PropTypes.bool,
        onChange     : PropTypes.func,
        isProcessing : PropTypes.bool
    }

    static defaultProps = {
        disabled     : false,
        isProcessing : false,
        onChange     : undefined
    }

    state = {
        isProcessing : this.props.isProcessing,
        timeout      : null
    }

    componentWillReceiveProps(nextProps) {
        const { isProcessing: nextIsProcessing } = nextProps;
        const { isProcessing } = this.props;

        if (nextIsProcessing && !isProcessing) {
            const timeout = setTimeout(() => this.setState({ isProcessing: true }), 1000);

            this.setState({ timeout });
        } else if (!nextIsProcessing && isProcessing) {
            this.setState({ isProcessing: false });
            clearTimeout(this.state.timeout);
        }
    }

    render() {
        const { checked, disabled, onChange } = this.props;
        const { isProcessing } = this.state;
        const thumbCN = cn('thumb', { processing: isProcessing });

        return (
            <div className={styles.Switch}>
                {
                    isProcessing ?
                        <div className={cn('loaderWrapper', { checked })}>
                            <CircularProgress
                                size={18} thickness={6} color='inherit'
                                classes={{
                                    svg : styles.progressSvg
                                }}
                            />
                        </div> :
                        null
                }
                <MaterialSwitch
                    checked={checked}
                    disabled={disabled}
                    onChange={onChange}
                    disableRipple
                    classes={{
                        root       : styles.root,
                        switchBase : styles.switchBase,
                        thumb      : thumbCN,
                        track      : styles.track,
                        checked    : styles.checked,
                        disabled   : styles.disabled
                    }}
                />
            </div>
        );
    }
}

export default Switch;
