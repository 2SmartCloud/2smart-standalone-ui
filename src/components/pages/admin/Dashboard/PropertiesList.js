import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { sortDisplayedProperties } from '../../../../utils/sort';
import * as HomieActions from '../../../../actions/homie';

import PropertyRow from './PropertyRow';

import styles from './PropertiesList.less';


const cx = classnames.bind(styles);

class PropertiesList extends PureComponent {
    static propTypes = {
        properties   : PropTypes.array,
        hardwareType : PropTypes.oneOf([ 'device', 'node' ]).isRequired,
        propertyType : PropTypes.oneOf([ 'options', 'telemetry', 'sensors' ]).isRequired,
        deviceId     : PropTypes.string.isRequired,
        nodeId       : PropTypes.string,
        isDisable    : PropTypes.bool,
        showGroups   : PropTypes.bool.isRequired,
        sortOrder    : PropTypes.oneOf([ 'ASC', 'DESC' ]).isRequired
    }

    static defaultProps = {
        nodeId     : null,
        properties : [],
        isDisable  : false
    }

    renderPropertyRow(property, showDisplayedButton) {
        return (
            <PropertyRow
                {...this.props}
                {...property}
                key={property.id}
                showDisplayedButton={showDisplayedButton}
            />
        );
    }

    render() {
        const { propertyType, properties, isDisable, sortOrder } = this.props;
        const PropertiesListCN = cx('PropertiesList', {
            isDisable
        });

        const propertiesSorted = sortDisplayedProperties(properties.slice(), sortOrder);
        const showDisplayedButton = propertyType === 'sensors';

        return (
            <div className={PropertiesListCN} >
                <div className={styles.tableWrapper}>
                    {
                        propertiesSorted.map(property => this.renderPropertyRow(property, showDisplayedButton))
                    }
                </div>
            </div>
        );
    }
}

export default connect(null, { ...HomieActions })(PropertiesList);
