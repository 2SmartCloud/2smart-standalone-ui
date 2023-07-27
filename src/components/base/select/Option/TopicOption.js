import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseOption from './BaseOption';

import styles from './TopicOption.less';

class TopicOption extends PureComponent {
    render() {
        const { title, name, value, label, alias } = this.props.data;
        const isTopicDeleted = !value;
        const aliasLabel = alias?.name ?  ` — ${alias.name}` : null;

        return (
            <BaseOption {...this.props}>
                <div className={styles.TopicOption}>
                    {isTopicDeleted
                        ? <span className={styles.label}> {label} </span>
                        : <>
                            <span className={styles.name}>{title || name}</span>
                            <span className={styles.name}>{aliasLabel}</span>
                            <span className={styles.label}>{` — ${value}`}</span>
                        </>
                    }
                </div>
            </BaseOption>
        );
    }
}

TopicOption.propTypes = {
    data : PropTypes.object
};

TopicOption.defaultProps = {
    data : {
        title : '',
        name  : '',
        value : ''
    }
};

export default TopicOption;
