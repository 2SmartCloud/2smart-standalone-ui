import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../base/Button';
import CriticalValue from '../base/CriticalValue';
import styles from './DeleteWarning.less';

class DeleteWarning extends PureComponent {
    handleFormSubmit = (e) => {
        e.preventDefault();
    }

    render() {
        const { name, onAccept, onClose, isFetching, confirmText, itemType, isDisabled } = this.props;

        return (
            <div className={styles.DeleteWarning}>
                <div className={styles.container}>
                    <div className={styles.title}>
                        <p style={{ marginRight: '5px' }}>Delete</p> <CriticalValue value={name} maxWidth='75%' />
                    </div>
                    <div className={styles.text}>
                        You will not be able to recover this {itemType}!
                    </div>
                    <form onSubmit={this.handleFormSubmit} className={styles.form}>
                        <div className={styles.buttonsContainer}>
                            <div className={styles.buttonWrapper}>
                                <Button
                                    text={confirmText}
                                    onClick={onAccept}
                                    isFetching={isFetching}
                                    isDisabled={isFetching}
                                    type='submit'
                                    autoFocus
                                    isNegative
                                />
                            </div>
                            <div className={styles.buttonWrapper}>
                                <Button
                                    text='Cancel' onClick={onClose} type='button'
                                    isDisabled={isDisabled}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

DeleteWarning.propTypes = {
    name        : PropTypes.string,
    onAccept    : PropTypes.func.isRequired,
    onClose     : PropTypes.func.isRequired,
    isFetching  : PropTypes.bool,
    isDisabled  : PropTypes.bool,
    confirmText : PropTypes.string,
    itemType    : PropTypes.oneOf([ 'widget', 'device', 'screen', 'node',
        'service', 'scenario', 'group', 'discovery' ]).isRequired
};

DeleteWarning.defaultProps = {
    name        : undefined,
    isFetching  : false,
    isDisabled  : false,
    confirmText : 'Yes, delete'
};

export default DeleteWarning;
