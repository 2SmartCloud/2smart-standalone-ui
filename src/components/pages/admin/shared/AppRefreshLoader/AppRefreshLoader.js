import React  from 'react';
import styles from './AppRefreshLoader.less';

function AppRefreshLoader() {
    return (
        <div className={styles.AppRefreshLoader}>
            <div className={styles.label}>
                After restarting the application, the page will be reloaded automatically.
            </div>
            <div className={styles.loadingIndicator} />
        </div>
    );
}

export default AppRefreshLoader;
