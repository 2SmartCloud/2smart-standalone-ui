import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseSelect from '../../../base/select/BaseSelect';
import IconOption from '../../../base/select/Option/IconOption';

const styles = {
    control : {
        '@media (max-width: 550px)' : {
            minWidth : '160px'
        }
    },
    indicatorSeparator : {
        display : 'none'
    },
    placeholder : {
        width : 'auto'
    },
    menuList : {
        maxHeight                   : '600px',
        '@media (max-width: 650px)' : {
            maxHeight : '540px'
        },
        '@media (min-width: 651px) and (max-height: 800px)' : {
            maxHeight : '400px'
        },
        '@media (min-width: 651px) and (max-height: 600px)' : {
            maxHeight : '200px'
        },
        '@media (min-width: 651px) and (max-height: 400px)' : {
            maxHeight : '120px'
        },
        '@media (min-width: 651px) and (max-height: 320px)' : {
            maxHeight : '80px'
        },
        '@media (max-width: 650px) and (max-height: 800px)' : {
            maxHeight : '340px'
        },
        '@media (max-width: 650px) and (max-height: 600px)' : {
            maxHeight : '140px'
        },
        '@media (max-width: 650px) and (max-height: 400px)' : {
            maxHeight : '60px'
        }
    }
};

class SetupServiceSelect extends PureComponent {
    static propTypes = {
        placeholder : PropTypes.string,
        options     : PropTypes.array.isRequired,
        onCreate    : PropTypes.func.isRequired
    }

    static defaultProps = {
        placeholder : undefined
    }

    handleSelect = ({ value }) => {
        const { onCreate } = this.props;

        onCreate(value);
    }

    getNoOptionsMessage(search) {
        return search?.inputValue.length
            ? 'Nothing found'
            : 'There are no installed services';
    }

    renderOption = option => {
        const { options } = this.props;

        const icon = options.find(item => item.value === option.value)?.icon;

        return <IconOption {...option} icon={icon} />;
    }

    render() {
        const { placeholder, options } = this.props;

        const components = {
            Option : this.renderOption
        };

        return (
            <BaseSelect
                placeholder={placeholder}
                placeholderType='secondary'
                options={options}
                components={components}
                styles={styles}
                settings={{
                    isSearchable : true,
                    value        : null
                }}
                noOptionsMessage={this.getNoOptionsMessage}
                onChange={this.handleSelect}
                darkThemeSupport
            />
        );
    }
}

export default SetupServiceSelect;
