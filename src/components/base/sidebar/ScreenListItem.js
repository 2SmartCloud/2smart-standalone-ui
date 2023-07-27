import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import * as ScreenActions from '../../../actions/client/screens';
import * as InterfaceActions from '../../../actions/interface';
import LockIcon from '../../base/icons/Lock';
import styles from './ScreenListItem.less';

const cn = classnames.bind(styles);

class ScreenListItem extends PureComponent {
    render() {
        const { isSecureModeEnabled, isClientPanelAccessGranted, onClick } = this.props;
        const { name, isActive, id, isParentControlEnabled } = this.props.screen;
        const ScreenListItemCN = cn('ScreenListItem', { active: isActive });

        return (
            <Link to={`/${id}`} className={styles.link}>
                <div className={ScreenListItemCN} onClick={onClick}>
                    { isActive && <div className={styles.activeBorder} /> }
                    <div className={styles.container}>
                        <p className={styles.name}>{name}</p>
                        <div className={styles.lockIconWrapper}>
                            {
                                isSecureModeEnabled && isParentControlEnabled ?
                                    <LockIcon isClosed={!isClientPanelAccessGranted} /> : null }
                        </div>
                    </div>
                </div>
            </Link>
        );
    }
}

ScreenListItem.propTypes = {
    screen                     : PropTypes.object.isRequired,
    onClick                    : PropTypes.func.isRequired,
    isSecureModeEnabled        : PropTypes.bool.isRequired,
    isClientPanelAccessGranted : PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        isSecureModeEnabled        : state.user.settings.isSecureModeEnabled.value,
        isClientPanelAccessGranted : state.user.isClientPanelAccessGranted
    };
}

export default connect(mapStateToProps, { ...ScreenActions, ...InterfaceActions })(ScreenListItem);
