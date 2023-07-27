import { seriesColorPrefix } from './chart';

import { themes, widgetBgPrefix } from './index';

export function getWidgetBackgroundColor(color = 'white', theme) {
    return themes[theme][`${widgetBgPrefix}${color}`];
}

export function getChartColor(color = 'white', theme) {
    return themes[theme][`${seriesColorPrefix}${color}`];
}
