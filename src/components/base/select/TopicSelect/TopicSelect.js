import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import TopicOption              from '../Option/TopicOption';
import TopicSingleValue         from '../SingleValue/TopicSingleValue';
import TopicMenu                from '../Menu/TopicMenu/';

import Select                   from '../BaseSelect';

const customStyles = {
    placeholder : {
        fontSize  : '14px',
        textAlign : 'left'
    },
    singleValue : {
        color : '#1e1e1e',
        width : '93%'
    },
    container : {
        height : '38px'
    },
    option : {
        '&:hover' : { background: 'rgba(4, 192, 178, 0.05)' }
    }
};

class TopicSelect extends PureComponent {
    state = {
        isOnlyActive : false
    }

    handleCheckboxChange = () => {
        const { isOnlyActive }  = this.state;

        this.setState({
            isOnlyActive : !isOnlyActive
        });
    }

    filterOptionsByActive = options => options.filter(option => option.isActive);

    render() {
        const customComponents = {
            Menu        : TopicMenu,
            Option      : TopicOption,
            SingleValue : TopicSingleValue,
            ...this.props.components
        };
        const { options, ...restProps } = this.props;
        const { isOnlyActive } = this.state;
        const filteredOptions = isOnlyActive
            ? this.filterOptionsByActive(options)
            : options;


        return (
            <Select

                {...restProps}
                maxSelectHeight = {206}
                components      = {customComponents}
                selectType      = 'topic'
                settings        = {{
                    ...this.props.settings,
                    isSearchable : true
                }}
                onCheckboxChange  = {this.handleCheckboxChange}
                isCheckboxChecked = {isOnlyActive}
                options           = {filteredOptions}
                darkThemeSupport
                styles            = {customStyles}
            />
        );
    }
}

TopicSelect.propTypes = {
    value          : PropTypes.string,
    settings       : PropTypes.object.isRequired,
    components     : PropTypes.object,
    options        : PropTypes.array,
    onChange       : PropTypes.func,
    onMenuClose    : PropTypes.func,
    onMenuOpen     : PropTypes.func,
    isPortalTarget : PropTypes.bool
};

TopicSelect.defaultProps = {
    value          : '',
    options        : [],
    components     : {},
    onChange       : () => {},
    onMenuClose    : () => {},
    onMenuOpen     : () => {},
    isPortalTarget : true
};

export default TopicSelect;
