import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import styles                   from './GenericSortButton.less';

const cx = classnames.bind(styles);

class GenericSortButton extends PureComponent {
    static propTypes = {
        searchOrder : PropTypes.oneOf([ 'ASC', 'DESC' ]).isRequired,
        onChange    : PropTypes.func.isRequired
    }

    handleChangeOrder = () => {
        const { searchOrder, onChange } = this.props;

        onChange(searchOrder === 'ASC' ? 'DESC' : 'ASC');
    }

    render() {
        const { searchOrder } = this.props;

        return (
            <div
                className={styles.GenericSortButton}
                onClick={this.handleChangeOrder}
            >
                <div className={cx('sortIcon', { reversed: searchOrder === 'ASC' })}>
                    <span className={styles.line} />
                    <span className={styles.line} />
                    <span className={styles.line} />
                </div>
            </div>
        );
    }
}

export default GenericSortButton;
