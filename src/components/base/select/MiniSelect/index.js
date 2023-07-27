import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Container from './Container';
import Menu from './Menu';
import styles from './MiniSelect.less';

class MiniSelect extends PureComponent {
    state = {
        isMenuOpen  : false,
        searchQuery : ''
    }

    handleContainerClick = () => {
        this.setState({
            isMenuOpen : true
        });
    }

    handleMenuClose = () => {
        this.closeMenu();
    }

    handleOptionChange = (value) => {
        const { onChange } = this.props;

        this.closeMenu();
        onChange(value);
    }

    handleSearchChange = value => {
        const { onSearchChange } = this.props;

        this.setState({
            searchQuery : value
        });

        onSearchChange && onSearchChange(value);
    }

    closeMenu = () => {
        this.setState({
            isMenuOpen  : false,
            searchQuery : ''
        });
    }

    render() {
        const { isMenuOpen, searchQuery } = this.state;
        const { settings : { defaultValue, value, isSearchByValue } } = this.props;

        return (
            <div className={styles.MiniSelect}>
                <Container
                    {...this.props}
                    defaultValue={value || defaultValue}
                    onClick={this.handleContainerClick}
                />
                <Menu
                    {...this.props}
                    isOpen={isMenuOpen}
                    isSearchByValue={isSearchByValue}
                    onChange={this.handleOptionChange}
                    onSearchChange={this.handleSearchChange}
                    onClose={this.handleMenuClose}
                    searchQuery={searchQuery}
                />
            </div>

        );
    }
}

MiniSelect.propTypes = {
    onChange       : PropTypes.func.isRequired,
    onSearchChange : PropTypes.func,
    settings       : PropTypes.object.isRequired
};

MiniSelect.defaultProps = {
    onSearchChange : void 0
};

export default MiniSelect;
