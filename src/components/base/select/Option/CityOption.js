import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseOption from './BaseOption';

import styles from './CityOption.less';

class CityOption extends PureComponent {
    render() {
        const { label, country } = this.props.data;

        return (
            <BaseOption {...this.props}>
                <div className={styles.CityOption}>
                    <span className={styles.name}>{label}</span>
                    <span className={styles.label}>{` — ${country}`}</span>

                </div>
            </BaseOption>
        );
    }
}

CityOption.propTypes = {
    data : PropTypes.object
};

CityOption.defaultProps = {
    data : {
        label   : '',
        country : ''
    }
};

export default CityOption;
