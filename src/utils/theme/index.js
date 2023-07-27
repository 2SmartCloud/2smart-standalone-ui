import { createContext } from 'react';
import { themes as selectThemes } from './select';
import { themes as iconThemes } from './icon';
import { themes as widgetThemes } from './widget';
import { themes as switchThemes } from './switch';
import { themes as controlThemes } from './control';
import { themes as hightlightThemes } from './highlight';

export function getTheme(layout) {
    if (!layout) throw new Error('Layout is required!');

    const savedTheme = localStorage.getItem(layout) || localStorage.getItem('theme');
    const theme = [ 'LIGHT', 'DARK' ].includes(savedTheme) ? savedTheme : 'LIGHT';

    return theme;
}

export function setTheme(layout, theme) {
    localStorage.setItem(layout, theme);
}

export function applyTheme(theme) {
    Object.keys(THEMES[theme]).forEach(key => {
        document.documentElement.style.setProperty(key, THEMES[theme][key]);
    });
}

export const THEMES = {
    LIGHT : {
        ...selectThemes.LIGHT,
        ...iconThemes.LIGHT,
        ...widgetThemes.LIGHT,
        ...switchThemes.LIGHT,
        ...controlThemes.LIGHT,
        ...hightlightThemes.LIGHT,

        '--primary_background_color'      : '#FFFFFF',
        '--secondary_background_color'    : '#F4F8F9',
        '--tertiary_background_color'     : '#FFF',
        '--input_disabled_background'     : '#f1f1f1c9',
        '--input_background_color'        : '#FFF',
        '--primary_text_color'            : '#1E1E1E',
        '--primary_text_color--hover'     : '#000',
        '--secondary_text_color'          : '#CACACA',
        '--placeholder_text_color'        : '#999',
        '--contrast_text_color'           : '#000',
        '--primary_border_color'          : '#ECECEC',
        '--primary_split_line_color'      : '#F2F2F2',
        '--secondary_split_line_color'    : '#F8F8F8',
        '--primary_page_background_color' : '#F0F9F8',
        '--row_background_color'          : '#FFF',
        '--schedule_input_title'          : 'rgba(0,0,0,0.5)',

        '--sort_button_box_shadow' : ' 0 0 4px 2px rgba(230,230,230,0.4)',

        '--node_background_color'        : '#F4F8F9',
        '--node_background_color--hover' : 'rgba(4, 186, 172, 0.101328)',
        '--node_border_color'            : '#E7F1F4',

        '--background_color_input-arrow' : '#D4DADF',

        '--color_scroll_track' : '#F0F0F0',

        '--color_picker_knob_border'         : '#B3B3B3',
        '--color_picker_knob_shadow'         : 'rgba(150, 150, 150, 0.2)',
        '--saturation_picker_color'          : '#666',
        '--toast_error_border_color'         : 'rgba(238, 133, 135, 0.301)',
        '--background_grey'                  : '#e9e9e9',
        '--group_background_color'           : '#E8F6FA',
        '--group_border_color'               : '#E7F1F4',
        '--group_secondary_background_color' : '#E2E2E2',
        '--discovery_name_color'             : '#EDFBFA',
        '--tabs-text-color'                  : '#6c6c6d',
        '--log-level_border_color'           : '#E7F1F4',
        '--log-level_shadow_color'           : 'rgba(174, 174, 174, 0.25)',
        '--alias-dashed-color'               : '#858484',
        '--popover_background_color'         : '#FFFFFF'
    },
    DARK : {
        ...selectThemes.DARK,
        ...iconThemes.DARK,
        ...widgetThemes.DARK,
        ...switchThemes.DARK,
        ...controlThemes.DARK,
        ...hightlightThemes.DARK,

        '--primary_background_color'      : '#2F333D',
        '--secondary_background_color'    : '#1D212A',
        '--tertiary_background_color'     : '#343740',
        '--input_background_color'        : '#1D212A',
        '--input_disabled_background'     : '#343740',
        '--primary_text_color'            : '#f0f0f0',
        '--primary_text_color--hover'     : '#BEBEBE',
        '--secondary_text_color'          : '#f0f0f0',
        '--contrast_text_color'           : '#FFF',
        '--placeholder_text_color'        : '#808080',
        '--primary_border_color'          : '#1D212A',
        '--primary_split_line_color'      : '#CCC',
        '--secondary_split_line_color'    : '#353a44',
        '--primary_page_background_color' : '#2F333D',
        '--row_background_color'          : '#2F333D',
        '--schedule_input_title'          : '#ffffff',

        '--node_background_color'        : '#2F333D',
        '--node_background_color--hover' : 'rgba(4, 186, 172, 0.101328)',
        '--node_border_color'            : '#1D212A',
        '--sort_button_box_shadow'       : '0 0 4px 2px #616161',
        '--background_color_input-arrow' : '#2F333D',

        '--border-color_control'        : '',
        '--border-color_control-active' : '',

        '--color_scroll_track' : '#2F333D',

        '--color_picker_knob_border' : '#CACACA',
        '--color_picker_knob_shadow' : 'rgba(150, 150, 150, 0.2)',
        '--saturation_picker_color'  : '#CECECE',

        '--toast_error_border_color' : 'rgba(238, 133, 135, 1)',
        '--background_grey'          : 'rgb(174, 174, 174)',

        '--group_background_color'           : '#212931',
        '--group_border_color'               : '#728488',
        '--group_secondary_background_color' : 'rgba(4, 186, 172, 0.301328)',
        '--discovery_name_color'             : '#1D212A',
        '--tabs-text-color'                  : '#adafb1',

        '--log-level_border_color'   : '#272d37',
        '--log-level_shadow_color'   : 'rgba(0, 0, 0, 0.25)',
        '--alias-dashed-color'       : '#979797',
        '--popover_background_color' : 'rgba(97, 97, 97, 0.9)'
    }
};


const context = createContext({
    theme         : 'LIGHT',
    onToogleTheme : () => {}
});

export default context;
