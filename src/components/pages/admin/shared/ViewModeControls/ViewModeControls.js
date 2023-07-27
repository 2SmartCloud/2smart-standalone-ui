import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Theme                    from '../../../../../utils/theme';

import styles                   from './ViewModeControls.less';

const cx = classnames.bind(styles);


class ViewModeControls extends PureComponent {
    static contextType = Theme //eslint-disable-line

    static propTypes = {
        onChangeViewMode : PropTypes.func.isRequired,
        viewMode         : PropTypes.string,
        controls         : PropTypes?.arrayOf(PropTypes?.shape({
            id         : PropTypes?.string?.isrequired,
            label      : PropTypes?.string?.isrequired,
            isDisabled : PropTypes?.bool
        }))
    }

    static defaultProps = {
        viewMode : void 0,
        controls : []
    }

    handleChangeViewMode = (selected) => {
        return () => {
            const { onChangeViewMode, viewMode } = this.props;

            if (!selected || viewMode === selected) return;

            onChangeViewMode(selected);
        };
    }

    render() {
        const { controls, viewMode } = this.props;
        const { theme } = this.context;

        const viewModeControlsCN = cx(styles.ViewModeControls, {
            [theme] : theme
        });

        if (!controls?.length) return null;

        return (
            <div className={viewModeControlsCN}>
                { controls?.map(controlData => (
                    <div
                        key = {controlData?.id}
                        className={cx(styles.control, {
                            active   : viewMode === controlData?.id,
                            disabled : controlData?.isDisabled
                        })}
                        onClick={this.handleChangeViewMode(controlData?.id)}
                    >
                        {controlData?.label}
                    </div>
                ))}
            </div>
        );
    }
}

export default ViewModeControls;
