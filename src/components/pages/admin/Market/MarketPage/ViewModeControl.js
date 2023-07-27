import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Theme                    from '../../../../../utils/theme';
import ListFlatIcon             from '../../../../base/icons/ListFlat';
import ListCardIcon             from '../../../../base/icons/ListCard';
import styles                   from './ViewModeControl.less';

const cx = classnames.bind(styles);

class ViewModeControl extends PureComponent {
    static contextType = Theme; //eslint-disable-line

    static propTypes = {
        viewMode         : PropTypes.string.isRequired,
        onToggleViewMode : PropTypes.func.isRequired
    }

    render() {
        const {
            viewMode,
            onToggleViewMode
        } = this.props;

        const { theme } = this.context;
        const viewModeControlCN = cx(styles.ViewModeControl, {
            [theme] : theme
        });

        return (
            <div className={viewModeControlCN}>
                <div
                    className={cx(styles.control, {
                        selected    : viewMode === 'card',
                        notSelected : viewMode !== 'card'
                    })}
                    onClick  = {onToggleViewMode}
                >
                    <ListCardIcon />
                </div>
                <div
                    className = {cx(styles.control, {
                        selected    : viewMode === 'list',
                        notSelected : viewMode !== 'list'
                    })}
                    onClick  = {onToggleViewMode}
                >
                    <ListFlatIcon />
                </div>
            </div>
        );
    }
}

export default ViewModeControl;
