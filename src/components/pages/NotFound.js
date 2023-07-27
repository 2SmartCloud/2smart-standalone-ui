import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import Theme from '../../utils/theme';
import Button from '../base/Button';
import styles from './NotFound.less';

class NotFoundPage extends PureComponent {
    static contextType = Theme; //eslint-disable-line

    static propTypes = {
        location : PropTypes.object.isRequired
    }

    render() {
        const { location } = this.props;

        const parts = location.pathname.split('/');
        const target = parts.includes('admin') ? '/admin' : '/';

        return (
            <div className={styles.NotFoundPage}>
                <h1 className={styles.title}>404</h1>
                <h2 className={styles.subTitle}>
                    The page you&apos;re looking for could not be found
                </h2>
                <span className={styles.message}>
                    Make sure the address is correct and the page hasn&apos;t moved
                </span>
                <Link to={target} className={styles.link}><Button text='Go to home page' autoFocus /></Link>
            </div>
        );
    }
}

export default withRouter(NotFoundPage);
