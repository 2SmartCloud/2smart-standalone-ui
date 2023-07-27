import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_WIDGET_COLOR_VALUE, WIDGET_COLORS } from '../../../../../assets/constants/widget';
import Theme from '../../../../../utils/theme';
import { getChartColor } from '../../../../../utils/theme/widget/getColors';
import BaseSelect from '../../../../base/select/BaseSelect';
import ColorOption from '../../../../base/select/Option/ColorOption';
import ColorSingleValue from '../../../../base/select/SingleValue/ColorSingleValue';

const customStyles = {
    singleValue : {
        width : '100%'
    }
};

class ColorSelect extends PureComponent {
    static contextType = Theme // eslint-disable-line

    static propTypes = {
        value         : PropTypes.string,
        options       : PropTypes.array,
        defaultOption : PropTypes.object,
        placeholder   : PropTypes.string,
        onChange      : PropTypes.func.isRequired
    }

    static defaultProps = {
        value         : undefined,
        options       : undefined,
        defaultOption : undefined,
        placeholder   : null
    }

    // defaultEmitted = false;

    handleChange = ({ value }) => {
        this.props.onChange(value);
    }

    getOptions() {
        const { theme } = this.context;

        return WIDGET_COLORS.map(({ value }) => ({ value, color: getChartColor(value, theme) }));
    }

    getDefaultColor = () => {
        const { theme } = this.context;
        const value = DEFAULT_WIDGET_COLOR_VALUE;
        const color = getChartColor(value, theme);

        return { value, color };
    }

    render() {
        const { value, options, defaultOption, placeholder } = this.props;

        const colorOptions = options || this.getOptions();
        const defaultColor = defaultOption || this.getDefaultColor();
        const defaultValue = colorOptions.find(option => option.value === value) || defaultColor;

        // if (!value && !this.defaultEmitted) {
        //     this.handleChange({ value: defaultColor.value });
        //     this.defaultEmitted = true;
        // }

        return (
            <BaseSelect
                styles={customStyles}
                settings={{
                    defaultValue,
                    isSearchable : false
                }}
                options={colorOptions}
                placeholder={placeholder}
                onChange={this.handleChange}
                components={{
                    Option      : ColorOption,
                    SingleValue : ColorSingleValue
                }}
                noPortalTarget={false}
                selectType='color'
                darkThemeSupport
            />
        );
    }
}

export default ColorSelect;
