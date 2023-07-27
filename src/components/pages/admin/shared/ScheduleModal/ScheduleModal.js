import React, {
    PureComponent,
    Fragment
}                     from 'react';
import PropTypes      from 'prop-types';
import { Close }      from '@material-ui/icons';
import IconButton     from '@material-ui/core/IconButton';

import Modal          from '../../../../base/Modal';
import ScheduleEditor from './ScheduleEditor';

import styles         from './ScheduleModal.less';

class ScheduleModal extends PureComponent {
    static propTypes = {
        title           : PropTypes.string,
        isOpen          : PropTypes.bool,
        onlyInterval    : PropTypes.bool,
        cronExpression  : PropTypes.string,
        activeField     : PropTypes.number,
        cronExpInterval : PropTypes.array,
        onClose         : PropTypes.func.isRequired,
        onSubmit        : PropTypes.func.isRequired
    }

    static defaultProps = {
        cronExpression  : '',
        title           : '',
        activeField     : null,
        cronExpInterval : null,
        isOpen          : false,
        onlyInterval    : false
    }

    render() {
        const { title, isOpen, cronExpression, activeField,
            onClose, onlyInterval, cronExpInterval, onSubmit } = this.props;

        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <Fragment>
                    <div className={styles.Modal}>
                        <IconButton
                            className = {styles.closeButton}
                            disableFocusRipple
                            disableRipple
                            onClick   = {onClose}
                        >
                            <Close />
                        </IconButton>
                        <div className={styles.header}>
                            <div className={styles.title}>
                                {title}
                            </div>
                        </div>
                        <ScheduleEditor
                            cronExpression  = {cronExpression}
                            activeField     = {activeField}
                            cronExpInterval = {cronExpInterval}
                            onClose         = {onClose}
                            onlyInterval    = {onlyInterval}
                            onSubmit        = {onSubmit}
                        />
                    </div>
                </Fragment>
            </Modal>
        );
    }
}

export default ScheduleModal;
