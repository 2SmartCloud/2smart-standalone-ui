import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Base from './Base.js';

class Addon extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <Base
                className={className} width='26' height='25'
                viewBox='0 0 26 25'
                fill='none'
            >
                <path d='M22.8384 11.9048H21.0596V7.14286C21.0596 5.82738 19.9983 4.7619 18.6879 4.7619H13.9443V2.97619C13.9443 1.33333 12.6161 0 10.9796 0C9.34312 0 8.01494 1.33333 8.01494 2.97619V4.7619H3.27142C1.96102 4.7619 0.911517 5.82738 0.911517 7.14286L0.905588 11.6667H2.67848C4.44544 11.6667 5.88035 13.1071 5.88035 14.881C5.88035 16.6548 4.44544 18.0952 2.67848 18.0952H0.905588L0.899658 22.619C0.899658 23.9345 1.96102 25 3.27142 25H7.77776V23.2143C7.77776 21.4405 9.21267 20 10.9796 20C12.7466 20 14.1815 21.4405 14.1815 23.2143V25H18.6879C19.9983 25 21.0596 23.9345 21.0596 22.619V17.8571H22.8384C24.4749 17.8571 25.8031 16.5238 25.8031 14.881C25.8031 13.2381 24.4749 11.9048 22.8384 11.9048Z' fill='#BEBEBE' />
            </Base>
        );
    }
}

Addon.propTypes = {
    className : PropTypes.string
};

Addon.defaultProps = {
    className : undefined
};

export default Addon;
