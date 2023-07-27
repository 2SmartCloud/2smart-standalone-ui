import React, { PureComponent }      from 'react';
import PropTypes                     from 'prop-types';
import ReactSelect, { createFilter } from 'react-select';
import { isTouchDevice }             from '../../../utils/detect';
import Theme, { THEMES }             from '../../../utils/theme';
import globalEnterHandler            from '../../../utils/globalEnterHandler';
import MiniSelect                    from './MiniSelect';
import BaseMenu                      from './Menu/BaseMenu';
import LabelOption                   from './Option/LabelOption';
import DropdownIndicator             from './DropdownIndicator';

class BaseSelect extends PureComponent {
    static contextType = Theme //eslint-disable-line

    state = {
        isOpen    : false,
        isFocused : false
    }

    componentWillUnmount() {
        globalEnterHandler.unregister(this.handleEnterPress);
    }

    handleSelectChange = (value) => {
        this.props.onChange(value);
    }

    handleMenuOpen = () => {
        const { onMenuOpen } = this.props;

        this.setState({ isOpen: true });
        onMenuOpen();

        globalEnterHandler.register(this.handleEnterPress);
    }

    handleEnterPress = () => {
        // prevent form submit
    }

    handleMenuClose = () => {
        const { onMenuClose } = this.props;

        this.setState({ isOpen: false, isFocused: false });
        onMenuClose();
        this.handleBlur();

        globalEnterHandler.unregister(this.handleEnterPress);
    }

    handleBlur = () => {
        this.select.select.blur();
    }

    handleFocus = () => {
        this.setState({ isFocused: true });
    }

    onCloseMenuScroll = (e) => {
        const { closeOnScroll } = this.props;
        const { srcElement } = e;
        const { menuListRef } = this.select.select;

        return srcElement !== menuListRef && closeOnScroll;
    }

    getSingleValueColor = () => {
        const { theme } = this.context;
        const { darkThemeSupport, isDisabled } = this.props;
        const defaultColor = '#1E1E1E';
        const color = isDisabled ? '--placeholder_text_color' : '--primary_text_color';

        return darkThemeSupport && THEMES[theme][color] || defaultColor;
    }

    getControlBorderColors = () => {
        const { theme } = this.context;
        const { darkThemeSupport } = this.props;
        const borderColor = darkThemeSupport ? THEMES[theme]['--border_color_select'] : THEMES.LIGHT['--border_color_select'];
        const borderColorHover = darkThemeSupport ? THEMES[theme]['--border_color_hover_select'] : THEMES.LIGHT['--border_color_hover_select'];
        const borderColorActive = darkThemeSupport ? THEMES[theme]['--border_color_active_select'] : THEMES.LIGHT['--border_color_active_select'];

        return {
            borderColor,
            borderColorHover,
            borderColorActive
        };
    }
    getControlErrorBorderColors = () => ({
        borderColor       : 'red',
        borderColorHover  : 'red',
        borderColorActive : 'red'
    })

    getControlBackgroundColor = () => {
        const { theme } = this.context;
        const { darkThemeSupport } = this.props;
        const defaultColor = '#FFF';

        return darkThemeSupport &&  THEMES[theme]['--background_color_control'] || defaultColor;
    }

    getBackgroundColor = () => {
        const { theme } = this.context;
        const {  isDisabled } = this.props;
        const color =  isDisabled ? THEMES[theme]['--input_disabled_background'] : null;

        return color;
    }

    getMenuBackgroundColor = () => {
        const { theme } = this.context;
        const { darkThemeSupport } = this.props;
        const defaultColor = '#FFF';

        return darkThemeSupport && THEMES[theme]['--background_color_menu'] || defaultColor;
    }

    getPlaceholderColor = () => {
        const { theme } = this.context;
        const { darkThemeSupport } = this.props;
        const defaultColor = '#FFF';

        return darkThemeSupport && THEMES[theme]['--placeholder_text_color'] || defaultColor;
    }

    getTrackBackgroundColor = () => {
        const { theme } = this.context;
        const { darkThemeSupport } = this.props;
        const defaultColor = '#F0F0F0';

        return darkThemeSupport && THEMES[theme]['--background_scroll_track'] || defaultColor;
    }

    getCurrentTheme = () => {
        const { theme } = this.context;
        const { darkThemeSupport } = this.props;

        return darkThemeSupport ? THEMES[theme] : THEMES.LIGHT;
    }

    getBoxShadowColor = () => {
        const theme = this.getCurrentTheme();

        return theme['--box_shadow_color_select'];
    }

    // should delete this?? never user
    isOptionDisabled = option => option.disabled

    shouldMenuSelectRender = () => {
        const isTouch = isTouchDevice();

        return isTouch;
    }
    getScales = () => {
        if (this.control) {
            const scales = this.control.getBoundingClientRect();

            return scales;
        }

        return {};
    }

    getPlacement = () => {
        const { maxSelectHeight } = this.props;
        const scales = this.getScales();
        const { bottom } = scales;
        const { innerHeight : screenHeight } = window;

        if (screenHeight - bottom <= maxSelectHeight) return 'top';

        return 'bottom';
    }

    getFilterOption=() => {
        const { isSearchByValue, settings } = this.props;
        const { isSearchable  } = settings;
        const filterOption = isSearchable && !isSearchByValue
            ?  createFilter({
                matchFrom : 'any',
                stringify : option => `${option.label}`
            })
            : null;

        return filterOption;
    }

    render() {
        const { options, placeholder, styles, settings,
            isInvalid, components, menuPlacement, noPortalTarget,
            mobileTitle, maxSelectHeight, onInputChange } = this.props;
        const { isOpen, isFocused } = this.state;
        const { borderColor, borderColorHover, borderColorActive } =
            isInvalid
                ? this.getControlErrorBorderColors()
                : this.getControlBorderColors();
        const containerBackgroundColor = this.getControlBackgroundColor();
        const containerBackground = this.getBackgroundColor();
        const customComponents = { Menu: BaseMenu, DropdownIndicator, Option: LabelOption, ...components };
        const singleValueColor = this.getSingleValueColor();
        const menuBackgroundColor = this.getMenuBackgroundColor();
        const trackBackgroundColor = this.getTrackBackgroundColor();
        const placeholderColor = this.getPlaceholderColor();
        const initialStyles = {
            container : css => ({
                ...css,
                width                     : '100%',
                height                    : '100%',
                'WebkitTapHighlightColor' : 'rgba(255, 255, 255, 0)',
                ...styles.container,
                '&:hover'                 : {
                    '& span[class$="indicatorSeparator"]' : {
                        backgroundColor : `${isOpen ? borderColorActive : borderColorHover} !important`
                    }
                }
            }),
            control : css => ({
                ...css,
                width           : '100%',
                minWidth        : '200px',
                height          : '100%',
                cursor          : 'pointer',
                transition      : 'border-color 0.3s',
                backgroundColor : containerBackgroundColor,
                ...styles.control,
                background      : containerBackground,
                borderColor     : (isOpen || isFocused) ? borderColorActive : borderColor,
                '&:hover'       : { borderColor: borderColorHover },
                boxShadow       : (isOpen || isFocused) ? `0 0 4px 1px ${this.getBoxShadowColor()}` : 'none'
            }),
            placeholder : css => ({
                ...css,
                fontSize   : '14px',
                textAlign  : 'center',
                width      : '100%',
                userSelect : 'none',
                ...styles.placeholder,
                color      : placeholderColor
            }),
            indicatorSeparator : css => ({
                ...css,
                display : 'none'
            }),
            indicatorsContainer : css => ({
                ...css,
                height : '100%'
            }),
            dropdownIndicator : css => ({
                ...css,
                color     : COLOR_TEXT,
                '&:hover' : { color: COLOR_TEXT },
                ...styles.dropdownIndicator
            }),
            menuPortal : css => ({
                ...css,
                zIndex : 99999
            }),
            menuList : css => ({
                ...css,
                padding                      : 0,
                margin                       : '20px',
                paddingRight                 : '11px',
                overflowX                    : 'hidden',
                maxHeight                    : '150px',
                '&::-webkit-scrollbar'       : { width: '6px' },
                '&::-webkit-scrollbar-track' : {
                    borderRadius    : '10px',
                    backgroundColor : trackBackgroundColor
                },
                '&::-webkit-scrollbar-thumb' : {
                    borderRadius    : '10px',
                    backgroundColor : 'rgba(4, 186, 172, 0.301328)'
                },
                '@media (max-width: 420px)' : {
                    margin : '4px'
                },
                ...styles.menuList
            }),
            menu : css => ({
                ...css,
                right           : '-1px',
                minWidth        : '249px',
                ...styles.menu,
                backgroundColor : menuBackgroundColor
            }),
            input : css => ({
                ...css,
                fontSize       : '14px',
                width          : '100%',
                textAlign      : 'left',
                zIndex         : this.state.isOpen ? '1' : '-1',
                '& div, input' : {
                    width : '100% !important'
                },
                color : 'var(--primary_text_color)',
                ...styles.input
            }),
            option : css => ({
                ...css,
                backgroundColor : '#FFF',
                ...styles.option
            }),
            singleValue : css => ({
                ...css,
                fontSize     : '14px',
                paddingRight : '10px',
                textAlign    : 'left',
                ...styles.singleValue,
                color        : singleValueColor
            }),
            noOptionsMessage : css => ({
                ...css,
                fontSize   : '14px',
                fontWeight : '700',
                userSelect : 'none',
                ...styles.noOptionsMessage
            })
        };
        const menuPortalTargetPayload = {};
        const shouldMenuSelectRender = this.shouldMenuSelectRender();
        const computedMenuPlacement = maxSelectHeight ? this.getPlacement() : null;
        const filterOption = this.getFilterOption();

        if (!noPortalTarget) menuPortalTargetPayload.menuPortalTarget = document.body;

        return (
            shouldMenuSelectRender ?
                <MiniSelect
                    {...this.props}
                    {...settings}
                    mobileTitle={mobileTitle || placeholder}
                    isOptionDisabled={this.isOptionDisabled}
                    onChange={this.handleSelectChange}
                    onSearchChange  = {onInputChange}
                /> :
                <div style={{ width: '100%', height: '100%' }} ref={node => this.control = node}>
                    <ReactSelect
                        {...this.props}
                        {...settings}
                        {...menuPortalTargetPayload}
                        filterOption      = {filterOption}
                        options           = {options}
                        onChange          = {this.handleSelectChange}
                        onInputChange     = {onInputChange}
                        components        = {customComponents}
                        placeholder       = {placeholder}
                        styles            = {initialStyles}
                        isOptionDisabled  = {this.isOptionDisabled}
                        onMenuOpen        = {this.handleMenuOpen}
                        onMenuClose       = {this.handleMenuClose}
                        onBlur            = {this.handleBlur}
                        onFocus           = {this.handleFocus}
                        menuPlacement     = {computedMenuPlacement || menuPlacement || 'auto'}
                        closeMenuOnScroll = {this.onCloseMenuScroll}
                        ref               = {node => this.select = node}
                    />
                </div>

        );
    }
}

BaseSelect.propTypes = {
    placeholder      : PropTypes.string,
    options          : PropTypes.array.isRequired,
    onChange         : PropTypes.func,
    onInputChange    : PropTypes.func,
    isDisabled       : PropTypes.bool,
    styles           : PropTypes.object,
    onMenuOpen       : PropTypes.func,
    onMenuClose      : PropTypes.func,
    settings         : PropTypes.object, // react-select properties
    components       : PropTypes.object,  // react-select components,
    menuPlacement    : PropTypes.oneOf([ 'top', 'bottom', 'auto' ]),
    noPortalTarget   : PropTypes.bool,
    closeOnScroll    : PropTypes.bool,
    darkThemeSupport : PropTypes.bool,
    isInvalid        : PropTypes.bool,
    isAsync          : PropTypes.bool,
    mobileTitle      : PropTypes.string,
    noOptionsMessage : PropTypes.func,
    maxSelectHeight  : PropTypes.number,
    isSearchByValue  : PropTypes.bool
};

BaseSelect.defaultProps = {
    placeholder      : '',
    menuPlacement    : 'auto',
    mobileTitle      : '',
    noPortalTarget   : true,
    closeOnScroll    : false,
    darkThemeSupport : true,
    isDisabled       : false,
    isInvalid        : false,
    isAsync          : false,
    styles           : {},
    settings         : {},
    components       : {},
    noOptionsMessage : () => 'Nothing found',
    onChange         : () => {},
    onInputChange    : () => {},
    onMenuOpen       : () => {},
    onMenuClose      : () => {},
    maxSelectHeight  : undefined,
    isSearchByValue  : false

};

const COLOR_TEXT = '#000';


export default BaseSelect;
