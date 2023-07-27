import React, { PureComponent, Fragment } from 'react';
import PropTypes                          from 'prop-types';
import { NAVIGATION_OPTIONS }             from '../../../../assets/constants/settings';
import Tabs                                from '../../../base/TabsWrapper';

class Navigation extends PureComponent {
    static propTypes = {
        activeTab     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
        onTabChange   : PropTypes.func.isRequired,
        isSideBarOpen : PropTypes.bool.isRequired
    };

    componentDidUpdate(prevProps) {
        if (prevProps.isSideBarOpen !== this.props.isSideBarOpen) {
            window.dispatchEvent(new CustomEvent('resize'));
        }
    }

    handleTabChange = (e, value) => {
        const { onTabChange } = this.props;

        onTabChange(value);
    }

    getSelectValue = () => {
        const options = this.getOptions();
        const { activeTab } = this.props;

        return options[activeTab];
    }

    render() {
        const { activeTab, onTabChange } = this.props;

        return (
            <Fragment>
                <Tabs
                    value={activeTab}
                    onChange={onTabChange}
                    tabs={NAVIGATION_OPTIONS}
                    variant='scrollable'
                    scrollButtons='on'
                />
            </Fragment>
        );
    }
}


export default Navigation;
