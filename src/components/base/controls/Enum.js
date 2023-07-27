/* eslint-disable react/jsx-handler-names */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { connect } from 'react-redux';
import ProcessingIndicator from '../../base/ProcessingIndicator';
import Select from '../select/BaseSelect';
import * as HomieActions from '../../../actions/homie';
import * as InterfaceActions from '../../../actions/interface';
import CriticalValue from '../CriticalValue';

import styles from './Enum.less';

const cn = classnames.bind(styles);

const COLOR_BORDER = '#ECECEC';
const HOVERED_BORDER = '#b3b3b3';

const customStyles = {
    container : {
        width                       : '100%',
        minWidth                    : '105px',
        '@media (max-width: 420px)' : {
            minWidth : 'unset'
        }
    },
    control : {
        cursor          : 'pointer',
        maxWidth        : '100%',
        borderColor     : COLOR_BORDER,
        transition      : 'border-color 0.3s ease-in-out',
        '&:hover'       : { borderColor: HOVERED_BORDER },
        boxShadow       : '#000',
        backgroundColor : 'transparent',
        height          : '35px',
        minHeight       : '35px',
        minWidth        : 'unset'
    },
    input : {
        fontSize : '12px',
        color    : '#1e1e1e'
    },
    option : {
        fontWeight      : '700',
        backgroundColor : '#FFF'
    },
    menu : {
        right                       : 0,
        minWidth                    : '200px',
        '@media (max-width: 420px)' : {
            minWidth : '140px'
        }
    },
    singleValue : {
        color      : '#1e1e1e',
        fontSize   : '12px',
        fontWeight : '700'
    },
    menuList : {
        maxHeight                    : '140px',
        padding                      : 0,
        margin                       : '15px 5px 15px 15px',
        paddingRight                 : '11px',
        overflowX                    : 'hidden',
        '@media (max-height: 500px)' : {
            maxHeight : '100px'
        }
    },
    indicatorsContainer : {
        height : '33px'
    }
};


class EnumControl extends PureComponent {
    constructor(props) {
        super(props);
        this.processingTimeout = undefined;
    }

    state={
        isProcessing : false,
        isLocked     : false
    }

    componentDidUpdate(prevProps) {
        this.handleProcessing(prevProps);
    }

    componentWillUnmount() {
        this.clearTimeout();
    }


    handleClick = e => {
        e.stopPropagation();
    }


    handleSetValue =(value) => {
        this.setState({
            isLocked : true
        });
        this.props.setValue(value);
    }

    handleProcessing = (prevProps) => {
        const { isProcessing } = this.props;
        const prevIsProcessing = prevProps.isProcessing;

        const processing = isProcessing && !prevIsProcessing;
        const processed = prevIsProcessing && !isProcessing;

        if (processing) {
            this.processingTimeout = setTimeout(() => this.setState({ isProcessing: true }), 1000);
        }

        if (processed) {
            this.clearTimeout();
            this.setState({
                isProcessing : false,
                isLocked     : false
            });
        }
    }


    clearTimeout = () => {
        clearTimeout(this.processingTimeout);
        this.processingTimeout = null;
    }

    transformValues = () => {
        const { options } = this.props;

        return options.split(',').map(val => {
            return ({ value: val, label: val });
        });
    }

    renderEnumControl=() => {
        const options = this.transformValues();
        const { value,  unit, isSettable, name, selectStyles } = this.props;
        const { isLocked } = this.state;
        const selectCustomStyles = {
            ...customStyles,
            option : {
                ... customStyles.option,
                ... selectStyles.option
            }
        };

        return (
            <>
                {
                    isSettable ?
                        <div className={styles.selectWrapper} onClick={this.handleClick}>
                            <Select
                                isDisabled = {isLocked}
                                mobileTitle={name}
                                options={options}
                                onChange={this.handleSetValue}
                                placeholder={value}
                                maxSelectHeight={186}
                                settings={{
                                    defaultOptions : true,
                                    isSearchable   : false,
                                    value          : {
                                        value,
                                        label : value
                                    }
                                }}
                                noPortalTarget={false}
                                closeOnScroll
                                styles={selectCustomStyles}
                                darkThemeSupport
                            />
                        </div>
                        : <CriticalValue value={value} maxWidth='85%' className={styles.value} />
                }
                {
                    unit ?
                        <div className={styles.unitWrapper}>
                            <CriticalValue value={unit} maxWidth='100%' className={styles.unit} />
                        </div> : null
                }
            </>
        );
    }

    render() {
        const {  floatRight, isProcessing:propIsProcessing } = this.props;
        const { isProcessing } = this.state;
        const EnumControlCN = cn('EnumControl', {
            right : floatRight
        });

        return (
            <div className={EnumControlCN} ref={node => this.control = node}>
                {
                    isProcessing || propIsProcessing ?
                        <ProcessingIndicator />
                        : this.renderEnumControl()
                }
            </div>
        );
    }
}

EnumControl.propTypes = {
    name         : PropTypes.string,
    value        : PropTypes.string.isRequired,
    options      : PropTypes.string.isRequired,
    isSettable   : PropTypes.bool.isRequired,
    isProcessing : PropTypes.bool,
    setValue     : PropTypes.func,
    unit         : PropTypes.string,
    floatRight   : PropTypes.bool,
    selectStyles : PropTypes.shape({
        option : PropTypes.string
    })
};

EnumControl.defaultProps = {
    name         : '',
    setValue     : () => {},
    unit         : '',
    isProcessing : false,
    floatRight   : false,
    selectStyles : {
        option : {}
    }
};

export default connect(null, { ...InterfaceActions, ...HomieActions })(EnumControl);
