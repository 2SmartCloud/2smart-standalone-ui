import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import IconButton from '@material-ui/core/IconButton';
import { Close } from '@material-ui/icons';
import Checkbox from '../../../../base/Checkbox/';

import Modal from '../../../Modal';
import List from '../List';
import SearchBar from './SearchBar';
import styles from './Menu.less';

const cx = classnames.bind(styles);

class Menu extends PureComponent {
    handleCloseButtonClick = () => {
        const { onClose } = this.props;

        onClose();
    }

    renderSearchBar = () => {
        const { isSearchable, onSearchChange, selectType } = this.props;

        return (
            <div className={styles.searchWrapper}>
                { isSearchable ?
                    <SearchBar onSearchChange={onSearchChange} />
                    :
                    null}
                {
                    selectType === 'topic'
                        ? this.renderTopicFilter()
                        : null
                }
            </div>
        );
    }

    renderTopicFilter = () => {
        const { isCheckboxChecked, onCheckboxChange, options } = this.props;
        const isCheckboxRender = !!options.length  || isCheckboxChecked;

        return (
            isCheckboxRender && <div className = {styles.checkBoxWrapper}>
                <Checkbox
                    checked={isCheckboxChecked}
                    onChange={onCheckboxChange}
                    label='Show only active'
                    inputProps={{ 'aria-label': 'Show only active' }}
                />
            </div>
        );
    }

    render() {
        const { isOpen, renderFooter, isSearchable, mobileTitle  } = this.props;

        return (
            <Modal isOpen={isOpen}>
                <div className={styles.Menu}>
                    <div className={styles.header}>
                        <div className={styles.title}>{mobileTitle}</div>
                        <IconButton
                            className={styles.closeButton}
                            disableFocusRipple
                            disableRipple
                            onClick={this.handleCloseButtonClick}
                        >
                            <Close />
                        </IconButton>
                    </div>
                    {this.renderSearchBar()}
                    <div
                        className={cx('content', {
                            withSearch : isSearchable,
                            withTitle  : !!mobileTitle
                        })}>
                        <List {...this.props} />
                    </div>
                    {renderFooter ?  <div> {renderFooter()} </div> : null}
                </div>
            </Modal>
        );
    }
}

Menu.propTypes = {
    isOpen            : PropTypes.bool.isRequired,
    onClose           : PropTypes.func.isRequired,
    onSearchChange    : PropTypes.func.isRequired,
    mobileTitle       : PropTypes.string,
    isSearchable      : PropTypes.bool,
    renderFooter      : PropTypes.func,
    onCheckboxChange  : PropTypes.func,
    isCheckboxChecked : PropTypes.bool,
    selectType        : PropTypes.string,
    options           : PropTypes.array
};

Menu.defaultProps = {
    isSearchable      : false,
    mobileTitle       : '',
    renderFooter      : undefined,
    onCheckboxChange  : undefined,
    isCheckboxChecked : false,
    selectType        : '',
    options           : []
};

export default Menu;
