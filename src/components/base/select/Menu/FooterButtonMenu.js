import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import BaseMenu                 from './BaseMenu';
import styles                   from './FooterButtonMenu.less';

class FooterButtonMenu extends PureComponent {
    static propTypes = {
        children : PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node)
        ]).isRequired,
        footerButton : PropTypes.node.isRequired
    };

    render() {
        const { footerButton, children } = this.props;

        return (
            <BaseMenu {...this.props}>
                {children}
                <div className={styles.footerButtonWrapper}>
                    {footerButton}
                </div>
            </BaseMenu>
        );
    }
}

export default FooterButtonMenu;
