import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import JsmpegPlayer from './JsmpegPlayer';

import styles from './RtspMpeg.less';

const { protocol, hostname } = window.location;
const wsProtocol = protocol === 'http:' ? 'ws' : 'wss';

class RtspMpeg extends PureComponent {
    static propTypes = {
        value : PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);

        this.jsmpegPlayer = null;
    }

    handleRef = ref => {
        console.log({ ref });
        this.jsmpegPlayer = ref;
    }

    render() {
        return (
            <div className={styles.VideoContainer}>
                <JsmpegPlayer
                    videoUrl = {`${wsProtocol}://${hostname}${this.props.value}`}
                    onRef = {this.handleRef}
                />
            </div>
        );
    }
}

export default RtspMpeg;
