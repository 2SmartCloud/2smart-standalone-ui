import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withSize } from 'react-sizeme';
import ECharts from 'echarts-for-react';
import getPropertyUnit from '../../../utils/getPropertyUnit';
import valueValidator from '../../../utils/validation/widget/gauge';
import NoDataMessage from '../etc/NoDataMessage';
import styles from './GaugeWidget.less';

const theme = {
    axisLine : {
        lineStyle : {
            color : [ [ 0.2, '#2ec7c9' ], [ 0.8, '#5ab1ef' ], [ 1, '#d87a80' ] ],
            width : 15
        }
    },
    axisTick : {
        splitNumber : 10,
        length      : 18,
        lineStyle   : {
            color : 'auto'
        }
    },
    splitLine : {
        length    : 22,
        lineStyle : {
            color : 'auto'
        }
    },
    pointer : {
        width : 5
    }
};

class GaugeWidget extends PureComponent {
    getOption = () => {
        const { advanced: { minValue, maxValue }, value, unit } = this.props;
        const range = {};
        const fontSize = this.getFontSize();
        const isIntegerMinValue = this.isInteger(minValue);
        const isIntegerMaxValue = this.isInteger(maxValue);
        const roundedValue = this.roundValue(value);

        if (isIntegerMinValue) {
            range.min = minValue;
        } if (isIntegerMaxValue) {
            range.max = maxValue;
        }

        return {
            grid : {
                top    : 0,
                left   : 0,
                bottom : 0,
                right  : 0
            },
            series : [
                {
                    ...theme,
                    ...range,
                    axisLabel : {
                        formatter : label => Math.round(label),
                        fontSize
                    },
                    radius : '100%',
                    type   : 'gauge',
                    detail : {
                        offsetCenter : [ 0, '85%' ],
                        formatter    : `${roundedValue} ${getPropertyUnit(unit)}`,
                        fontSize     : fontSize * 1.5
                    },
                    data                    : [ { value } ],
                    animationDurationUpdate : 700
                }
            ],
            tooltip : {
                trigger : 'none'
            }
        };
    }

    getFontSize = () => {
        const { size : { width, height } } = this.props;
        let fontSize;

        if (width >= height) {
            const fsCoeff = 1 / 18;

            fontSize = fsCoeff * height;
        } else if (width < height) {
            const fsCoeff = 1 / 18;

            fontSize = fsCoeff * width;
        }

        return fontSize;
    }

    isInteger = (value) => {
        return Number.isInteger(parseFloat(value, 10));
    }

    roundValue = () => {
        const { value, dataType } = this.props;

        const roundedValue = dataType === 'float' ? parseFloat(value).toFixed(2) : value;

        return roundedValue;
    }

    validateValue = () => {
        const { value } = this.props;
        const isValid = valueValidator.validate({ value });

        return isValid;
    }

    render() {
        const option = this.getOption();
        const isValueValid = this.validateValue();

        return (
            <div className={styles.GaugeWidget}>
                { isValueValid
                    ? <ECharts option={option} style={{ height: '100%', width: '100%' }} />
                    : <NoDataMessage />
                }
            </div>
        );
    }
}

GaugeWidget.propTypes = {
    value    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    unit     : PropTypes.string,
    dataType : PropTypes.string.isRequired,
    advanced : PropTypes.shape({
        minValue : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        maxValue : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
    }).isRequired,
    size : PropTypes.object.isRequired
};

GaugeWidget.defaultProps = {
    value : null,
    unit  : null
};

export default withSize({ monitorHeight: true })(GaugeWidget);
