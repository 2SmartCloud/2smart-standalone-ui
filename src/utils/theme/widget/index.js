import { themes as chartThemes } from './chart';

export const widgetBgPrefix = '--widget_background_color_';

export const themes = {
    LIGHT : {
        ...chartThemes.LIGHT,
        [`${widgetBgPrefix}white`]       : '#FFF',
        [`${widgetBgPrefix}blue`]        : '#D1EBFF',
        [`${widgetBgPrefix}green`]       : '#DBF9D6',
        [`${widgetBgPrefix}yellow`]      : '#FDF1B6',
        [`${widgetBgPrefix}orange`]      : '#FFE0BC',
        [`${widgetBgPrefix}red`]         : '#F9C2BA',
        [`${widgetBgPrefix}violet`]      : '#EAD0F4',
        [`${widgetBgPrefix}light-blue`]  : '#D8F3F9',
        [`${widgetBgPrefix}light-green`] : '#E1FFEE',
        [`${widgetBgPrefix}pink`]        : 'rgb(255, 235, 247)',
        [`${widgetBgPrefix}light-gray`]  : '#ECEDF0',
        [`${widgetBgPrefix}dark-gray`]   : '#D7DADF'
    },
    DARK : {
        ...chartThemes.DARK,
        [`${widgetBgPrefix}white`]       : '#2F333D',
        [`${widgetBgPrefix}blue`]        : '#407a98',
        [`${widgetBgPrefix}green`]       : '#61884a',
        [`${widgetBgPrefix}yellow`]      : '#d7d88d',
        [`${widgetBgPrefix}orange`]      : '#c78139',
        [`${widgetBgPrefix}red`]         : '#cc7060',
        [`${widgetBgPrefix}violet`]      : '#91609e',
        [`${widgetBgPrefix}light-blue`]  : '#57aec1',
        [`${widgetBgPrefix}light-green`] : '#abd6bd',
        [`${widgetBgPrefix}pink`]        : '#b37b9e',
        [`${widgetBgPrefix}light-gray`]  : '#9c9fa5',
        [`${widgetBgPrefix}dark-gray`]   : '#505050'
    }
};
