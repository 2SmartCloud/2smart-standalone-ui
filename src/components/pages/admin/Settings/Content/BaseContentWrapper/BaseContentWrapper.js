import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './BaseContentWrapper.less';

class BaseContentWrapper extends PureComponent {
    static propTypes = {
        blocks : PropTypes.arrayOf(PropTypes.object).isRequired
    }
    render() {
        const { blocks } = this.props;

        return (
            <div className={styles.BaseContentWrapper}>
                {
                    blocks.map(({ title, subtitle, renderContent }, index) => (
                        <div key={`${title}${index}`} className={styles.blockWrapper}> {/* eslint-disable-line react/no-array-index-key*/}
                            { title && <h2 className={styles.formTitle}> {title} </h2>}
                            { subtitle && <h3 className={styles.formSubtitle}> {subtitle} </h3>}
                            {renderContent()}
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default BaseContentWrapper;
