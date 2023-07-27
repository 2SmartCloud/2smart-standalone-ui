import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { default as MaterialModal } from '@material-ui/core/Modal'; // eslint-disable-line
import * as InterfaceActions from '../../actions/interface';
import globalEscHandler from '../../utils/globalEscHandler';


class Modal extends PureComponent {
    static propTypes = {
        isOpen     : PropTypes.bool.isRequired,
        onClose    : PropTypes.func.isRequired,
        children   : PropTypes.element.isRequired,
        openModal  : PropTypes.func.isRequired,  // eslint-disable-line
        closeModal : PropTypes.func.isRequired,
        className  : PropTypes.string
    };

    static defaultProps = {
        className : ''
    };

    componentDidMount() {
        const { isOpen } = this.props;

        if (isOpen) {
            document.body.classList.add('stopBouncing');
            globalEscHandler.register(this.props.onClose);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isOpen !== this.props.isOpen) {
            if (nextProps.isOpen) {
                document.body.classList.add('stopBouncing');
                globalEscHandler.register(this.props.onClose);
            } else {
                this.props.closeModal();
                document.body.classList.remove('stopBouncing');
                globalEscHandler.unregister(this.props.onClose);
            }
        }
    }

    componentWillUnmount() {
        globalEscHandler.unregister(this.props.onClose);
    }

    render() {
        const { isOpen, onClose, children, className } = this.props;

        return (
            <MaterialModal
                open={isOpen}
                onClose={onClose}
                className={className}
                disableEscapeKeyDown
            >
                <>
                    {children}
                </>
            </MaterialModal>
        );
    }
}


export default connect(null, { ...InterfaceActions })(Modal);
