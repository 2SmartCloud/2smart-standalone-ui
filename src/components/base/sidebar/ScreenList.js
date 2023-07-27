import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { throttle } from 'throttle-debounce';
import * as ScreenActions from '../../../actions/client/screens';
import * as UserActions from '../../../actions/user';
import * as InterfaceActions from '../../../actions/interface';
import ScreenListItem from './ScreenListItem';

import styles from './ScreenList.less';

class ScreenList extends PureComponent {
    handleSelectScreen = id => {
        const { getSettings, getScreens, getScreen, onScreenSelect, hidePinForm } = this.props;

        hidePinForm();
        getSettings();
        getScreens();
        getScreen(id);

        onScreenSelect(id);
    }

    handleSelectScreenDebounced = throttle(1000, id => this.handleSelectScreen(id))

    render() {
        const { screens } = this.props;

        return (
            <div className={styles.ScreenList}>
                <div className={styles.listItems} id='screens-list-container'>
                    {
                        screens.map(screen => {
                            return (
                                <ScreenListItem
                                    key={screen.id}
                                    screen={screen}
                                    onClick={this.handleSelectScreenDebounced.bind(null, screen.id)}
                                />
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

ScreenList.propTypes = {
    screens        : PropTypes.array.isRequired,
    onScreenSelect : PropTypes.func.isRequired,
    getScreens     : PropTypes.func.isRequired,
    getScreen      : PropTypes.func.isRequired,
    getSettings    : PropTypes.func.isRequired,
    hidePinForm    : PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        screen              : state.client.dashboard.screens.find(({ isActive }) => isActive === true),
        isSecureModeEnabled : state.user.settings.isSecureModeEnabled.value,
        isScreensFetching   : state.client.dashboard.isFetching
    };
}

export default connect(mapStateToProps, { ...ScreenActions, ...UserActions, ... InterfaceActions })(ScreenList);

