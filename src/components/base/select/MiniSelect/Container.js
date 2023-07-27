import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import ArrowIcon from '../../icons/Arrow';
import DefaultValue from './DefaultValue';
import styles from './Container.less';

const cn = classnames.bind(styles);

class Container extends PureComponent {
    render() {
        const { onClick, placeholder, defaultValue, isDisabled, isInvalid, placeholderType } = this.props;
        const ContainerCN = cn('Container', { disabled: isDisabled }, { withError: isInvalid });

        const placeholderStyle = this.props.style?.placeholder({});

        return (
            <div className={ContainerCN} onClick={onClick}>
                { !defaultValue ?
                    <div
                        style={placeholderStyle}
                        className={cn(styles.placeholder, {
                            [placeholderType] : placeholderType
                        })}
                    >
                        {placeholder}
                    </div> :
                    <div className={styles.defaultValueWrapper}>
                        <DefaultValue {...this.props} />
                    </div>
                }
                <div className={styles.iconWrapper}>
                    <ArrowIcon className={styles.icon} />
                </div>
            </div>
        );
    }
}

Container.propTypes = {
    onClick         : PropTypes.func.isRequired,
    placeholder     : PropTypes.string.isRequired,
    defaultValue    : PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
    placeholderType : PropTypes.oneOf([ 'primary', 'secondary', '' ]),
    style           : PropTypes.object,
    isDisabled      : PropTypes.bool,
    isInvalid       : PropTypes.bool
};

Container.defaultProps = {
    defaultValue    : undefined,
    placeholderType : '',
    style           : undefined,
    isDisabled      : false,
    isInvalid       : false
};

export default Container;
