import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseDefaultValue from './Base';
import styles from './Topic.less';

class TopicDefaultValue extends PureComponent {
    render() {
        const { title, name, value, label, alias } = this.props.defaultValue;
        const isTopicDeleted = !value;
        const aliasLabel = alias?.name ?  ` — ${alias.name}` : null;

        return (
            <BaseDefaultValue {...this.props}>
                <div className={styles.Topic}>
                    {isTopicDeleted
                        ? <span className={styles.label}> {label} </span>
                        : <>
                            <span className={styles.name}>{title || name}</span>
                            <span className={styles.name}>{aliasLabel}</span>
                            <span className={styles.label}>{` — ${value}`}</span>
                        </>
                    }
                </div>
            </BaseDefaultValue>
        );
    }
}

TopicDefaultValue.propTypes = {
    defaultValue : PropTypes.object
};

TopicDefaultValue.defaultProps = {
    defaultValue : {
        title : '',
        name  : '',
        value : ''
    }
};
export default TopicDefaultValue;
