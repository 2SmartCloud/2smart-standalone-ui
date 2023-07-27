import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import IconButton from '@material-ui/core/IconButton';
import MenuMU from '@material-ui/core/Menu';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core';
import Theme from '../../utils/theme';
import styles from './Menu.less';

const CustomMenu = withStyles({
    list : {
        minWidth        : '150px',
        backgroundColor : 'var(--primary_background_color) !important'
    },
    paper : {
        backgroundColor : 'var(--primary_background_color) !important'
    }
})(MenuMU);

const cn = classnames.bind(styles);

class Menu extends PureComponent {
    static contextType = Theme; //eslint-disable-line

    state = {
        open        : false,
        localAnchor : null
    }

    handleOpen = e => {
        this.setState({ open: true, localAnchor: e.currentTarget });
    }

    handleClose = () => {
        this.setState({ open: false, localAnchor: null });
    }

    handleSelect = value => {
        this.props.onClick(value);

        this.handleClose();
    }

    handleStopPropagation = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    renderOpeningElement = () => {
        const { openingElement } = this.props;
        const props = {
            'aria-label'    : 'more',
            'aria-controls' : 'long-menu',
            'aria-haspopup' : 'true',
            onClick         : this.handleOpen
        };

        if (openingElement) {
            // REFACTOR : use some other pattern instead of render props func
            return openingElement(props);
        }

        return (
            <IconButton
                {...props}
                className={styles.openBtn}
            >
                <MoreHorizIcon />
            </IconButton>
        );
    }

    render() {
        const { open, localAnchor } = this.state;
        const { options, classes, anchor } = this.props;
        const { theme } = this.context;

        return (
            <div className={styles.Menu}>
                {this.renderOpeningElement()}
                <CustomMenu
                    anchorEl={anchor || localAnchor}
                    open={open}
                    onClose={this.handleClose}
                    onMouseDown={this.handleStopPropagation}
                    onTouchStart={this.handleStopPropagation}
                    TransitionComponent={Fade}
                    classes={{
                        list : styles.list,
                        ...classes
                    }}
                >
                    {
                        options.map(option => {
                            const { value, label } = option;

                            return (
                                <div
                                    className={styles.menuOption}
                                    key={value}
                                    onClick={this.handleSelect.bind(null, value)}
                                >
                                    <div className={cn(`option-icon-${value}`, { dark: theme === 'DARK' })} />
                                    <div className={styles.label}>{label}</div>
                                </div>
                            );
                        })
                    }
                </CustomMenu>
            </div>
        );
    }
}

Menu.propTypes = {
    anchor         : PropTypes.object,
    options        : PropTypes.array.isRequired,
    onClick        : PropTypes.func.isRequired,
    openingElement : PropTypes.func,
    classes        : PropTypes.object
};

Menu.defaultProps = {
    openingElement : undefined,
    anchor         : undefined,
    classes        : null
};

export default Menu;
