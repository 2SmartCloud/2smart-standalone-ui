import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CriticalValue  from '../../../../CriticalValue';
import BaseDefaultValue from '../Base';
import styles from '../../../SingleValue/BackupSingleValue/BackupSingleValue.less';

class BackupDefaultValue extends PureComponent {
    render() {
        const { time, name } = this.props.defaultValue;

        return (
            <BaseDefaultValue {...this.props}>
                <div className={styles.BackupSingleValue}>
                    <div className={styles.title}>
                        <CriticalValue value={name} maxWidth='100%' />
                    </div>
                    <div className={styles.time}>
                        <span>{time}</span>
                    </div>
                </div>
            </BaseDefaultValue>
        );
    }
}

BackupDefaultValue.propTypes = {
    defaultValue : PropTypes.object
};

BackupDefaultValue.defaultProps = {
    defaultValue : {
        time : '',
        name : ''
    }
};
export default BackupDefaultValue;
