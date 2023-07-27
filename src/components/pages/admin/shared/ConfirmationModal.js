import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import Modal                    from '../../../base/Modal';
import CriticalValue            from '../../../base/CriticalValue';
import Button                   from '../../../base/Button';
import styles                   from './ConfirmationModal.less';

const cx = classnames.bind(styles);

class ConfirmationModal extends PureComponent {
    static propTypes = {
        title  : PropTypes.string,
        text   : PropTypes.string,
        labels : PropTypes.shape({
            submit : PropTypes.string,
            cancel : PropTypes.string
        }),
        isOpen    : PropTypes.bool.isRequired,
        isLoading : PropTypes.bool,
        onSubmit  : PropTypes.func,  // eslint-disable-line react/no-unused-prop-types
        onClose   : PropTypes.func.isRequired
    }

    static defaultProps = {
        title     : undefined,
        text      : undefined,
        labels    : undefined,
        onSubmit  : undefined,
        isLoading : false
    }

    handleFormSubmit = e => {
        e.preventDefault();
        e.stopPropagation();

        this.props?.onSubmit();
    }

    renderControls() {
        const { labels, isLoading, onSubmit, onClose } = this.props;
        const buttonsContainerCN = cx(styles.buttonsContainer, {
            oneControl : !onSubmit
        });

        return (
            <form onSubmit={this.handleFormSubmit} className={styles.form}>
                <div className={buttonsContainerCN}>
                    {
                        onSubmit
                            ? <div className={styles.buttonWrapper}>
                                <Button
                                    text={labels?.submit}
                                    type='submit'
                                    isFetching={isLoading}
                                    isDisabled={isLoading}
                                    autoFocus
                                    isNegative
                                />
                            </div >
                            : null
                    }
                    <div className={styles.buttonWrapper}>
                        <Button
                            text={labels?.cancel}
                            type='button'
                            // isDisabled={isLoading}
                            onClick={onClose}
                        />
                    </div>
                </div>
            </form>
        );
    }

    render() {
        const { title, text, isOpen, onClose } = this.props;

        return (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <div className={styles.ConfirmationModal}>
                    <div className={styles.container}>
                        <div className={styles.title}><CriticalValue maxWidth='80%' value={title} /></div>
                        <div className={styles.text}>{text}</div>
                        {this.renderControls()}
                    </div>
                </div>
            </Modal>
        );
    }
}

export default ConfirmationModal;
