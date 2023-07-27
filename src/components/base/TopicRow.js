import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';

import PropTypes from 'prop-types';

import styles from './TopicRow.less';

const cx = classnames.bind(styles);

class TopicRow extends PureComponent {
    static propTypes= {
        value     : PropTypes.string,
        className : PropTypes.string,
        onClose   : PropTypes.func
    }

    static defaultProps= {
        value     : '',
        className : '',
        onClose   : () => {}
    }

    componentDidMount() {
        this.addOutOfFormClickListener();
        try {
            this.topicRef.click();
            const selection = window.getSelection();
            const range = document.createRange();

            selection.removeAllRanges();

            range.selectNode(this.topicRef);
            selection.addRange(range);
        } catch (err) {
            console.error(err);
        }
    }

    componentWillUnmount() {
        this.removeOutOfFormClickListener();
    }

    handleOutOfFormClick = e => {
        if (!this.topicRef || !this.topicRef.contains(e.target)) {
            this.props.onClose();
        }
    }

    addOutOfFormClickListener = () => {
        document.addEventListener('click', this.handleOutOfFormClick);
        document.addEventListener('touchend', this.handleOutOfFormClick);
    }

    removeOutOfFormClickListener = () => {
        document.removeEventListener('click', this.handleOutOfFormClick);
        document.removeEventListener('touchend', this.handleOutOfFormClick);
    }

    render() {
        const { className } = this.props;

        return (
            <span
                className={cx(styles.TopicRow, { [className]: className })}
                ref={ref => this.topicRef = ref}>
                <span>{this.props.value}</span>
            </span>
        );
    }
}

export default TopicRow;
