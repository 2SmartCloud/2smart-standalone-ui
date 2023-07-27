import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Option from './Option';
import styles from './List.less';

class List extends PureComponent {
    getOptions=() => {
        const { options } = this.props;
        const { searchQuery, isSearchByValue } = this.props;
        const q = searchQuery.toLowerCase();

        const filtered = options.filter(option => {
            const { value = '', label = '' } = option;

            return (
                isSearchByValue
                    ? value.toLowerCase().includes(q) || label.toLowerCase().includes(q)
                    : label.toLowerCase().includes(q)
            );
        });

        return filtered;
    }

    renderOptions=(options) => {
        return (
            options.map(option => {
                return (
                    <Option
                        {...this.props}
                        key={option.label}
                        option={option}
                    />
                );
            }
            ));
    }

    render() {
        const filteredOptions = this.getOptions();
        const { noOptionsMessage, searchQuery } = this.props;

        return (
            <div className={styles.List}>
                <div className={styles.container}>
                    {
                        filteredOptions.length
                            ? this.renderOptions(filteredOptions)
                            : <div className={styles.noOptionMessage}>
                                {noOptionsMessage({ inputValue: searchQuery })}
                            </div>
                    }
                </div>
            </div>
        );
    }
}

List.propTypes = {
    options          : PropTypes.array.isRequired,
    searchQuery      : PropTypes.string.isRequired,
    isSearchByValue  : PropTypes.bool,
    noOptionsMessage : PropTypes.func
};

List.defaultProps = {
    isSearchByValue  : false,
    noOptionsMessage : () => 'Nothing found'
};

export default List;
