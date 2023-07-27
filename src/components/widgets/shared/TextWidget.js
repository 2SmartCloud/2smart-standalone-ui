import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import CriticalValue from '../../base/CriticalValue';
import getReadableUnit from '../../../utils/getPropertyUnit';

import styles from './TextWidget.less';

// const validator = new LIVR.Validator({
//     integerValue : [ 'integer' ],
//     floatValue   : [ 'decimal' ]
// });

class TextWidget extends PureComponent {
    // validateValue = () => {
    //     const { value, dataType } = this.props;
    //     let isValid = true;

    //     if (dataType === 'integer') {
    //         isValid = validator.validate({ integerValue: value });
    //     } else if (dataType === 'float') {
    //         isValid = validator.validate({ floatValue: value });
    //     }

    //     return isValid;
    // }


    render() {
        const { value, unit, isEditMode } = this.props;
        // const isValueValid = this.validateValue(value);

        return (

            <Fragment>
                <CriticalValue
                    maxWidth='65%' value={value || '—'} className={styles.value}
                    hideTooltip={isEditMode}
                />
                <CriticalValue
                    maxWidth='30%' value={getReadableUnit(unit)} className={styles.unit}
                    hideTooltip={isEditMode}
                />
            </Fragment>

        );
    }
}

TextWidget.propTypes = {
    value      : PropTypes.string,
    unit       : PropTypes.string,
    isEditMode : PropTypes.bool.isRequired
};

TextWidget.defaultProps = {
    value : '-',
    unit  : ''
};

export default TextWidget;
