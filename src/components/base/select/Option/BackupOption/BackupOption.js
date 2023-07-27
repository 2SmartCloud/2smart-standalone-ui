import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseOption from '../BaseOption';
import CriticalValue  from '../../../CriticalValue';

import styles from './BackupOption.less';

class BackupOption extends PureComponent {
    static propTypes = {
        data : PropTypes.shape({
            name : PropTypes.string,
            time : PropTypes.string
        }).isRequired
    }

    render() {
        const  { name, time }  = this.props.data;

        return (
            <BaseOption {...this.props}>
                {
                    <div className={styles.BackupOption}>
                        <div className={styles.title}>
                            <CriticalValue value={name} maxWidth='100%' />
                        </div>
                        <div className={styles.time}>
                            <span>{time}</span>
                        </div>
                    </div>
                }
            </BaseOption>
        );
    }
}

export default BackupOption;
