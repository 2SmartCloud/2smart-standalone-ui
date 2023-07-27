import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './CopyField.less';

const cx = classnames.bind(styles);

class CopyField extends PureComponent {
    static propTypes={
        className : PropTypes.string,
        value     : PropTypes.string,
        withFocus : PropTypes.bool
    }

    static defaultProps = {
        className : '',
        value     : '',
        withFocus : false
    }

    componentDidMount() {
        if (this.props.withFocus) {
            try {
                this.filed.click();
                const selection = window.getSelection();
                const range = document.createRange();

                selection.removeAllRanges();

                range.selectNode(this.filed);
                selection.addRange(range);
            } catch (err) {
                console.error(err);
            }
        }
    }

    handleCopyText(text) {
        return () => {
            if (!navigator?.clipboard) {
                this.fallbackCopyTextToClipboard(text);

                return;
            }

            navigator?.clipboard?.writeText(text).then(() => {
                // pass
            }, (err) => {
                console.error('Async: Could not copy text: ', err);
            });
        };
    }

    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');

        textArea.value = text;

        textArea.style.opacity = 0;
        // Avoid scrolling to bottom
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';

        const container = document.body;

        container.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            // console.log(`Fallback: Copying text command was ${  msg}`);
            // pass
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        container.removeChild(textArea);
    }

    render() {
        const { className } = this.props;

        return (
            <div
                className={cx(styles.CopyField, { [className]: className })}
                ref={ref => this.filed = ref}
            >
                {this.props.value}
                <div className={styles.copyIcon} onClick={this.handleCopyText(this.props.value)} />
            </div>
        );
    }
}

export default CopyField;
