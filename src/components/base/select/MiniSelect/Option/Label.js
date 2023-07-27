import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import Image                    from '../../../Image';
import Base                     from './Base.js';

import styles from './Label.less';

class LabelOption extends PureComponent {
    renderIcon = () => {
        const { option : { icon, label } } = this.props;
        const fallbackForIcon = label?.slice(0, 1).toUpperCase();

        return (
            icon
                ? (
                    <Image
                        className      = {styles.icon}
                        src            = {icon}
                        renderFallback = {() => <div className={styles.fallbackIcon}>{ fallbackForIcon }</div>}    // eslint-disable-line
                    />
                )
                : null
        );
    }

    render() {
        const { option: { label } } = this.props;

        return (
            <Base {...this.props}>
                <div className={styles.LabelOption}>
                    {this.renderIcon()}
                    <span className={styles.label}>{label}</span>
                </div>
            </Base>
        );
    }
}

LabelOption.propTypes = {
    option : PropTypes.shape({
        label : PropTypes.string.isRequired,
        icon  : PropTypes.string
    }).isRequired
};

export default LabelOption;
