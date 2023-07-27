import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import { components } from 'react-select';

import styles from './TopicSingleValue.less';

const CustomTooltip = withStyles({
    tooltip : {
        maxWidth  : '200',
        wordBreak : 'break-all'
    }
})(Tooltip);

class TopicSingleValue extends PureComponent {
    render() {
        const { data:{ title, name, value, alias }, selectProps:{ value:{ label } } } = this.props;
        const aliasLabel = alias?.name ?  ` — ${alias.name}` : null;

        const isTopicDeleted = !value;

        return (
            <components.SingleValue {...this.props}>
                <CustomTooltip
                    placement='bottom-start'
                    isOpen
                    title={label}
                >
                    <div className={styles.TopicSingleValue}>
                        {
                            isTopicDeleted
                                ? <span className={styles.label}> {label} </span>
                                : <>
                                    <span className={styles.name}>{title || name}</span>
                                    <span className={styles.name}>{aliasLabel}</span>
                                    <span className={styles.label}>{` — ${value}`}</span>
                                </>

                        }

                    </div>
                </CustomTooltip>

            </components.SingleValue >
        );
    }
}

TopicSingleValue.propTypes = {
    data        : PropTypes.object.isRequired,
    selectProps : PropTypes.object.isRequired
};

export default TopicSingleValue;
