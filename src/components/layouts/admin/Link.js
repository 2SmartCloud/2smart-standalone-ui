import React, { PureComponent } from 'react';
import { withRouter, matchPath } from 'react-router-dom';
import PropTypes from 'prop-types';
import ListItem from '../../base/sidebar/list/Item';

class Link extends PureComponent {
    handleClick = () => {
        const { history, path, onClick } = this.props;

        onClick();

        history.push(path);
    }

    isActive = () => {
        const { currentPathname, path } = this.props;

        const match = matchPath(currentPathname, path);
        const isScenarios = currentPathname.includes('scenario') && path.includes('scenario');
        const isServices = currentPathname.includes('service') && path.includes('service');
        const isNotifications = currentPathname.includes('notification') && path.includes('notification');

        return match?.isExact || isScenarios || isServices || isNotifications;
    }

    render() {
        const { title } = this.props;
        const isActive = this.isActive();

        return (
            <ListItem title={title} isActive={isActive} onClick={this.handleClick} />
        );
    }
}

Link.propTypes = {
    path            : PropTypes.string.isRequired,
    title           : PropTypes.string.isRequired,
    currentPathname : PropTypes.string.isRequired,
    history         : PropTypes.object.isRequired,
    onClick         : PropTypes.func.isRequired
};

export default withRouter(props => <Link {...props} />);
