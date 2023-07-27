import React, {
    PureComponent,
    Fragment
}                                  from 'react';
import PropTypes                   from 'prop-types';
import { default as MaterialTabs } from '@material-ui/core/Tabs'; // eslint-disable-line
import Tab                         from '@material-ui/core/Tab';
import classnames                  from 'classnames/bind';

import styles                      from './Tabs.less';

const cn = classnames.bind(styles);

class Tabs extends PureComponent {
    constructor(props) {
        super(props);

        const { forwardRef } = props;

        if ('current' in forwardRef) {
            forwardRef.current = {
                getActiveTab : () => this.state?.activeTab,
                setActiveTab : (tab) => this.handleTabChange(null, tab)
            };
        }

        this.state = {
            activeTab : this.props.value || 0
        };
    }

    componentDidUpdate() {
        const { value } = this.props;
        const { activeTab } = this.state;

        if (!isNaN(value) && value !== null && value !== activeTab) {
            this.setState({
                activeTab : value
            });
        }
    }

    handleTabChange = (e, value) => {
        this.setState({
            activeTab : value
        });
        this.props.onChange(value);
    }

    renderTabContent() {
        const { activeTab } = this.state;
        const { tabs, classes } = this.props;

        return <div className={cn(styles.content, classes.content)}>{tabs[activeTab] ? tabs[activeTab].content : ''}</div>;
    }

    render() {
        const { tabs } = this.props;
        const { noDataMessage, withDivider, centered, classes, renderControls } = this.props;
        const { activeTab } = this.state;

        return (
            <div width='100%' className={cn(styles.tabsContainer, classes.tabsContainer)}>
                {
                    tabs.length ?
                        <Fragment>
                            <div className={cn(styles.tabsWrapepr, classes.tabsWrapper, { centered: !!centered })}>
                                <MaterialTabs
                                    className={cn(styles.tabs, classes.tabs)}
                                    // /style={classes.tabs}
                                    value={activeTab}
                                    onChange={this.handleTabChange}
                                    indicatorColor='primary'
                                    classes={{
                                        indicator : styles.indicator
                                    }}
                                    centered={centered}
                                >
                                    {tabs.map(({ label, id }) => {
                                        return (
                                            <Tab
                                                key={id}
                                                label={label}
                                                disableFocusRipple
                                                disableRipple
                                                className={cn(styles.tab, classes.tab)}
                                            />
                                        );
                                    })}
                                </MaterialTabs>
                                { renderControls
                                    ? <div className={styles.controlsWrapper}>{renderControls()}</div>
                                    : null
                                }
                            </div>
                            {withDivider && <div className={styles.divider} /> }
                            {this.renderTabContent()}
                        </Fragment> : <span className={styles.noDataMessage}>{noDataMessage}</span>
                }
            </div>
        );
    }
}

Tabs.propTypes = {
    tabs           : PropTypes.array.isRequired,
    noDataMessage  : PropTypes.string,
    onChange       : PropTypes.func,
    renderControls : PropTypes.func,
    value          : PropTypes.number,
    classes        : PropTypes.object,
    forwardRef     : PropTypes.shape({
        current : PropTypes.shape({})
    }),
    withDivider : PropTypes.bool,
    centered    : PropTypes.bool

};


Tabs.defaultProps = {
    noDataMessage  : 'Nothing to display here',
    value          : null,
    onChange       : () => {},
    renderControls : null,
    withDivider    : false,
    centered       : false,
    forwardRef     : {},
    classes        : {}
};


export default Tabs;
