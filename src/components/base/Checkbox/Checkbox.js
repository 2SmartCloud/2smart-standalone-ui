import Checkbox from '@material-ui/core/Checkbox';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './Checkbox.less';


class WrappedCheckbox extends PureComponent {
    static propTypes= {
        label    : PropTypes.string,
        onChange : PropTypes.func.isRequired
    }

    static defaultProps={
        label : ''
    }

    render = () => {
        const { label, onChange, ...restProps } = this.props;

        return (
            <div className={styles.Checkbox} onClick={onChange}>
                <Checkbox
                    classes={{
                        root         : styles.root,
                        checked      : styles.checked,
                        colorPrimary : styles.primaryColor
                    }}
                    iconStyle={{ color: 'white' }}
                    onChange={onChange}
                    color='primary'
                    {...restProps}
                />
                <span className={styles.label}>{label}</span>
            </div>
        );
    };
}

export default WrappedCheckbox;
