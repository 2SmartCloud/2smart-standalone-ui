import React, { PureComponent } from 'react';
import styles from './Search.less';

class SearchIcon extends PureComponent {
    render() {
        return (
            <svg
                width='19' height='19' viewBox='0 0 19 19'
                fill='none' xmlns='http://www.w3.org/2000/svg'
                className={styles.SearchIcon}
            >
                <path
                    fillRule='evenodd' clipRule='evenodd'
                    d='M13.7764 12.5953L18.3764 17.2957C18.7656 17.6933 18.7527 18.3273 18.3482 18.7097C18.1579 18.8897 17.9072 18.9887 17.6429 18.9887C17.3636 18.9887 17.1031 18.8797 16.9093 18.682L12.2743 13.946C10.9583 14.8547 9.41891 15.3333 7.80357 15.3333C3.50075 15.3333 0 11.894 0 7.66667C0 3.43933 3.50075 0 7.80357 0C12.1064 0 15.6071 3.43933 15.6071 7.66667C15.6071 9.476 14.9591 11.214 13.7764 12.5953ZM13.5714 7.66667C13.5714 4.542 10.984 2 7.80357 2C4.62311 2 2.03571 4.542 2.03571 7.66667C2.03571 10.7913 4.62311 13.3333 7.80357 13.3333C10.984 13.3333 13.5714 10.7913 13.5714 7.66667Z'
                />
            </svg>
        );
    }
}

export default SearchIcon;
