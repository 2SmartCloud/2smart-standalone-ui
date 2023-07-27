import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';
import Theme from '../../utils/theme';
import CopyField from '../base/CopyField';
import styles from './CommandPage.less';

const cx = classnames.bind(styles);

const GET_2_SMART_COMMAND = 'curl -V > /dev/null && mkdir -p 2smart && cd 2smart && \curl https://standalone.2smart.com/install_2smart.sh > install_2smart.sh && \chmod +x install_2smart.sh && \sudo ./install_2smart.sh';  // eslint-disable-line

class CommandPage extends PureComponent {
    static contextType = Theme; //eslint-disable-line

    state = {
        showCurlTip    : false,
        showYahooCreds : false
    }

    handleShowCurlTip = () => {
        if (this.state.showTip) return;

        this.setState({
            showCurlTip : true
        });
    }

    handleShowYahooCreds = () => {
        this.setState({
            showYahooCreds : true
        });
    }

    render() {
        const { showCurlTip, showYahooCreds } = this.state;
        const { theme } = this.context;
        const commandPageCN = cx(styles.CommandPage, {
            [theme] : theme
        });

        return (
            <div className={commandPageCN}>
                <div className={styles.body}>
                    <p className={styles.title}>
                        To launch the application locally, copy this command and run in the console:
                    </p>
                    <CopyField
                        className = {styles.copyField}
                        value = {GET_2_SMART_COMMAND}
                        withFocus
                    />
                    <div className={styles.curlTip}>
                       * cURL should be installed on your system
                    </div>

                    { showCurlTip
                        ? (
                            <div className={styles.subtitle}>
                                How to install cURL:
                            </div>
                        ) : (
                            <div
                                className={styles.tipButton}
                                onClick={this.handleShowCurlTip}
                            >
                                How to install cURL?
                            </div>
                        )
                    }
                    { showCurlTip
                        ? (
                            <div className={styles.tipBlock}>
                                <div className={styles.tipItem}>
                                    <p className={styles.tipTitle}>
                                        CentOS / Fedora
                                    </p>
                                    <CopyField
                                        className={styles.tipValue}
                                        value = 'sudo yum update && sudo yum install curl'
                                    />
                                </div>
                                <div className={styles.tipItem}>
                                    <p className={styles.tipTitle}>
                                        Ubuntu / Debian
                                    </p>
                                    <CopyField
                                        className={styles.tipValue}
                                        value = 'sudo apt-get update && sudo apt-get install curl'
                                    />
                                </div>
                            </div>
                        ) : null
                    }
                    { showYahooCreds
                        ? (
                            <div className={styles.subtitle}>
                                OpenWeatherMap credentials:
                            </div>
                        ) : (
                            <div
                                className={styles.tipButton}
                                onClick={this.handleShowYahooCreds}
                            >
                                OpenWeatherMap credentials
                            </div>
                        )
                    }
                    { showYahooCreds
                        ? (
                            <div className={styles.tipBlock}>
                                <div className={styles.tipItem}>
                                    <p className={styles.tipTitle}>
                                        API Key
                                    </p>
                                    <CopyField
                                        className={styles.tipValue}
                                        value = '395694744c5d0d23d6cb1d61d1b9d0f7'
                                    />
                                </div>
                            </div>
                        ) : null
                    }
                </div>
            </div>
        );
    }
}

export default CommandPage;
