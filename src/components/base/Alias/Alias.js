import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import StringControl from '../controls/String';
import Copy from '../icons/Copy';
import TopicRow from '../TopicRow';

import styles from './Alias.less';

const cx = classnames.bind(styles);

class Alias extends PureComponent {
    static propTypes = {
        name          : PropTypes.string,
        isNew         : PropTypes.bool,
        topic         : PropTypes.string,
        id            : PropTypes.string,
        disabled      : PropTypes.bool,
        onAliasError  : PropTypes.func.isRequired,
        onChangeAlias : PropTypes.func.isRequired,
        onDeleteAlias : PropTypes.func.isRequired,
        createAlias   : PropTypes.func.isRequired
    }

    static defaultProps = {
        name     : '',
        topic    : '',
        id       : '',
        disabled : false,
        isNew    : false
    }

    state = {
        isProcessing          : false,
        isCopyVissible        : !this.props.isNew,
        isRenderStringControl : false
    }

    componentDidUpdate(prevProps) {
        const { isNew } = this.props;

        if (prevProps.isNew !== isNew) {
            this.setState({
                isCopyVissible        : true,
                isRenderStringControl : !isNew
            });
        }
    }

    handleCopyName=() => {
        this.setState({
            isCopyOpened : true
        });
    }

    handleCloseCopy = () => {
        this.setState({
            isCopyOpened : false
        });
    }

    handleCreateButtonClick = () => {
        this.setState({
            isRenderStringControl : true
        });
    }

    handleDeactiveteControl = () => {
        this.setState((state, props) => props.isNew
            ? {
                isRenderStringControl : false,
                isError               : false
            }
            : {
                isCopyVissible : true,
                isError        : false
            });
    }

    handleHideCopyButton = () => {
        this.setState({
            isCopyVissible : false
        });
    }

    setAliasName =  async ({ value }) => {
        const { isNew, createAlias, onDeleteAlias, onAliasError, onChangeAlias, topic, id } = this.props;

        this.setState({
            isProcessing : true,
            isError      : false
        });

        try {
            if (isNew) {
                await createAlias({
                    name : value,
                    topic
                });
            } else if (value.length) {
                await onChangeAlias({
                    name     : value,
                    entityId : id
                });
            } else {
                await onDeleteAlias({
                    entityId : id
                });
            }
        } catch (err) {
            if (err) {
                onAliasError(err, id);
                this.setState({
                    isError : true });
            }
        } finally {
            this.setState({
                isProcessing : false
            });
        }
    }

    renderCreateButton = () => {
        return (
            <div className={styles.createButton} onClick={this.handleCreateButtonClick}>
                Create alias
            </div>
        );
    }

    renderControl = () => {
        const { name } = this.props;
        const { isCopyOpened } = this.state;

        return  isCopyOpened
            ? <TopicRow className={styles.copyField} value={name} onClose={this.handleCloseCopy} />
            : this.renderContent();
    }

    renderContent = () => {
        const { isProcessing, isError, isRenderStringControl, isCopyVissible } = this.state;
        const { name, isNew, id } = this.props;

        return (
            <>
                <StringControl
                    maxLength={100}
                    spinnerSize={12}
                    inputClassName={styles.aliasInput}
                    formClassName={styles.inputWrapper}
                    dataWrapperClassName={styles.valueWrapper}
                    isTransparent
                    value={name}
                    activateOnMount={isRenderStringControl && isNew}
                    onActive={this.handleHideCopyButton}
                    onCloseControl={this.handleDeactiveteControl}
                    isSettable
                    darkThemeSupport
                    propertyId={id}
                    setValue={this.setAliasName}
                    isProcessing={isProcessing}
                    isError={isError}
                    baseControlClassName={styles.controlWrapper}
                />
                {
                    isCopyVissible
                        ? <div className={styles.copyButtonWrapper} onClick ={this.handleCopyName}>
                            <Copy className={styles.copyButtonWrapper}  />
                        </div>
                        : null
                }
            </>
        );
    }

    render = () => {
        const { isRenderStringControl } = this.state;
        const { isNew, disabled } = this.props;
        const AliasCN = cx(styles.Alias, { isNew }, { disabled });
        const isRenderButton = isNew && !isRenderStringControl;


        return (
            <div className={AliasCN}>
                {
                    isRenderButton
                        ? this.renderCreateButton()
                        : this.renderControl()
                }
            </div>
        );
    };
}

export default Alias;
