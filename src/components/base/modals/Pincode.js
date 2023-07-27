import React, { PureComponent } from 'react';
import { connect }              from 'react-redux';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import IconButton               from '@material-ui/core/IconButton';
import { Close }                from '@material-ui/icons';
import { MAX_MOBILE_WIDTH }     from '../../../assets/constants';
import * as InterfaceActions    from '../../../actions/interface';
import * as UserActions         from '../../../actions/user';
import DeleteIcon               from '../icons/Delete';
import ProcessingIndicator      from '../ProcessingIndicator';
import { isTouchDevice }        from '../../../utils/detect';
import styles                   from './Pincode.less';

const cn = classnames.bind(styles);

const isMobile = window.innerWidth <= MAX_MOBILE_WIDTH;

class PincodeModal extends PureComponent {
    state = {
        pincode        : '',
        error          : '',
        isProcessing   : false,
        ripplingButton : null
    }

    componentDidMount() {
        this.setInputFocusByIndex(0);
    }

    componentWillReceiveProps() {
        this.setState({ pincode: '', error: '' });
    }

    handleButtonClick = (item) => {
        if (!isMobile) {
            this.setState({
                ripplingButton : item
            });
        } else {
            document.activeElement.blur();
        }

        this.setPincode(item);
    }

    handleCloseButtonClick = () => {
        const { hidePinForm } = this.props;

        hidePinForm();
    }

    handleInputChange = (e) => {
        const { value } = e.target;

        if (/^\d*$/.test(value)) {
            this.setPincode(value ||  'delete');
        }
    }

    handleInputKeyDown = (e) => {
        const { keyCode } = e;

        if (keyCode === 46 || keyCode === 8) {
            this.setPincode('delete');
        }
    }

    setInputFocusByIndex = (index = '0') => {
        if (isMobile) return;
        const element = this[`input-${index}`];

        if (!element) return;
        element?.focus();
    }

    setPincode = (item) => { //eslint-disable-line
        const { pincode, error, isProcessing } = this.state;

        if (isProcessing) return;

        if (error) this.setState({ error: '' });
        let nextPincode = '';

        if (item !== 'delete') {
            nextPincode = pincode.concat(item);

            this.setState({ pincode: nextPincode });

            if (nextPincode.length === 6) {
                this.submit(nextPincode);
                this.setState({ pincode: '' });
            }
        } else {
            if (pincode.length === 0) return;
            nextPincode = pincode.substring(0, pincode.length - 1);

            this.setState({
                pincode : nextPincode
            });
        }

        if (!isMobile) {
            let nextIndex = nextPincode?.length ? nextPincode?.length : 0;

            if (nextIndex === 6) nextIndex = 0; // last symbol -> go to start
            this.setInputFocusByIndex(nextIndex);
        }
    }

    submit = async (nextPincode) => {
        const { onSubmit, getClientPanelAccess } = this.props;

        this.setState({
            isProcessing : true
        });

        try {
            await getClientPanelAccess(nextPincode);
            this.setState({
                isProcessing : false
            });
            onSubmit();
        } catch (error) {
            this.setState({
                error        : 'PIN is incorrect',
                isProcessing : false
            });

            throw error;
        } finally {
            this.setInputFocusByIndex(0);
        }
    }

    renderButtons = () => {
        const { pincode, ripplingButton } = this.state;
        const labels = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' ];

        if (pincode) {
            labels.push('delete');
        }


        return labels.map((item, index) => {
            const isDelete = item === 'delete';
            const isRipple = isMobile
                ? false
                : ripplingButton === item && !isDelete;
            const className = cn('button', { null: item === '0', delete: isDelete, ripple: isRipple });
            const content = isDelete ? <DeleteIcon /> : item;

            return (
                <button     // eslint-disable-next-line react/no-array-index-key
                    key       = {index}
                    className = {className}
                    onClick   = {this.handleButtonClick.bind(this, item)}
                >
                    {content}
                </button>
            );
        });
    }


    renderPincode = () => {
        const { pincode, isProcessing } = this.state;
        const pincodeArray = pincode.split('');

        return (new Array(6)).fill('').map((item, index) => {
            return (     // eslint-disable-next-line react/no-array-index-key
                <div key={index} className={styles.pincodeChar}>
                    <input
                        className = {styles.pincodeInput}
                        value     = {pincodeArray[index] || ''}
                        type      = 'password'
                        disabled  = {isProcessing}
                        ref       = {node => this[`input-${index}`]  = node}
                        onKeyDown = {this.handleInputKeyDown}
                        maxLength = {1}
                        onChange  = {this.handleInputChange}
                        readOnly  = {isTouchDevice()}
                    />
                </div>
            );
        });
    }


    render() {
        const { error, isProcessing } = this.state;
        const { isCloseable } = this.props;
        const PincodeModalCN = cn('PincodeModal', { processing: isProcessing });

        return (
            <div className={PincodeModalCN}>
                {
                    isCloseable ?
                        <IconButton
                            className = {styles.closeButton}
                            disableFocusRipple
                            disableRipple
                            onClick   = {this.handleCloseButtonClick}
                        >
                            <Close />
                        </IconButton> :
                        null
                }
                <h1 className={styles.title}>Enter code - password</h1>
                <h2 className={styles.subTitle}>Enter code to unlock this section</h2>
                <div className={styles.pincodeContainer}>
                    {this.renderPincode()}
                </div>
                <div className={styles.errorMessage}>
                    {error}
                </div>
                <div className={styles.buttonsContainer}>
                    {this.renderButtons()}
                </div>
                {
                    isProcessing ?
                        <div className={styles.overflow}>
                            <ProcessingIndicator size='45px' />
                        </div> :
                        null
                }
                <div className={styles.warning}>Rotate device to enter PIN</div>
            </div>
        );
    }
}


PincodeModal.propTypes = {
    hidePinForm          : PropTypes.func.isRequired,
    onSubmit             : PropTypes.func,
    isCloseable          : PropTypes.bool,
    getClientPanelAccess : PropTypes.func.isRequired
};

PincodeModal.defaultProps = {
    isCloseable : true,
    onSubmit    : () => {}
};

export default connect(
    null,
    {
        ...InterfaceActions,
        ...UserActions
    })(PincodeModal);
