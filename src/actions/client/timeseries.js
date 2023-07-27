import tsManager         from '../../timeseries/Manager';
import { getIDsByTopic } from '../../actions/homie';
import store             from '../../store';

export const RUN_TIME_SERIES = 'RUN_TIME_SERIES';

let timeseriesResolver;

export function runTimeSeries() {
    return async (dispatch, getState) => {
        const state = getState();
        const screens = state.client.dashboard.screens;
        const devices = state.homie.devices;
        const chartWidgetsData = collectWidgetsData(screens);

        try {
            await new Promise((resolve, reject) => {
                if (timeseriesResolver) {
                    timeseriesResolver.reject();
                    timeseriesResolver = null;
                }
                if (Object.keys(devices).length) {
                    resolve();

                    return;
                }
                timeseriesResolver = { resolve, reject };
            });
            timeseriesResolver = null;
        } catch (e) {
            return;
        }

        tsManager.run(chartWidgetsData);

        dispatch({
            type : RUN_TIME_SERIES
        });
    };
}

export function runTimeseriesResolve() {
    if (timeseriesResolver) {
        timeseriesResolver.resolve();
        timeseriesResolver = null;
    }
}

export function runSingleWidgetTsFetcher(screenId, widgetId) {
    return (dispatch, getState) => {
        if (screenId && widgetId) {
            const state = getState();
            const screen = state.client.dashboard.screens.find(({ id }) => id === screenId);
            const widget = screen.widgets.find(({ id }) => id === widgetId);

            tsManager.runWidgetFetcher(serializeWidgetData(widget));

            dispatch({
                type : 'RUN_SINGLE_WIDGET_TS_FETCHER'
            });
        } else {
            const state = getState();
            const widget = state.client.widget;

            const dumpWidget = { ...widget.currTopic, advanced: widget.advanced };

            tsManager.runWidgetFetcher(serializeWidgetData(dumpWidget));

            dispatch({
                type : 'RUN_SINGLE_WIDGET_TS_FETCHER'
            });
        }
    };
}

export function stopSingleWidgetFetcher(id) {
    return dispatch => {
        tsManager.stopWidgetFetcher(id);

        dispatch({
            type : 'STOP_SINGLE_WIDGET_FETCHER'
        });
    };
}

function collectWidgetsData(screens) {
    const widgetsData = [];

    for (const screen of screens) {
        if (screen.widgets && screen.widgets.length) {
            for (const widget of screen.widgets) {
                if (widget.type === 'chart') {
                    widgetsData.push(serializeWidgetData(widget));
                }
            }
        }
    }

    return widgetsData;
}

export function serializeWidgetData(widget) {
    const IDS = store.dispatch(getIDsByTopic(widget?.topic));
    const { deviceId, nodeId, hardwareType, propertyId, propertyType } = IDS || {};

    return ({
        id       : widget.id,
        topic    : { deviceId, nodeId, hardwareType, propertyId, propertyType },
        interval : widget.advanced.interval
    });
}
