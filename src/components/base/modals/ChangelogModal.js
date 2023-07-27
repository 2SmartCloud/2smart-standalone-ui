import React, {
    PureComponent
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import ReactMarkdown            from 'react-markdown/with-html';
import { Close }                from '@material-ui/icons';
import IconButton               from '@material-ui/core/IconButton';
import Theme                    from '../../../utils/theme';
import api                      from '../../../apiSingleton';
import LoadingNotification      from '../../base/LoadingNotification';
import Modal                    from '../../base/Modal';
import styles                   from './ChangelogModal.less';

const cx = classnames.bind(styles);

export default class ChangelogModal extends PureComponent {
    static contextType = Theme; //eslint-disable-line

    static propTypes = {
        onClose : PropTypes.func.isRequired,
        isOpen  : PropTypes.bool
    }

    static defaultProps={
        isOpen : false
    }

    state = {
        data      : null,
        isLoading : true
    }

    componentDidMount() {
        this.fetchChangelogData();
    }

    fetchChangelogData = async () =>  {
        this.setState({ isLoading: true });

        try {
            const response = await api.changelog.get();
            const { current, old, previous } = response;
            const changelogsList = [ current, previous, old ]?.filter(changelog => !!changelog);

            if (changelogsList?.length) {
                const dataToSet = changelogsList?.join('<a/>\n\n\n --- \n\n\n');

                this.setState({
                    data      : dataToSet,
                    isLoading : false
                });
            } else {
                this.setState({
                    isLoading : false
                });
            }
        } catch (error) {
            console.error(error);
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { isOpen, onClose } = this.props;
        const { isLoading, data } = this.state;
        const { theme } = this.context;
        const changelogModalCN = cx('ChangelogModal', {
            dark  : theme === 'DARK',
            empty : !isLoading && !data
        });

        return (
            <Modal
                isOpen  = {isOpen}
                onClose = {onClose}
            >
                <div  className={changelogModalCN}>
                    <div className={styles.container}>
                        <IconButton
                            className = {styles.closeButton}
                            onClick   = {onClose}
                            disableFocusRipple
                            disableRipple
                        >
                            <Close />
                        </IconButton>
                        <h1 className={styles.title}>
                            What’s new in this update?
                        </h1>
                        <div className={styles.content}>
                            { data
                                ? (
                                    <ReactMarkdown
                                        source     = {data}
                                        escapeHtml = {false}
                                    />
                                ) : null
                            }
                            { !isLoading && !data
                                ? (
                                    <div className={styles.emptyList}>
                                        There are no latest changelogs yet…<br />
                                        You will get them with next release
                                    </div>
                                ) : null
                            }
                            { isLoading
                                ? (
                                    <div className={styles.loaderWrapper}>
                                        <LoadingNotification text='Loading data' />
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

