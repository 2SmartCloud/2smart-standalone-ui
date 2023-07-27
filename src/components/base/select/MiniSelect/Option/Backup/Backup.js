import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CriticalValue  from '../../../../CriticalValue';

import styles from '../../../Option/BackupOption/BackupOption.less';
import Base from '../Base.js';

class BackupOption extends PureComponent {
    static propTypes = {
        option : PropTypes.shape({
            name : PropTypes.string,
            time : PropTypes.string
        }).isRequired
    }

    render() {
        const  { name, time }  = this.props.option;

        return (
            <Base {...this.props}>
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
            </Base>
        );
    }
}

export default BackupOption;
