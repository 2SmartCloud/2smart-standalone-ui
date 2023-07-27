import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseSelect from './BaseSelect';

const styles = {
    control : {
        minWidth        : 'unset',
        backgroundColor : 'transparent',
        borderColor     : '#979797',
        '&:hover'       : {
            borderColor : '#4f5151'
        }
    },
    indicatorSeparator : {
        backgroundColor : '#979797'
    },
    menu : {
        right : 'unset',
        left  : '0'
    }
};

class EnumWidgetSelect extends PureComponent {
    render() {
        const { value, options, onChange, onMenuClose, onMenuOpen } = this.props;

        return (
            <BaseSelect
                {...this.props}
                options={options}
                onChange={onChange}
                placeholder={value}
                settings={{
                    defaultOptions : true,
                    isSearchable   : false,
                    value          : {
                        value,
                        label : value
                    }
                }}
                styles={styles}
                onMenuClose={onMenuClose}
                onMenuOpen={onMenuOpen}
            />
        );
    }
}

EnumWidgetSelect.propTypes = {
    value          : PropTypes.string.isRequired,
    options        : PropTypes.array,
    onChange       : PropTypes.func,
    onMenuClose    : PropTypes.func,
    onMenuOpen     : PropTypes.func,
    isPortalTarget : PropTypes.bool
};

EnumWidgetSelect.defaultProps = {
    options        : [],
    onChange       : () => {},
    onMenuClose    : () => {},
    onMenuOpen     : () => {},
    isPortalTarget : true
};

export default EnumWidgetSelect;
