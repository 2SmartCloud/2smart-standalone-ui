import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import ProcessingIndicator      from '../../base/ProcessingIndicator';

import PropertyRow              from '../../pages/admin/Dashboard/PropertyRow';
import styles                   from './CardWidget.less';

const cn = classnames.bind(styles);
const selectCustomStyles = {
    option : {
        fontWeight : 300
    }
};

class CardWidget extends PureComponent {
    static propTypes = {
        properties    : PropTypes.array.isRequired,
        isEditMode    : PropTypes.bool.isRequired,
        isProcessing  : PropTypes.bool.isRequired,
        onErrorRemove : PropTypes.func.isRequired
    };

    renderCardWidget = () => {
        const { properties, isEditMode, onErrorRemove } = this.props;
        const propertiesListCN = cn(styles.propertiesList, {
            // disabled: isEditMode
            editMode : isEditMode
        });

        return (
            <div className={propertiesListCN} >
                { properties.sort((a, b) => a?.order - b?.order).map(property => {
                    const isPropertyDisable = !property.rootTopic;

                    return (
                        <PropertyRow
                            {...property}
                            floatRight
                            onErrorRemove   = {onErrorRemove}
                            key             = {property.topic}
                            isDisable       = {isPropertyDisable}
                            isTitleDisabled = {!isEditMode}
                            classNames      = {{
                                root     : styles.property,
                                value    : styles.propertyValue,
                                mainData : styles.propertyMainData
                            }}
                            selectStyles    = {selectCustomStyles}
                            isTitleSettable = {false}
                            isCopyHidden

                        />
                    );
                }) }
            </div>
        );
    }

    render() {
        const { isProcessing } = this.props;

        return (
            <div className={styles.CardWidget}>
                { isProcessing ?
                    <ProcessingIndicator size={35} />
                    : this.renderCardWidget()
                }
            </div>
        );
    }
}
export default CardWidget;
