/* eslint-disable react/no-multi-comp */
/* eslint-disable func-style */
import React, { Component }         from 'react';
import PropTypes                    from 'prop-types';
import { connect }                  from 'react-redux';
import classnames                   from 'classnames/bind';

import Theme                        from '../../../../utils/theme';
import {
    GAUGE_DEFAULT_MIN,
    GAUGE_DEFAULT_MAX,
    SLIDER_DEFAULT_MIN,
    SLIDER_DEFAULT_MAX
}                                   from '../../../../assets/constants/widget';
import EntityControl                from '../../../base/controls/Entity';
import EntitiesControl              from '../../../base/controls/Entities';
import Input                        from '../../../base/inputs/String';

import { getWidgetBackgroundColor } from '../../../../utils/theme/widget/getColors';
import {
    // getOptions,
    getOptionByValue
}                                   from '../../../../utils/getSelectOpions';
import ColorSelect                  from './tab/ColorSelect';

import * as WidgetActions           from './../../../../actions/client/widget';
import styles                       from './GeneralTab.less';

const cn = classnames.bind(styles);

class GeneralTab extends Component {
    static contextType = Theme; //eslint-disable-line

    componentDidMount() {
        const { setWidgetOption, type, minValue, maxValue, chartColor, ledColor } = this.props; //eslint-disable-line

        if (type === 'Chart') {
            if (!chartColor) {
                setWidgetOption({ key: 'chartColor', value: 'blue-green', isAdvanced: true });
            }
        }

        if (type === 'Gauge') {
            if (!minValue) {
                setWidgetOption({ key: 'minValue', value: GAUGE_DEFAULT_MIN, isAdvanced: true });
            }
            if (!maxValue) {
                setWidgetOption({ key: 'maxValue', value: GAUGE_DEFAULT_MAX, isAdvanced: true });
            }
        }

        if (type === 'Slider') {
            if (!minValue) {
                setWidgetOption({ key: 'minValue', value: SLIDER_DEFAULT_MIN, isAdvanced: true });
            }
            if (!maxValue) {
                setWidgetOption({ key: 'maxValue', value: SLIDER_DEFAULT_MAX, isAdvanced: true });
            }
        }

        if (type === 'Led') {
            if (!ledColor) {
                setWidgetOption({ key: 'ledColor', value: 'blue-green', isAdvanced: true });
            }
        }

        if (type === 'Bulb') {
            if (!minValue) {
                setWidgetOption({ key: 'minValue', value: SLIDER_DEFAULT_MIN, isAdvanced: true });
            }
            if (!maxValue) {
                setWidgetOption({ key: 'maxValue', value: SLIDER_DEFAULT_MAX, isAdvanced: true });
            }
        }
    }

    handleNameChange = name => {
        if (name.length > 25) return;

        this.props.changeName(name);
    }

    handleColorChange = (value) => {
        this.props.changeColor(value);
    }

    handleBlur = () => {
        this.input.blur();
    }

    handleKeyPress = e => {
        if (e.key === 'Enter') this.handleBlur();
    }

    getColorSelectOptions = () => {
        const { theme } = this.context;
        const options = [
            { value: 'white' },
            { value: 'blue' },
            { value: 'green' },
            { value: 'yellow' },
            { value: 'orange' },
            { value: 'red' },
            { value: 'violet' },
            { value: 'light-blue' },
            { value: 'light-green' },
            { value: 'pink' },
            { value: 'dark-gray' },
            { value: 'light-gray' }
        ].map(({ value }) => {
            return { value, color: getWidgetBackgroundColor(value, theme) };
        });

        return options;
    }

    getDefaultSelectOption = () => {
        const { theme } = this.context;
        const value = 'white';
        const color = getWidgetBackgroundColor(value, theme);

        return { value, color };
    }

    handleChangeEntity = (entity) => {
        const { onTopicChange } = this.props;

        // if (propertyType === 'group') {
        //     onGroupChange(entity);
        // } else {
        onTopicChange(entity);
        // }
    }

    renderEntities = () => {
        const {
            topics,
            selectedTopics,
            onTopicSelect,
            onTopicDelete,
            onTopicsOrderChange
        } = this.props;

        return (
            <EntitiesControl
                options       = {topics}
                onOrderChange = {onTopicsOrderChange}
                onValueSelect = {onTopicSelect}
                onValueDelete = {onTopicDelete}
                value         = {selectedTopics}
            />);
    }

    renderEntity = () => {
        const {
            topics,
            currTopic,
            groups,
            isOnlyTopicConnect
        } = this.props;

        const options = isOnlyTopicConnect
            ? topics
            : [ ...topics, ...groups ];

        // const groupValue = currGroup ? groups?.find(group => group?.topic === currGroup?.topic) : null;
        const defaultValue = currTopic ? getOptionByValue(currTopic?.topic, options) : null;
        // const defaultGroup = groupValue
        //     ? ({
        //         label        : groupValue?.label || currGroup?.topicName,
        //         value        : groupValue?.topic,
        //         topic        : groupValue?.topic,
        //         propertyType : 'group',
        //         isDeleted    : !groupValue
        //     }) : null;
        // const entityValue = defaultValue || defaultGroup;

        // const topicsOptions = getOptions(defaultValue, topics);
        // const groupsOptions = getOptions(defaultGroup, groups);

        return (
            <EntityControl
                options  = {options}
                onChange = {this.handleChangeEntity}
                value    = {defaultValue}
            />);
    }

    render() {
        const { name, bgColor, isEntities, renderCustomFields }   = this.props;
        const colorSelectOptions  = this.getColorSelectOptions();
        const defaultSelectOption = this.getDefaultSelectOption();

        return (
            <div className={styles.GeneralTab}>
                <div className={cn('container', 'withMargin')}>
                    <div className={styles.label}>
                        Title
                    </div>
                    <Input
                        inputClassName = {styles.input}
                        value          = {name}
                        onChange       = {this.handleNameChange}
                        placeholder    = {'Widget\'s title'}
                        ref            = {ref => this.input = ref}
                        darkThemeSupport
                    />
                </div>
                { renderCustomFields
                    ? renderCustomFields()
                    : (
                        <div className={cn(styles.container, { withMargin: true })}>
                            <div className={styles.label}>
                                { isEntities ? 'Entities' : 'Entity' }
                            </div>
                            { isEntities
                                ? this.renderEntities()
                                : this.renderEntity()
                            }
                        </div>
                    )
                }
                <div className={cn(styles.container, { withMargin: true })}>
                    <div className={styles.label}>
                        Background color
                    </div>
                    <ColorSelect
                        value         = {bgColor}
                        options       = {colorSelectOptions}
                        defaultOption = {defaultSelectOption}
                        placeholder   = 'Select color'
                        onChange      = {this.handleColorChange}
                    />
                </div>
            </div>
        );
    }
}

GeneralTab.propTypes = {
    topics              : PropTypes.array.isRequired,
    groups              : PropTypes.array.isRequired,
    onTopicChange       : PropTypes.func.isRequired,
    // onGroupChange       : PropTypes.func.isRequired,
    currTopic           : PropTypes.object,
    // currGroup           : PropTypes.object,
    bgColor             : PropTypes.string,
    name                : PropTypes.string,
    changeName          : PropTypes.func.isRequired,
    changeColor         : PropTypes.func.isRequired,
    isOnlyTopicConnect  : PropTypes.bool,
    isEntities          : PropTypes.bool,
    selectedTopics      : PropTypes.array,
    onTopicSelect       : PropTypes.func,
    onTopicDelete       : PropTypes.func,
    renderCustomFields  : PropTypes.func,
    onTopicsOrderChange : PropTypes.func
};

GeneralTab.defaultProps = {
    bgColor             : '#ffffff',
    name                : '',
    currTopic           : {},
    // currGroup           : {},
    selectedTopics      : void 0,
    onTopicSelect       : void 0,
    onTopicDelete       : void 0,
    onTopicsOrderChange : void 0,
    renderCustomFields  : void 0,
    isOnlyTopicConnect  : false,
    isEntities          : false
};


function mapStateToProps(state) {
    const { widget } = state.client || {};
    const { currTopic } = widget || {};

    return {
        currTopic      : widget.currTopic,
        currGroup      : widget.currGroup,
        bgColor        : widget.bgColor,
        name           : widget.name,
        type           : widget.type,
        selectedTopics : widget.selectedTopics,
        minValue       : widget.advanced.minValue,
        maxValue       : widget.advanced.maxValue,
        chartColor     : widget.advanced.chartColor,
        step           : widget.advanced.step,
        dataType       : currTopic && currTopic.dataType
    };
}

export default connect(mapStateToProps, { ...WidgetActions })(GeneralTab);
