import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './ProcessingIndicator.less';

const cn = classnames.bind(styles);

class ProcessingIndicator extends PureComponent {
    render() {
        const { className, size } = this.props;
        const ProcessingIndicatorCN = cn('ProcessingIndicator', { [className]: className });

        return (
            <div className={ProcessingIndicatorCN} style={{ width: size, height: size }}>
                <CircularProgress
                    size='100%'
                    thickness={6}
                    color='inherit'
                    classes={{
                        svg : styles.progressSvg
                    }}
                />
            </div>
        );
    }
}

ProcessingIndicator.propTypes = {
    className : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    size      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
};

ProcessingIndicator.defaultProps = {
    className : '',
    size      : undefined
};

export default ProcessingIndicator;
