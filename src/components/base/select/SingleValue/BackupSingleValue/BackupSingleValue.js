import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { components } from 'react-select';
import CriticalValue            from '../../../CriticalValue';

import styles from './BackupSingleValue.less';


class BackupSingleValue extends PureComponent {
    static propTypes = {
        data : PropTypes.shape({
            name        : PropTypes.string,
            time        : PropTypes.string,
            timePrecise : PropTypes.string
        })
    }

    static defaultProps={
        data : {
            name        : '',
            time        : '',
            timePrecise : ''
        }
    }
    render() {
        const  { name, time, timePrecise }  = this.props.data;

        return (
            <components.SingleValue {...this.props}>
                <div className={styles.BackupSingleValue}>
                    <div className={styles.title}>
                        <CriticalValue value={name} maxWidth='100%' />
                    </div>
                    <div className={styles.time}>
                        <Tooltip title={timePrecise}>
                            <span>{time}</span>
                        </Tooltip>
                    </div>
                </div>
            </components.SingleValue >
        );
    }
}

export default BackupSingleValue;
