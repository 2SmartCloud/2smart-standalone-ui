import React, { Component }   from 'react';
import { withSize }           from 'react-sizeme';
import PropTypes              from 'prop-types';
import { connect }            from 'react-redux';
import ReactEcharts           from 'echarts-for-react';
import moment                 from 'moment';
import LIVR                   from 'livr';
import * as TimeSeriesActions from '../../../actions/client/timeseries';
import tsStorage              from '../../../timeseries/Storage';
import Theme, { THEMES }      from '../../../utils/theme';
import { seriesColorPrefix }  from '../../../utils/theme/widget/chart';
import NoDataMessage          from '../etc/NoDataMessage';
import styles                 from './ChartWidget.less';

const validator = new LIVR.Validator({
    value : [ 'decimal', 'required' ]
});

const textStyling = {
    fontFamily : 'Helvetica Neue',
    color      : '#CCC'
};

const baseOption = {
    grid : {
        top          : '5%',
        bottom       : 0,
        left         : '1%',
        right        : '1%',
        containLabel : true
    },
    xAxis : {
        data      : [],
        silent    : false,
        splitLine : {
            show : false
        },
        splitArea : {
            show : false
        },
        axisLine : {
            show : false
        },
        axisTick : {
            show : false
        },
        axisLabel : {
            formatter : function formatter(value) {
                return moment.unix(value / 1000).format('HH:mm:ss');
            }
        }
    },
    yAxis : {
        type     : 'value',
        axisTick : {
            show : false
        },
        axisLine : {
            show : false
        },
        splitLine : {
            lineStyle : {
                color : 'red',
                width : 2
            }
        }
    },
    series : [ {
        data           : [],
        color          : '#04C0B2',
        symbolSize     : 6,
        smooth         : true,
        z              : 0,
        barMinHeight   : 3,
        barCategoryGap : '35%',
        markLine       : {
            silent : true
        },
        itemStyle : {
            barBorderRadius : 6
        }
    } ],
    tooltip : {
        show        : 'true',
        trigger     : 'axis',
        formatter   : '{c}',
        axisPointer : {
            type      : 'line',
            lineStyle : {
                type : 'dashed'
            }
        }
    },
    textStyle : textStyling
};

class ChartWidget extends Component {
    static contextType = Theme; //eslint-disable-line

    state = {
        ts : []
    }

    componentDidMount() {
        const { widgetId, advanced: { interval } } = this.props;
        const timeseries = tsStorage.getTs(widgetId);

        this.setState({
            ts : timeseries
        });

        tsStorage.listen(widgetId, this.handleTsUpdate, interval);
        const rotation = this.getRotation();

        tsStorage.setRotation(widgetId, rotation);
    }

    componentWillReceiveProps(nextProps) {
        const { advanced: nextAdvanced, topic: nextTopic, size: nextSize } = nextProps;
        const { advanced, topic, widgetId, screenId, size } = this.props;

        if (nextAdvanced.interval !== advanced.interval) {
            tsStorage.unsubscribe(widgetId);
            tsStorage.listen(widgetId, this.handleTsUpdate, nextAdvanced.interval);
        }

        if (topic !== nextTopic) {
            tsStorage.dropTs(widgetId);
            this.setState({
                ts : []
            });

            this.props.stopSingleWidgetFetcher(widgetId);
            this.props.runSingleWidgetTsFetcher(screenId, widgetId);
            tsStorage.unsubscribe(widgetId);
            tsStorage.listen(widgetId, this.handleTsUpdate, nextAdvanced.interval);
        }

        const { width: nextWidth } = nextSize;
        const { width } = size;

        if (width !== nextWidth) {
            const rotation = this.getRotation(nextWidth);

            tsStorage.setRotation(widgetId, rotation);
        }
    }

    componentWillUnmount() {
        const { widgetId } = this.props;

        tsStorage.unsubscribe(widgetId);
    }

    handleTsUpdate = (ts) => {
        this.setState({
            ts
        });
    }

    getValues = () => {
        const { ts } = this.state;

        const values = ts.map(({ value }) => {
            return value;
        });

        return values;
    }

    getLimitedValues = () => {
        const { minValue, maxValue, chartType = 'bar' } = this.props.advanced;
        const values = this.getValues();

        if (minValue && maxValue && chartType === 'bar') {
            const limitedValues = values.map(value => {
                if (value < minValue && minValue >= 0) {
                    return { value, itemStyle: { color: 'transparent' } };
                }

                if (value <= minValue) {
                    return minValue;
                }

                if (value >= maxValue) {
                    return maxValue;
                }

                return value;
            });

            return limitedValues;
        }

        if (minValue !== undefined && maxValue !== undefined && chartType === 'line') {
            const limitedValues = values.map(value => {
                if (value < minValue || value > maxValue) {
                    return { value, symbolSize: 0 };
                }

                return value;
            });

            return limitedValues;
        }


        return values;
    }

    getYAxisSplitLineColor = () => {
        const { theme } = this.context;
        const splitLineColor = THEMES[theme]['--split_line_color'];

        return splitLineColor;
    }

    getSeriesColor = () => {
        const { theme } = this.context;
        const { chartColor = '#04C0B2' } = this.props.advanced;
        const color = THEMES[theme][`${seriesColorPrefix}${chartColor}`];

        return color;
    }

    getTextColor = () => {
        const { theme } = this.context;
        const color = THEMES[theme]['--label_text_color'];

        return color;
    }

    getOption = () => {
        const { ts } = this.state;
        const { advanced: { chartType = 'bar', minValue, maxValue }, isEditMode } = this.props;
        const customType = this.mapChartTypeToSeries()[chartType];
        const yAxisRange = {
            min : 'dataMin',
            max : 'dataMax'
        };
        const yAxisSplitLineColor = this.getYAxisSplitLineColor();
        const seriesColor = this.getSeriesColor();
        const textColor = this.getTextColor();

        const values = this.getValues();
        const limitedValues = this.getLimitedValues();
        const times = ts.map(({ time }) => time);

        if (Number.isInteger(parseFloat(minValue, 10))) {
            yAxisRange.min = minValue;
        } if (Number.isInteger(parseFloat(maxValue, 10))) {
            yAxisRange.max = maxValue;
        }

        const customOption = {
            ...baseOption,
            xAxis : {
                ...baseOption.xAxis,
                data      : times,
                axisLabel : {
                    ...baseOption.xAxis.axisLabel,
                    rotate : 25
                }
            },
            yAxis : {
                ...baseOption.yAxis,
                ...yAxisRange,
                splitLine : {
                    ...baseOption.yAxis.splitLine,
                    lineStyle : {
                        ...baseOption.yAxis.splitLine.lineStyle,
                        color : yAxisSplitLineColor
                    }
                }
            },
            series : baseOption.series.map(item => {
                return ({
                    ...item,
                    data   : limitedValues,
                    color  : seriesColor,
                    type   : customType,
                    cursor : isEditMode ? 'initial' : 'pointer'
                });
            }),
            tooltip : {
                ...baseOption.tooltip,
                show      : !isEditMode,
                formatter : (params) => {
                    const dataIndex = params[0].dataIndex;

                    return values[dataIndex];
                }
            },
            textStyle : {
                ...baseOption.textStyle,
                color : textColor
            }
        };

        return customOption;
    }

    getRotation = (width = this.props.size.width) => {
        const singleBarWidth = 65;
        const rotation = Math.round(width / singleBarWidth);

        return rotation;
    }

    mapChartTypeToSeries = () => {
        return ({
            'line' : 'line',
            'bar'  : 'bar'
        });
    }

    validateValues = values => {
        return values.some(value => validator.validate({ value }));
    }

    render() {
        const option = this.getOption();
        const values = this.getValues();
        const isValuesValid = this.validateValues(values);

        return (
            <div className={styles.ChartWidget}>
                { isValuesValid
                    ? <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
                    : <NoDataMessage />
                }
            </div>
        );
    }
}

ChartWidget.propTypes = {
    topic      : PropTypes.string.isRequired,
    screenId   : PropTypes.string.isRequired,
    widgetId   : PropTypes.string.isRequired,
    isEditMode : PropTypes.bool.isRequired,
    advanced   : PropTypes.shape({
        chartType  : PropTypes.oneOf([ 'line', 'bar' ]),
        chartColor : PropTypes.string,
        interval   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        minValue   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        maxValue   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
    }).isRequired,
    size                     : PropTypes.object.isRequired,
    stopSingleWidgetFetcher  : PropTypes.func.isRequired,
    runSingleWidgetTsFetcher : PropTypes.func.isRequired
};

export default connect(null, { ...TimeSeriesActions }, null, { forwardRef: true })(withSize()(ChartWidget));
