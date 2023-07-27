import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { isMobileDevice }             from '../../../utils/detect';
import BaseSidebar              from '../../base/sidebar/Sidebar';
import Switch                   from '../../base/Switch';
import Theme                    from '../../../utils/theme';
import {
    ADMIN,
    SCENARIOS,
    SETTINGS,
    SERVICES,
    MARKET,
    SYSTEM_LOGS,
    NOTIFICATION_CHANNELS
} from '../../../assets/constants/routes';
import Link from './Link';

import styles from './Sidebar.less';

class Sidebar extends PureComponent {
    static contextType = Theme                  // eslint-disable-line

    handleLinkClick = () => {
        if (isMobileDevice()) {
            const { onToggle } = this.props;

            onToggle();
        }
    }

    handleChangeTheme = e => {
        const { onToogleTheme } = this.context;

        onToogleTheme(e.target.checked ? 'DARK' : 'LIGHT');
    }

    render() {
        const { currentPathname } = this.props;

        return (
            <BaseSidebar {...this.props}>
                <>
                    <div className={styles.list}>
                        <Link
                            path={ADMIN} title='dashboard' currentPathname={currentPathname}
                            onClick={this.handleLinkClick}
                        />
                        <Link
                            path={SCENARIOS} title='scenarios' currentPathname={currentPathname}
                            onClick={this.handleLinkClick}
                        />
                        <Link
                            path={SERVICES} title='service manager' currentPathname={currentPathname}
                            onClick={this.handleLinkClick}
                        />
                        <Link
                            path={MARKET} title='market' currentPathname={currentPathname}
                            onClick={this.handleLinkClick}
                        />
                        <Link
                            path={NOTIFICATION_CHANNELS} title='notifications'  currentPathname={currentPathname}
                            onClick={this.handleLinkClick}
                        />
                        <Link
                            path={SYSTEM_LOGS} title='logs' currentPathname={currentPathname}
                            onClick={this.handleLinkClick}
                        />
                        <Link
                            path={SETTINGS} title='settings' currentPathname={currentPathname}
                            onClick={this.handleLinkClick}
                        />
                    </div>
                    <div className={styles.mode}>
                    Night mode
                        <Switch
                            checked={this.context.theme === 'DARK'}
                            disabled={false}
                            onChange={this.handleChangeTheme}
                        />
                    </div>
                </>
            </BaseSidebar>
        );
    }
}

Sidebar.propTypes = {
    onToggle        : PropTypes.func.isRequired,
    currentPathname : PropTypes.string.isRequired
};

export default Sidebar;
