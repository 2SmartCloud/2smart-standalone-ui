import React, { PureComponent, Fragment } from 'react';
import { connect }                        from 'react-redux';
import classnames                         from 'classnames/bind';
import PropTypes                          from 'prop-types';

import styles                             from './ToastContent.less';

const cx = classnames.bind(styles);

class ToastContent extends PureComponent {
    handleReloadButtonClick() {
        location.reload();
    }

    shouldRenderReloadButton = () => {
        const { meta, withReload, lastToastMeta } = this.props;
        const shouldRender = meta === lastToastMeta && withReload;

        return shouldRender;
    }

    renderControls = (controls) => {
        return (
            <div className={styles.controlsWrapper}>
                { controls.map(control => (
                    <button
                        key       = {control.label}
                        className = {cx(styles.control, { [control.type]: control.type })}
                        onClick   = {control.handleClick}
                    >
                        <span>{control.label}</span>
                    </button>
                )) }

            </div>
        );
    }

    render() {
        const { title, deviceName, message, controls } = this.props;
        const shouldRenderButton = this.shouldRenderReloadButton();

        return (
            <Fragment>
                <div className={styles.deviceName}>{deviceName}</div>
                <div className={styles.title}>{title}</div>
                { message && <div className={styles.message}>{message}</div>}
                {
                    shouldRenderButton ?
                        <button
                            className={styles.control}
                            onClick={this.handleReloadButtonClick}
                        >
                            <span>Reload</span> <div className={styles.reloadIcon} />
                        </button> :
                        null
                }
                { controls
                    ? this.renderControls(controls)
                    : null
                }
            </Fragment>
        );
    }
}

ToastContent.propTypes = {
    title         : PropTypes.string.isRequired,
    message       : PropTypes.string.isRequired,
    deviceName    : PropTypes.string.isRequired,
    meta          : PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]).isRequired,
    lastToastMeta : PropTypes.string.isRequired,
    withReload    : PropTypes.bool,
    controls      : PropTypes.arrayOf({
        label   : PropTypes.string.isRequired,
        onClick : PropTypes.func.isRequired
    })
};

ToastContent.defaultProps = {
    withReload : true,
    controls   : void 0
};

function mapStateToProps(state) {
    return {
        lastToastMeta : state.applicationInterface.lastToastMeta,
        toasts        : state.applicationInterface.activeToasts
    };
}

export default connect(mapStateToProps)(ToastContent);
