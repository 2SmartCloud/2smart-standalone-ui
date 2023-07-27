import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import { Tooltip }              from '@material-ui/core';
import Link                     from '../Link';
import CriticalValue            from '../CriticalValue';
import BinIcon                  from '../icons/Bin';
import Switch                   from './Switch';
import styles                   from './ListRow.less';

const cx = classnames.bind(styles);

class ListRow extends PureComponent {
    static propTypes = {
        type           : PropTypes.node.isRequired,
        altTypeColor   : PropTypes.bool,
        title          : PropTypes.string.isRequired,
        status         : PropTypes.string.isRequired,
        statusHint     : PropTypes.string,
        editPath       : PropTypes.string.isRequired,
        externalLink   : PropTypes.string,
        isProcessing   : PropTypes.bool,
        isDisabled     : PropTypes.bool,
        isEditAllowed  : PropTypes.bool,
        onSwitchToggle : PropTypes.func.isRequired,
        onDeleteItem   : PropTypes.func.isRequired,
        renderContent  : PropTypes.func,
        onEditClick    : PropTypes.func,
        classNames     : PropTypes.shape({
            title   : PropTypes.string,
            content : PropTypes.string
        })

    }

    static defaultProps = {
        altTypeColor  : false,
        statusHint    : undefined,
        isEditAllowed : true,
        isProcessing  : false,
        isDisabled    : false,
        renderContent : null,
        onEditClick   : null,
        externalLink  : '',
        classNames    : {}
    }

    renderTitle() {
        const { title, editPath, isEditAllowed, onEditClick } = this.props;

        const titleEl = (<CriticalValue value={title} maxWidth='100%' />);

        return isEditAllowed
            ? <Link to={editPath}>{titleEl}</Link>
            : <div onClick={onEditClick}> {titleEl} </div>;
    }

    renderEditButton() {
        const { editPath, isEditAllowed, onEditClick } = this.props;

        const editBtn = (
            <div style={{ width: '20px', height: '20px' }}>
                <svg
                    width='20' height='20' viewBox='0 0 16 16'
                    fill='none' xmlns='http://www.w3.org/2000/svg'
                >
                    <path d='M9.9492 2.67019L13.204 5.94086L4.96526 14.2199L1.71234 10.9492L9.9492 2.67019ZM15.6737 1.88138L14.2222 0.422776C13.6612 -0.140925 12.7504 -0.140925 12.1875 0.422776L10.7971 1.81998L14.0519 5.09068L15.6737 3.46092C16.1088 3.02368 16.1088 2.31859 15.6737 1.88138ZM0.00905723 15.5464C-0.0501753 15.8143 0.190506 16.0544 0.457113 15.9892L4.084 15.1055L0.831082 11.8348L0.00905723 15.5464Z' fill='#E9E9E9' />
                </svg>
            </div>
        );


        return isEditAllowed
            ? <Link to={editPath}>{editBtn}</Link>
            : <div onClick={onEditClick}> {editBtn} </div>;
    }

    renderExternalLink() {
        const { externalLink } = this.props;

        return (
            <a href={externalLink} target='_blank' rel='noopener noreferrer'>
                <div style={{ width: '20px', height: '20px' }}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg' height='20px' viewBox='0 0 24 24'
                        width='20px' fill='#E9E9E9'>
                        <path d='M0 0h24v24H0V0z' fill='transparent' />
                        <path d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z' />
                    </svg>
                </div>
            </a>
        );
    }

    renderSwitch() {
        const {
            status,
            isProcessing,
            isDisabled,
            onSwitchToggle
        } = this.props;

        const switchToggle = (
            <Switch
                status       = {status}
                onChange     = {onSwitchToggle}
                isProcessing = {isProcessing}
                disabled     = {isDisabled}
            />
        );

        return switchToggle;
    }

    render() {
        const {
            type, altTypeColor, isEditAllowed, onDeleteItem,
            statusHint, renderContent, classNames, externalLink,
            status, isProcessing
        } = this.props;
        const typeClasses = cx('type', { alt: altTypeColor });
        const { title, content }  = classNames;

        const withExternalLink = externalLink && status === 'ACTIVE' && !isProcessing;

        return (
            <div className={styles.ListRow}>
                <div className={typeClasses}>
                    {type}
                </div>
                <div className={cx(styles.content, { [content]: content })}>
                    <div className={cx('titleWrapper', { 'title_disabled': !isEditAllowed, [title]: title })}>
                        <div className={styles.title}>
                            <div className={cx(styles.criticalTitleWrapper, { 'with_link': withExternalLink })}>
                                {this.renderTitle()}
                            </div>
                            {
                                withExternalLink
                                    ? (
                                        <Tooltip title={`Open ${this.props.title} web-interface`}>
                                            <div className={styles.linkIconWrapper}>
                                                {this.renderExternalLink()}
                                            </div>
                                        </Tooltip>
                                    )
                                    : void 0
                            }
                        </div>
                    </div>

                    {renderContent}
                </div>
                <div className={styles.controls}>
                    { statusHint
                        ? (
                            <Tooltip
                                title   = {statusHint}
                                classes = {{ tooltip: cx('tooltip') }}
                            >
                                <div className={styles.actionButtonWrapper}>
                                    {this.renderSwitch()}
                                </div>
                            </Tooltip>
                        ) : (
                            <div className={styles.actionButtonWrapper}>
                                { this.renderSwitch() }
                            </div>
                        )
                    }
                    <Tooltip title='Delete'>
                        <div className={styles.deleteIconWrapper} onClick={onDeleteItem}>
                            <BinIcon />
                        </div>
                    </Tooltip>

                    <Tooltip title='Edit'>
                        <div className={styles.editIconWrapper}>
                            {this.renderEditButton()}
                        </div>
                    </Tooltip>
                </div>
            </div>
        );
    }
}

export default ListRow;
