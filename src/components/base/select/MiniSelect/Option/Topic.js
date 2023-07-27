import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Base from './Base.js';
import styles from './Topic.less';

class TopicOption extends PureComponent {
    render() {
        const { title, name, value, label, alias } = this.props.option;
        const isTopicDeleted = !value;
        const aliasLabel = alias?.name ?  ` — ${alias.name}` : null;


        return (
            <Base {...this.props}>
                <div className={styles.Topic}>
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
            </Base>
        );
    }
}

TopicOption.propTypes = {
    option : PropTypes.object.isRequired
};


export default TopicOption;
