import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { colors }  from '../../../utils/theme/widget/led';

import styles from './LedWidget.less';


class LedWidget extends PureComponent {
    static propTypes = {
        value    : PropTypes.string.isRequired,
        advanced : PropTypes.shape({
            ledColor : PropTypes.string
        }).isRequired
    }

    getValueChecked = value =>  value
        ? !(value === 'false' || value === '0' || value === '—' || value === '-')
        : value;

    getRingStyle = () => {
        const { value, advanced: { ledColor } } = this.props;

        if (!this.getValueChecked(value)) return;

        const rgb = colors[`${ledColor}`];

        return {
            background : `linear-gradient(136.91deg, rgba(${rgb},0.6) 19.76%, rgba(${rgb},0.8) 82.33%)`
        };
    }

    getLedValue = () => {
        const { value } = this.props;
        const ledValue = this.getValueChecked(value) ? 'ON' : 'OFF';

        return ledValue;
    }


    render() {
        return (
            <div className={styles.outerRing}>
                <div className={styles.innerRing} style={this.getRingStyle()}>
                    <p className={styles.ledValue}>
                        { this.getLedValue() }
                    </p>
                </div>
            </div>
        );
    }
}

export default LedWidget;
