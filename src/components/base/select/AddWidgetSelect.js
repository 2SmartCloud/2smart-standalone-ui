import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import {
    WIDGETS_MAP,
    WIDGET_OPTIONS
}                               from '../../../assets/constants/widget';
import BaseSelect               from './BaseSelect';
import IconOption               from './Option/IconOption';

const styles = {
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

class AddWidgetSelect extends PureComponent {
    static propTypes = {
        placeholder : PropTypes.string,
        style       : PropTypes.object,
        onChange    : PropTypes.func.isRequired
    }

    static defaultProps = {
        placeholder : undefined,
        style       : undefined
    }

    handleSelect = ({ value }) => {
        const { onChange } = this.props;

        onChange(value);
    }

    getIcon = type => {
        const widget = WIDGETS_MAP[type] || {};

        return widget.icon;
    }

    getOptionsWithIcons = () => {
        return WIDGET_OPTIONS.map(option => {
            const icon = this.getIcon(option.value);

            return { ...option, icon };
        });
    }

    renderOption = option => {
        const icon = this.getIcon(option.value);

        return <IconOption {...option} icon={icon} />;
    };

    render() {
        const { placeholder, style } = this.props;

        const options = this.getOptionsWithIcons();

        const components = {
            Option : this.renderOption
        };
        const settings = {
            isSearchable : true,
            value        : null
        };

        return (
            <BaseSelect
                placeholder={placeholder}
                options={options}
                components={components}
                styles={styles}
                style={style}
                settings={settings}
                onChange={this.handleSelect}
                placeholderType='secondary'
                darkThemeSupport
            />
        );
    }
}

export default AddWidgetSelect;
