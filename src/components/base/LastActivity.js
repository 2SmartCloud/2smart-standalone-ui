import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getHumanizeLabel } from '../../utils/homie/getLastSeenLabel';
import styles from './LastActivity.less';

const UPDATE_INTERVAL = 60000;

class LastActivity extends PureComponent {
    static propTypes = {
        lastActivity : PropTypes.number
    };

    static defaultProps = {
        lastActivity : undefined
    };

    constructor(props) {
        super(props);
        this.interval = undefined;
    }

    state = {
        customLabel : ''
    }

    componentDidMount() {
        const { lastActivity } = this.props;

        this.updateInterval(lastActivity);
    }

    componentDidUpdate(prevProps) {
        const { lastActivity } = this.props;

        if (prevProps.lastActivity !== lastActivity) {
            this.updateInterval(lastActivity);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    updateInterval = (lastActivity) => {
        clearInterval(this.interval);

        this.setState({
            customLabel : getHumanizeLabel(lastActivity)
        });

        this.interval = setInterval(() => {
            this.setState({
                customLabel : getHumanizeLabel(lastActivity)
            });
        }, UPDATE_INTERVAL);
    }

    render() {
        const { customLabel } = this.state;


        return (
            customLabel
                ? <div className={styles.LastActivity}>
                    {customLabel}
                </div>
                : null
        );
    }
}

export default LastActivity;
