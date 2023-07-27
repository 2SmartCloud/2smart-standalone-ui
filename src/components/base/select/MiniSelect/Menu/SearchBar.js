import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Input from '../../../inputs/Search';
import styles from './SearchBar.less';

class SearchBar extends PureComponent {
    handleInputChange = (value) => {
        const { onSearchChange } = this.props;

        onSearchChange(value);
    }

    render() {
        return (
            <div className={styles.SearchBar}>
                <Input
                    onChange={this.handleInputChange}
                    className={styles.input}
                    inputClassName={styles.input}
                    placeholder='Search…'
                />
            </div>
        );
    }
}

SearchBar.propTypes = {
    onSearchChange : PropTypes.func.isRequired
};

export default SearchBar;
