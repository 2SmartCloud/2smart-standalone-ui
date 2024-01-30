import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JSMpeg from '@cycjimmy/jsmpeg-player';

export default class JsmpegPlayer extends Component {
    constructor(props) {
        super(props);

        this.videoWrapper = null;
    }

    componentDidMount() {
        this.video = new JSMpeg.VideoElement(
            this.videoWrapper,
            this.props.videoUrl,
            this.props.options,
            this.props.overlayOptions
        );

        if (this.props.onRef) this.props.onRef(this);
    }

    componentWillUnmount() {
        this.video.destroy();

        this.video = null;
        this.videoWrapper = null;
    }

    render() {
        return (
            <div
                style={{ width: '100%', height: '100%' }}
                ref={videoWrapper => this.videoWrapper = videoWrapper}
            />
        );
    }
}

JsmpegPlayer.propTypes = {
    videoUrl       : PropTypes.string.isRequired,
    options        : PropTypes.object,
    overlayOptions : PropTypes.object,
    onRef          : PropTypes.func.isRequired
};

JsmpegPlayer.defaultProps = {
    options        : {},
    overlayOptions : {}
};
