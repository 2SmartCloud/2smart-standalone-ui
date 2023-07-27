import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'throttle-debounce';
import BaseInput from './Base.js';
import styles from './Search.less';

class SearchInput extends PureComponent {
    static propTypes = {
        placeholder    : PropTypes.string,
        inputClassName : PropTypes.string,
        value          : PropTypes.string.isRequired,
        onChange       : PropTypes.func.isRequired
    }

    static defaultProps = {
        placeholder    : '',
        inputClassName : undefined
    }

    state = {
        search : this.props.value
    }

    componentDidUpdate(prevProps) {
        const { value } = this.props;
        const { search } = this.state;

        if (value !== prevProps.value && value !== search) {
            this.setState({ search: value });
        }
    }

    handleChange = value => {
        this.setState({ search: value });
        this.debouncedOnChange(value);
    }

    debouncedOnChange = debounce(100, value => this.props.onChange(value))

    render() {
        const { placeholder, inputClassName, ...props } = this.props;
        const { search } = this.state;

        return (
            <BaseInput
                {...props}
                type='text'
                placeholder={placeholder}
                value={search}
                onChange={this.handleChange}
                className={styles.searchInput}
                inputClassName={inputClassName || styles.searchInput}
                searchIconClassName={styles.searchIcon}
                search
                darkThemeSupport
                maximumHarcodingIOS
            />
        );
    }
}

export default SearchInput;
