import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './PushButton.less';

const cn = classnames.bind(styles);

class PushButton extends PureComponent {
    static propTypes = {
        onClick      : PropTypes.func,
        isProcessing : PropTypes.bool,
        isDisable    : PropTypes.bool,
        className    : PropTypes.string
    };

    static defaultProps = {
        onClick      : () => {},
        isProcessing : false,
        isDisable    : false,
        className    : ''
    };

    constructor(props) {
        super(props);
        this.timeout = null;
    }

    state = {
        isProcessing : this.props.isProcessing
    }

    componentDidUpdate(prevProps) {
        const { isProcessing } = this.props;
        const { isProcessing: prevIsProcessing } = prevProps;

        if (isProcessing && !prevIsProcessing) {
            this.timeout = setTimeout(() => this.setState({ isProcessing: true }), 1000);
        } else if (prevIsProcessing && !isProcessing) {
            this.setState({ isProcessing: false });
            clearTimeout(this.timeout);
        }
    }


    render() {
        const { onClick, isDisable, className } = this.props;
        const { isProcessing } = this.state;
        const ButtonCN = cn('PushButton', { [className]: className });

        return (
            <button
                className={ButtonCN}
                disabled={isDisable || isProcessing}
                onClick={onClick}
            >
                {
                    isProcessing
                        ? <CircularProgress
                            size={20} thickness={6} color='inherit'
                        />
                        : 'Push'
                }
            </button>
        );
    }
}


export default PushButton;
