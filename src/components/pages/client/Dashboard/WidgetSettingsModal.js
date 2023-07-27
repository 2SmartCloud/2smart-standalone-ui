import React, { Component }  from 'react';
import PropTypes             from 'prop-types';
import { connect }           from 'react-redux';
import { Close }             from '@material-ui/icons';
import IconButton            from '@material-ui/core/IconButton';
import LIVR                  from 'livr';
import {
    DEFAULT_WIDGET_COLOR_VALUE,
    WIDGETS_MAP
}                            from '../../../../assets/constants/widget';
import * as WidgetActions    from '../../../../actions/client/widget';
import globalEnterHandler    from '../../../../utils/globalEnterHandler';
import Modal                 from '../../../base/Modal';
import Button                from '../../../base/Button';
import Tabs                  from '../../../base/Tabs';
import GeneralTab            from './GeneralTab';
import AdvancedTab           from './AdvancedTab';

import AlarmWidgetGeneralTab    from './AlarmWidgetGeneralTab';
import BulbWidgetGeneralTab     from './BulbWidgetGeneralTab';
import ScheduleWidgetGeneralTab from './ScheduleWidgetGeneralTab';

import styles                from './WidgetSettingsModal.less';

class WidgetSettingsModal extends Component {
    static propTypes = {
        isOpen                     : PropTypes.bool.isRequired,
        onClose                    : PropTypes.func.isRequired,
        topics                     : PropTypes.array,
        groups                     : PropTypes.array,
        selectedTopics             : PropTypes.array.isRequired,
        params                     : PropTypes.object,
        isSaving                   : PropTypes.bool,
        activeValue                : PropTypes.object,
        advanced                   : PropTypes.object,
        errors                     : PropTypes.object.isRequired,
        onSave                     : PropTypes.func.isRequired,
        selectTopic                : PropTypes.func.isRequired,
        selectGroup                : PropTypes.func.isRequired,
        addTopicsToMultiWidget     : PropTypes.func.isRequired,
        deleteTopicFromMultiWidget : PropTypes.func.isRequired,
        changeTopicOrder           : PropTypes.func.isRequired,
        setWidgetAdvancedOptions   : PropTypes.func.isRequired,
        setErrors                  : PropTypes.func.isRequired,
        isGroupSelected            : PropTypes.bool,
        setTopicByKeyToMultiWidget : PropTypes.func.isRequired
    }

    static defaultProps = {
        isSaving        : false,
        params          : { type: '', label: '' },
        activeValue     : {},
        groups          : [],
        topics          : [],
        advanced        : {},
        isGroupSelected : false
    }


    state = {
        isBusy               : false,
        isFirstStepCompleted : false,
        activeSettingTab     : 0
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isOpen !== this.props.isOpen) {
            if (nextProps.isOpen) {
                globalEnterHandler.register(this.handleEnterPressed);
            } else {
                globalEnterHandler.unregister(this.handleEnterPressed);
            }
        }
    }

    componentDidUpdate(prevProps) {
        const isModalClose = prevProps.isOpen && !this.props.isOpen;

        if (isModalClose) {
            this.switchTabToDefaultField();
            this.props.setErrors({});
        }
    }

    componentWillUnmount() {
        globalEnterHandler.unregister(this.handleEnterPressed);
    }

    handleEnterPressed = (e) => {
        const isSubmitDisabled =  this.isSubmitDisabled();

        if (isSubmitDisabled) return;

        this.handleSaveSettings(e);
    }

    handleTopicChange = async option => {
        await this.props.selectTopic(option);
        await this.setDefaultValuesToSettings();
    }

    handleGroupChange= async option => {
        await this.props.selectGroup(option);
        await this.setDefaultValuesToSettings();
    }

    handleDeleteTopicFromWidget = (option) => {
        this.props.deleteTopicFromMultiWidget(option);
    }

    handleValidateAdvanced = () => {
        const { advanced } = this.props;
        const validator = this.getValidator();

        const data = validator.validate({
            ...advanced
        });
        const errors = validator.getErrors();

        return { data, errors };
    }

    handleSaveSettings = async (e) => {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();
        const { setWidgetAdvancedOptions, isSaving } = this.props;

        if (this.isProcessing || isSaving) return;
        this.isProcessing = true;

        if (this.widget.advancedSettings && this.isAdvancedTabAvailable()) {
            const { data, errors } = this.handleValidateAdvanced();

            if (errors) {
                this.props.setErrors(errors);
                this.switchTabToErrorField();
                this.isProcessing = false;

                return;
            }

            await setWidgetAdvancedOptions(data);
        }
        this.props.onSave();
        // this.switchTabToDefaultField();

        this.isProcessing = false;
    }

    handleTabChange = (value) => {
        this.setState({
            activeSettingTab : value
        });
    }

    getValidator() {
        const { activeValue } = this.props;
        const { fields, customValidatorRules } = this.widget.advancedSettings;

        const livrRules = fields.reduce((acc, { name, validationRules }) => {
            if (!validationRules) return acc;

            const rulesList = typeof validationRules === 'function'
                ? validationRules(activeValue.dataType)
                : validationRules;

            return {
                ...acc,
                [name] : rulesList
            };
        }, {});

        const validator = new LIVR.Validator(livrRules);

        if (customValidatorRules) {
            validator.registerRules(customValidatorRules);
        }

        return validator;
    }

    get widget() {
        const { params } = this.props;

        return WIDGETS_MAP[params.type];
    }

    getGeneralTabComponent = () => {
        const { topics, groups, params:{ type, isOnlyTopicConnect },
            setTopicByKeyToMultiWidget, addTopicsToMultiWidget,
            deleteTopicFromMultiWidget, changeTopicOrder, isGroupSelected } = this.props;

        const isOnlyTopic = !isGroupSelected &&  isOnlyTopicConnect;

        switch (type) {
            case 'card':
                return (
                    <GeneralTab
                        topics              = {topics}
                        onTopicsOrderChange = {changeTopicOrder}
                        onTopicSelect       = {addTopicsToMultiWidget}
                        onTopicDelete       = {deleteTopicFromMultiWidget}
                        isOnlyTopicConnect
                        isEntities
                    />);

            case 'alarm':
                return (
                    <AlarmWidgetGeneralTab
                        onTopicSelect = {setTopicByKeyToMultiWidget}
                        onTopicDelete = {deleteTopicFromMultiWidget}
                    />);
            case 'bulb':
                return (
                    <BulbWidgetGeneralTab
                        onTopicSelect = {setTopicByKeyToMultiWidget}
                        onTopicDelete = {deleteTopicFromMultiWidget}
                        onActiveValueChange = {this.handleTopicChange}
                    />);
            case 'schedule':
                return (
                    <ScheduleWidgetGeneralTab
                        onTopicSelect = {setTopicByKeyToMultiWidget}
                        onTopicDelete = {deleteTopicFromMultiWidget}
                    />);
            default:
                return (
                    <GeneralTab
                        isOnlyTopicConnect = {isOnlyTopic}
                        groups             = {groups}
                        topics             = {topics}
                        onTopicChange      = {this.handleTopicChange}
                        onGroupChange      = {this.handleGroupChange}
                    />);
        }
    }

    getPropertiesTabs = () => {
        const { activeSettingTab } = this.state;
        const isValueSelected = this.isAdvancedTabAvailable();

        const tabs = [
            {
                id      : 0,
                label   : 'General',
                content : this.getGeneralTabComponent()
            }
        ];

        if (this.widget?.advancedSettings) {
            tabs.push({
                id      : 1,
                label   : 'Advanced',
                content : (
                    <AdvancedTab
                        isFirstStepCompleted = {isValueSelected}
                        advancedSettings     = {this.widget.advancedSettings}
                    />
                )
            });
        }

        return (
            <Tabs
                withDivider
                tabs     = {tabs}
                value    = {activeSettingTab}
                onChange = {this.handleTabChange}
            />
        );
    }

    setDefaultValuesToSettings = async () => {
        const { activeValue, setWidgetAdvancedOptions } = this.props;
        const advancedSettings = this.widget?.advancedSettings;
        const isValueSelected = this.isFirstStepCompleted();

        if (!(isValueSelected && advancedSettings)) return;

        this.setState({ isBusy: true });

        const defaultValues = advancedSettings.fields.reduce((acc, { name, type, defaultValue }) => {
            if (type === 'color') return { ...acc, [name]: DEFAULT_WIDGET_COLOR_VALUE };
            const dataType = activeValue?.dataType;

            if (typeof defaultValue !== 'undefined' && dataType) {
                const value = typeof defaultValue === 'function' ? defaultValue(dataType) : defaultValue;

                return { ...acc, [name]: value };
            }

            return acc;
        }, {});

        if (Object.keys(defaultValues).length) await setWidgetAdvancedOptions(defaultValues);

        this.props.setErrors({});
        this.setState({ isBusy: false });
    }

    switchTabToErrorField = () => {
        this.setState({ activeSettingTab: 1 });
    }

    switchTabToDefaultField = () => {
        this.setState({
            activeSettingTab : 0
        });
    }

    isFirstStepCompleted = () => {
        const { activeValue, groups, topics, selectedTopics, params:{ type } } = this.props;

        switch (type) {
            case 'card': {
                if (selectedTopics.length) return true;
                break;
            }

            case 'alarm':
            case 'schedule': {
                // only first 2 topics are required

                return (selectedTopics?.filter(topic => [ 0, 1 ].includes(topic?.order)) || [])?.length === 2;
            }

            case 'bulb': {
                // 2 topics are required

                return (selectedTopics?.filter(topic => [ 0 ].includes(topic?.order)) || [])?.length;
            }

            default: {
                const isTopicValid = [ ...groups, ...topics ].find(topic => topic.value === activeValue?.topic);

                return isTopicValid;
            }
        }
    }

    isAdvancedTabAvailable = () => {
        const { selectedTopics, params:{ type } } = this.props;

        switch (type) {
            case 'bulb': {
                // 2 topics are required

                return (selectedTopics?.filter(topic => [ 0, 1 ].includes(topic?.order)) || [])?.length === 2;
            }

            default: {
                return this.isFirstStepCompleted();
            }
        }
    }

    isSubmitDisabled = () => {
        const { errors } = this.props;
        const { isBusy } = this.state;
        const hasError = !!Object.keys(errors).length;
        const isValueSelected = this.isFirstStepCompleted();

        return isBusy || hasError || !isValueSelected;
    }

    render() {
        const { isOpen, onClose, isSaving, params: { label } } = this.props;
        const isSubmitButtonDisabled =  this.isSubmitDisabled();

        return (
            <Modal
                isOpen    = {isOpen}
                onClose   = {onClose}
                className = {styles.modal}
            >
                <div className={styles.container}>
                    <IconButton
                        className = {styles.closeButton}
                        disableFocusRipple
                        disableRipple
                        onClick   = {onClose}
                    >
                        <Close />
                    </IconButton>
                    <h1 className={styles.header}>
                        {label} widget settings
                    </h1>
                    <div className={styles.form}>
                        <div className={styles.content}>
                            {this.getPropertiesTabs()}
                        </div>
                        <div className={styles.footer}>
                            <Button
                                type       = 'button'
                                text       = 'Cancel'
                                onClick    = {onClose}
                                isDisabled = {isSaving}
                            />
                            <SubmitButton
                                onClick    = {this.handleSaveSettings}
                                isDisabled = {isSubmitButtonDisabled}
                                isFetching = {isSaving}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

const SubmitButton = ({ onClick, isDisabled, isFetching }) => { // eslint-disable-line
    return (
        <Button
            autoFocus
            text       = 'Save settings'
            onClick    = {onClick}
            isDisabled = {isDisabled}
            isFetching = {isFetching}
        />
    );
};


function mapStateToProps(state) {
    const {
        topics,
        isFetching: isSaving,
        groups,
        params,
        error : errors,
        advanced,
        selectedTopics,
        activeValue,
        isGroupSelected
    } = state.client.widget;

    return {
        topics,
        isSaving,
        params,
        errors,
        advanced,
        activeValue,
        groups,
        selectedTopics,
        isGroupSelected
    };
}

export default connect(mapStateToProps, { ...WidgetActions })(WidgetSettingsModal);
