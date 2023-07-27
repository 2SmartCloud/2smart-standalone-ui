import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import Theme                    from '../../../utils/theme';
import Modal                    from '../../base/Modal';
import Button                   from '../../base/Button';
import styles                   from './ConfirmModal.less';

const cx = classnames.bind(styles);

export default class ConfirmModal extends PureComponent {
    static contextType = Theme; //eslint-disable-line
s
    static propTypes = {
        onSubmit     : PropTypes.func.isRequired,
        onCancel     : PropTypes.func.isRequired,
        title        : PropTypes.string.isRequired,
        text         : PropTypes.string.isRequired,
        confirmLabel : PropTypes.string.isRequired,
        cancelLabel  : PropTypes.string.isRequired,
        isModalOpen  : PropTypes.bool.isRequired,
        isNegative   : PropTypes.bool
    }
    static defaultProps={
        isNegative : false
    }

    render() {
        const { isModalOpen, onSubmit, onCancel,
            title, text, confirmLabel, cancelLabel, isNegative } = this.props;
        const { theme } = this.context;
        const confirmModalCN = cx('ConfirmModal', { dark: theme === 'DARK' });

        return (
            <Modal
                isOpen={isModalOpen}
                onClose={onCancel}
            >
                <div  className={confirmModalCN}>
                    <div className={styles.container}>
                        <div className={styles.title}>
                            {title}
                        </div>
                        <div className={styles.text}>
                            {text}
                        </div>
                        <form onSubmit={onSubmit} className={styles.form}>
                            <div className={styles.buttonsContainer}>
                                <div className={styles.buttonWrapper}>
                                    <Button
                                        text      = {cancelLabel}
                                        className = {styles.buttonCancel}
                                        onClick   = {onCancel}
                                        type      = 'button'
                                    />
                                </div>
                                <div className={styles.buttonWrapper}>
                                    <Button
                                        text       = {confirmLabel}
                                        className  = {styles.buttonConfirm}
                                        onClick    = {onSubmit}
                                        isNegative = {isNegative}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        );
    }
}

