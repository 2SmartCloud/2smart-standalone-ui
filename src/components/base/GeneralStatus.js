import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';
import classnames from 'classnames/bind';
import { possibleStatuses, statusValidator } from '../../utils/validation/telemetry';

import styles from './GeneralStatus.less';

const cn = classnames.bind(styles);

class GeneralStatus extends PureComponent {
    validStatus() {
        const res = statusValidator.validate({ status: this.props.state });

        return !!res;
    }

    renderIndicator() {
        const { isTooltip, state } = this.props;

        return (
            isTooltip ?
                <Tooltip title={state}>
                    <div className={styles.indicator} />
                </Tooltip> :
                <div className={styles.indicator} />
        );
    }

    render() {
        const { state, isNodeDisable } = this.props;

        return (
            <div className={cn('GeneralStatus', state, { isNodeDisable })}>
                {
                    this.validStatus ?
                        this.renderIndicator() :
                        null
                }
            </div>
        );
    }
}
// REFACTOR: possibleStatuses => statuses
GeneralStatus.propTypes = {
    state         : PropTypes.oneOf(possibleStatuses).isRequired,
    isTooltip     : PropTypes.bool,
    isNodeDisable : PropTypes.bool
};

GeneralStatus.defaultProps = {
    isTooltip     : true,
    isNodeDisable : false
};

export default GeneralStatus;
