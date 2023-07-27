import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import Theme                    from '../../../utils/theme';
import styles                   from './WifiTower.less';

const cx = classnames.bind(styles);

class WifiTowerIcon extends PureComponent {
    static contextType = Theme; //eslint-disable-line

    static propTypes = {
        isShowIndicator : PropTypes.bool
    }

    static defaultProps = {
        isShowIndicator : false
    }

    render() {
        const { isShowIndicator } = this.props;
        const { theme } = this.context;
        const wifiTowerCN = cx(styles.WifiTower, {
            [theme] : theme
        });

        return (
            <div className={wifiTowerCN}>
                <svg
                    width='21' height='24' viewBox='0 0 21 24'
                    fill='none' xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        fillRule='evenodd' clipRule='evenodd' d='M3.38659 0.862L2.50933 0C-0.836444 3.292 -0.836444 8.65133 2.50933 11.9433L3.38523 11.0807C0.52246 8.264 0.523137 3.68 3.38659 0.862ZM17.9918 11.9433L17.1158 11.0807C19.9786 8.26267 19.9779 3.67933 17.1145 0.862L17.9918 0C21.3382 3.292 21.3382 8.65133 17.9918 11.9433ZM15.5998 9.58933L16.4757 10.4533C18.9862 7.982 18.9862 3.96133 16.4757 1.49133L15.5998 2.35333C17.6266 4.34733 17.6266 7.59533 15.5998 9.58933ZM14.9122 3.02933C16.5617 4.65067 16.5617 7.29133 14.9129 8.91333L14.0363 8.05067C15.2028 6.90533 15.2028 5.03933 14.0363 3.89133L14.9122 3.02933ZM4.90062 9.58933L4.02404 10.4533C1.51285 7.982 1.51285 3.96067 4.02404 1.49067L4.90062 2.35333C2.87378 4.34933 2.87378 7.59533 4.90062 9.58933ZM5.58752 8.91333L6.46411 8.05067C5.29894 6.90333 5.29894 5.03733 6.46478 3.89133L5.5882 3.02933C3.93936 4.65267 3.93936 7.292 5.58752 8.91333ZM12.2757 21.1053H15.2895C16.0022 21.1053 16.5787 21.674 16.5787 22.3733C16.5787 23.072 16.0022 23.6413 15.2902 23.6413H5.21088C4.49959 23.6413 3.92243 23.074 3.92243 22.3733C3.92243 21.674 4.49891 21.1053 5.21088 21.1053H8.22472L10.0314 8.25267C9.19004 8.146 8.53701 7.446 8.53701 6.588C8.53701 5.658 9.30385 4.90267 10.2502 4.90267C11.1959 4.90267 11.9634 5.65733 11.9634 6.588C11.9634 7.446 11.3104 8.146 10.4683 8.25267L12.2757 21.1053Z'
                        fill='#D8D8D8' />
                </svg>
                { isShowIndicator
                    ? <div className={styles.newDeviceIndicator} />
                    : null
                }
            </div>
        );
    }
}

export default WifiTowerIcon;
