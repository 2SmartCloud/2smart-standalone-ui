import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from '../../../../../base/Button';

import styles from './Footer.less';

class Footer extends PureComponent {
    static propTypes = {
        onSubmit : PropTypes.func,
        onDeny   : PropTypes.func,
        setRef   : PropTypes.func
    }

    static defaultProps = {
        onSubmit : undefined,
        onDeny   : undefined,
        setRef   : undefined
    }

    render() {
        const { onDeny, onSubmit, setRef } = this.props;

        return (
            <div className={styles.Footer}>
                <Button
                    onClick={onDeny}
                >Cancel
                </Button>
                <Button
                    setRef={setRef}
                    type='submit'
                    onClick={onSubmit}
                >Save
                </Button>
            </div>
        );
    }
}

export default Footer;
