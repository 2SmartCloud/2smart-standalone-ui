import React, { Component }         from 'react';
import PropTypes                    from 'prop-types';
import { connect }                  from 'react-redux';
import { BULB_WIDGET_TOPICS }       from '../../../../../assets/constants/widget';
import Theme                        from '../../../../../utils/theme';
import {
    // getOptions,
    getOptionByValue,
    getSortedOptionsByTitle
}                                   from '../../../../../utils/getSelectOpions';

import EntityControl                from '../../../../base/controls/Entity';
import * as WidgetActions           from '../../../../../actions/client/widget';
import GeneralTab                   from '../GeneralTab';

import styles                       from './styles.less';


class BulbWidgetGeneralTab extends Component {
    static propTypes = {
        selectedTopics      : PropTypes.array.isRequired,
        topics              : PropTypes.array.isRequired,
        onTopicSelect       : PropTypes.func.isRequired,
        onActiveValueChange : PropTypes.func.isRequired,
        selectTopic         : PropTypes.func.isRequired,
        onTopicDelete       : PropTypes.func.isRequired
    };

    static defaultProps = {
    };

    static contextType = Theme; //eslint-disable-line

    componentDidMount() {
        const { selectedTopics, selectTopic } = this.props;
        const activeValue = selectedTopics.find(topic => topic.order === 1);

        selectTopic(activeValue);
    }

    handleBlur = () => {
        this.input.blur();
    }

    handleKeyPress = e => {
        if (e.key === 'Enter') this.handleBlur();
    }

    handleSelectTopic = (order) => (value) => {
        const { onTopicSelect, onActiveValueChange } = this.props;

        if (order) onActiveValueChange(value);
        onTopicSelect({
            order,
            ...value
        });
    }


    handleClearTopic = (topic) => {
        const { onTopicDelete } = this.props;

        onTopicDelete(topic);
    }

    renderEntities = () => {
        const { selectedTopics, topics } = this.props;

        return  BULB_WIDGET_TOPICS.map(({ order, hardwareLabel, isRetained, isSettable, dataTypes }) => {
            const selectedTopic = selectedTopics.find(({ order:topicOrder }) => topicOrder === order) || '';
            const filteredTopics = topics.filter(topic =>
                dataTypes.includes(topic.dataType) &&
                topic.isSettable === isSettable &&
                topic.isRetained === isRetained
            );

            const defaultValue = selectedTopic ?  getOptionByValue(selectedTopic.topic, topics) : null;

            const sortedOptionsByTitle = getSortedOptionsByTitle(filteredTopics);
            // const topicsOptions = getOptions(defaultValue, sortedOptionsByTitle);

            return (
                <div key={order} className={styles.container}>
                    <div className={styles.label}>
                        {hardwareLabel}
                    </div>
                    <EntityControl
                        options  = {sortedOptionsByTitle}
                        onDelete = {this.handleClearTopic}
                        onChange = {this.handleSelectTopic(order)}
                        value    = {defaultValue}
                    />
                </div>
            );
        });
    }

    render() {
        const { topics } = this.props;

        return (
            <div className={styles.BulbWidgetGeneralTab}>
                <GeneralTab
                    topics             = {topics}
                    renderCustomFields = {this.renderEntities}
                />
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { widget = {} } = state.client || {};
    const { currTopic } = widget;

    return {
        activeValueTab : widget?.activeValueTab,
        selectedTopics : widget?.selectedTopics,
        topics         : widget?.topics,
        type           : widget?.type,
        minValue       : widget?.advanced?.minValue,
        maxValue       : widget?.advanced?.maxValue,
        chartColor     : widget?.advanced?.chartColor,
        step           : widget?.advanced?.step,
        dataType       : currTopic && currTopic?.dataType
    };
}

export default connect(mapStateToProps, { ...WidgetActions })(BulbWidgetGeneralTab);

