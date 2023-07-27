import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';

class Image extends PureComponent {
    static propTypes = {
        src            : PropTypes.string,
        className      : PropTypes.string,
        alt            : PropTypes.string,
        renderFallback : PropTypes.func
    }

    static defaultProps = {
        src            : '',
        className      : '',
        alt            : '',
        renderFallback : null
    }

    state = {
        isLoadError : false
    }

    handleLoadError = () => {
        this.setState({
            isLoadError : true
        });
    }

    render() {
        const { src, className, alt, renderFallback } = this.props;
        const { isLoadError } = this.state;

        if (isLoadError || !src) {
            return renderFallback
                ? renderFallback() || null
                : null;
        }

        return (
            <img
                src={src}
                className={className}
                alt={alt || ''}
                onError={this.handleLoadError}
            />
        );
    }
}

export default Image;
