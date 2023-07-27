import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MUITab from '@material-ui/core/Tab';

import AccountIcon from '../../icons/Account';
import SecurityIcon from '../../icons/Security';
import BackupIcon from '../../icons/Backup';
import SystemIcon               from '../../icons/System';

import styles from './Tab.less';

class Tab extends PureComponent {
    static propTypes = {
        label       : PropTypes.string.isRequired,
        customLabel : PropTypes.string.isRequired,
        icon        : PropTypes.string
    };

    static defaultProps = {
        icon : undefined
    }

    getIcon = () => {
        const { label, icon } = this.props;
        const Icon = icon || ICONS[label];

        return (
            Icon ?
                <div className={styles.iconWrapper}>
                    <Icon className={styles.icon} />
                </div>
                : null
        );
    }

    render() {
        const { label, customLabel, ...restProps } = this.props;
        const icon = this.getIcon();

        return (
            <MUITab
                {...restProps}
                label={customLabel || label}
                icon={icon}
                classes={{
                    root     : styles.Tab,
                    selected : styles.selected,
                    wrapper  : styles.wrapper
                }}
            />
        );
    }
}


const ICONS = {
    preferences : AccountIcon,
    security    : SecurityIcon,
    system      : SystemIcon,
    backup      : BackupIcon
};

export default Tab;
