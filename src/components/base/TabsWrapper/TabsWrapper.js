import React, { PureComponent, Fragment } from 'react';
import PropTypes                          from 'prop-types';
import classnames from 'classnames/bind';

import Tabs                               from '@material-ui/core/Tabs';
import Tab                                from './Tab';
import styles                             from './TabsWrapper.less';

const cx = classnames.bind(styles);

class TabsWrapper extends PureComponent {
    static propTypes = {
        value         : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
        onChange      : PropTypes.func.isRequired,
        tabs          : PropTypes.array.isRequired,
        classes       : PropTypes.object,
        variant       : PropTypes.string,
        scrollButtons : PropTypes.object
    };


    static defaultProps = {
        classes       : {},
        variant       : '',
        scrollButtons : {}
    }


    handleTabChange = (e, value) => {
        const { onChange } = this.props;

        onChange(value);
    }

    renderTabsContent = () => this.props.tabs
        .map(option => (
            <Tab
                key={option.value}
                customLabel={option.label}
                label={option.value}
                icon={option.icon}
            />
        ));


    render() {
        const { value, classes:{ root, indicator, ...restClasses }, variant, scrollButtons } = this.props;

        return (
            <Fragment>
                <Tabs
                    value={value}
                    onChange={this.handleTabChange}
                    classes={{
                        root          : cx('tabs', root),
                        indicator     : cx('indicator', indicator),
                        scrollButtons : styles.scrollButtons,
                        ...restClasses
                    }}
                    variant={variant}
                    scrollButtons={scrollButtons}
                >
                    {this.renderTabsContent()}
                </Tabs>
            </Fragment>
        );
    }
}


export default TabsWrapper;
