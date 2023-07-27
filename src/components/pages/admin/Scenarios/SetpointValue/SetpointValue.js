import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import ProcessingIndicator      from '../../../../base/ProcessingIndicator';
import styles                   from './SetpointValue.less';

export const EMPTY_LABEL = 'Configuration';

class ScenarioSetpoints extends PureComponent {
    static propTypes = {
        setpoints : PropTypes.array,
        onClick   : PropTypes.func,
        isLoading : PropTypes.bool
    }

    static  defaultProps={
        setpoints : [],
        onClick   : () => {},
        isLoading : false
    }

    getLabel = () => {
        const { setpoints } = this.props;
        const value = setpoints[0]?.value;

        return value || EMPTY_LABEL;
    }

    getMoreLabel = () => {
        const { setpoints } = this.props;
        const setpointsCount = setpoints.length;
        const moreLabel = setpointsCount > 1 ? ', ...' : null;

        return moreLabel;
    }


    renderSetpoints = () => {
        const { onClick } = this.props;
        const label = this.getLabel();
        const moreLabel = label !== EMPTY_LABEL
            ? this.getMoreLabel()
            : null;

        return (
            <div
                ref       = {node => this.content = node}
                className = {styles.setpointsWrapper} onClick={onClick}
            >
                <span className={styles.setpointValue}>
                    { label }
                </span>
                <span className={styles.setpointMoreLabel}>
                    { moreLabel }
                </span>
            </div>
        );
    }


    render() {
        const {  isLoading } = this.props;

        return (
            <div className={styles.SetpointsContainer} >
                { isLoading
                    ?  <div className={styles.processing}>
                        <ProcessingIndicator />
                    </div>
                    : this.renderSetpoints()
                }
            </div>
        );
    }
}

export default ScenarioSetpoints;
