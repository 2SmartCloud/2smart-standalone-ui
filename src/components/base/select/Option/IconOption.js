import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import Image                    from '../../Image';
import BaseOption               from './BaseOption';

import styles                   from './IconOption.less';

const cn = classnames.bind(styles);

class IconOption extends PureComponent {
    static propTypes = {
        value : PropTypes.string.isRequired,
        label : PropTypes.string.isRequired,
        icon  : PropTypes.node.isRequired
    }

    render() {
        const { value, label, icon } = this.props;
        const IconOptionCN = cn('IconOption', { [value]: value });
        const fallbackForIcon = label?.slice(0, 1).toUpperCase();

        return (
            <BaseOption {...this.props}>
                {<div className={IconOptionCN}>
                    <Image
                        className      = {styles.icon}
                        src            = {icon}
                        renderFallback = {() => <div className={styles.fallbackIcon}>{ fallbackForIcon }</div>}    // eslint-disable-line
                    />
                    <span className={styles.optionLabel}>{label}</span>
                </div>}
            </BaseOption>
        );
    }
}

export default IconOption;
