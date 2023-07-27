import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';

import Slider   from '../../base/Slider';

import styles from './SliderWidget.less';

class SliderWidget extends PureComponent {
    render() {
        const { isEditMode, isLocked, isProcessing, ...rest } = this.props;

        return (
            <div className={styles.SliderWidget}>
                <Slider
                    className    = {styles.SliderWidget}
                    isProcessing = {isProcessing}
                    isDisabled   = {isEditMode || isLocked || isProcessing}
                    isEditMode   = {isEditMode}
                    {...rest}
                />
            </div>
        );
    }
}


SliderWidget.propTypes = {
    isEditMode   : PropTypes.bool.isRequired,
    isLocked     : PropTypes.bool,
    isProcessing : PropTypes.bool
};

SliderWidget.defaultProps = {
    isLocked     : false,
    isProcessing : false
};

export default SliderWidget;
