import React, { PureComponent }   from 'react';
import { findDOMNode }            from 'react-dom';
import PropTypes                  from 'prop-types';
import classnames                 from 'classnames/bind';
import Popover                    from '@material-ui/core/Popover';

import history                    from '../../../../history';
import { isTouchDevice }          from '../../../../utils/detect';
import Theme                      from '../../../../utils/theme';
import { filterTopicsByDataType } from '../../../../utils/homie/getTopics';
import {
    getOptions,
    checkIsValueDeleted,
    getOptionByValue,
    getSortedOptionsByTitle
}                                 from '../../../../utils/getSelectOpions';
import globalEnterHandler         from '../../../../utils/globalEnterHandler';
import Button                     from '../../../base/Button';
import Tabs                       from '../../../base/Tabs';
import InfoIcon                   from '../../../base/icons/Info';
import StringInput                from '../../../base/inputs/String';
import IntegerInput               from '../../../base/inputs/Integer';
import FloatInput                 from '../../../base/inputs/Float';
import PasswordInput               from '../../../base/inputs/Password';
import ScheduleControl            from '../../../base/controls/Schedule/Schedule';
import StringControl              from '../../../base/controls/String';
import Editor                     from '../../../base/Editor';
import GenericToggle              from '../../../base/GenericToggle';
import BaseSelect                 from '../../../base/select/BaseSelect';
import CitiesSelect               from '../../../base/select/CitiesSelect';
import AsyncSelect                from '../../../base/select/AsyncSelect';
import CopyField                  from '../../../base/CopyField';
import ModbusConfiguration        from '../Services/ModbusConfigaration';
import TopicConfiguration         from '../Scenarios/TopicConfiguration';
import ScheduleConfig             from './ScheduleConfig';
import BaseConfiguration          from './BaseConfiguraion';
import NotificationConfiguration  from './NotificationConfiguration';
import ScenarioEditor             from './ScenarioEditor';

import styles                     from './CustomForm.less';

const cx = classnames.bind(styles);
const VALIDATION_ERRORS_MAP = {
    'REQUIRED'             : 'Value is required',
    'CANNOT_BE_EMPTY'      : 'Value cannot be empty',
    'FORMAT_ERROR'         : 'Format error',
    'NOT_ALLOWED_VALUE'    : 'Given value is not allowed',
    'TOO_LONG'             : 'Value is too long',
    'TOO_SHORT'            : 'Value is too short',
    'WRONG_FORMAT'         : 'Value has a wrong format',
    'WRONG_NAME'           : 'Latin lowercase letters only: from "a" to "z" and numbers from "0" to "9"',
    'NOT_INTEGER'          : 'Should be integer',
    'NOT_POSITIVE_INTEGER' : 'Should be positive integer',
    'NOT_DECIMAL'          : 'Should be decimal',
    'NOT_POSITIVE_DECIMAL' : 'Should be positive decimal',
    'TOO_HIGH'             : 'Value is too high',
    'TOO_LOW'              : 'Value is too low',
    'NOT_NUMBER'           : 'Value is not a number',
    'EXISTS'               : 'Value should be unique'
};


class CustomForm extends PureComponent {
    static contextType = Theme; //eslint-disable-line

    static propTypes = {
        configuration     : PropTypes.object.isRequired,
        initialState      : PropTypes.object,
        scenarioTemplates : PropTypes.object.isRequired,
        errors            : PropTypes.object,
        isProcessing      : PropTypes.bool,
        topics            : PropTypes.array.isRequired,
        enumAsyncOptions  : PropTypes.array,
        onInteract        : PropTypes.func,
        onChangeEnumAsync : PropTypes.func,
        onSave            : PropTypes.func.isRequired,
        onClickBack       : PropTypes.func.isRequired
    }

    static defaultProps = {
        initialState      : {},
        enumAsyncOptions  : [],
        errors            : undefined,
        isProcessing      : false,
        onInteract        : undefined,
        onChangeEnumAsync : undefined
    }

    constructor(props) {
        super(props);

        this.state = {
            fields      : props.initialState,
            validation  : {},
            localErrors : {},
            info        : {}
        };

        this.tabsRef = React.createRef();
        this.fields = {};
    }

    componentDidMount() {
        this.setFocusOnFirstField();
        globalEnterHandler.register(this.handleEnterPressed);
    }

    componentWillUnmount() {
        globalEnterHandler.unregister(this.handleEnterPressed);
    }

    handleEnterPressed = (e) => {
        this.handleSubmit(e);
    }

    handleChangeSelect = name => ({ value }) => {
        const { onInteract } = this.props;

        this.setState(prevState => ({
            fields : {
                ...prevState.fields,
                [name] : value
            }
        }));

        if (onInteract) onInteract(name);
    }

    handleChangeMultipleSelect = name => options => {
        const { onInteract } = this.props;

        this.setState(prevState => {
            const prev = prevState?.fields?.[name] || [];

            return {
                fields : {
                    ...prevState?.fields,
                    [name] : [ ...prev, ...options?.map(option => option?.value) ]
                }
            };
        });

        if (onInteract) onInteract(name);
    }

    handleChangeToogle= (name) => ({ value }) => {
        const { onInteract } = this.props;

        this.setState(prevState => ({
            fields : {
                ...prevState.fields,
                [name] : value
            }
        }));

        if (onInteract) onInteract(name);
    }


    handleChangeField = name => value => {
        const { onInteract } = this.props;

        this.setState(prevState => ({
            fields : {
                ...prevState.fields,
                [name] : value
            }
        }));

        if (onInteract) onInteract(name);
    }

    handleChangeJsonField = name => value => {
        const { onInteract } = this.props;

        try {
            const obj = value ? JSON.parse(value) : undefined;

            this.setState(prevState => ({
                fields : {
                    ...prevState.fields,
                    [name] : obj
                }
            }));
        } catch {
            // pass
        }

        if (onInteract) onInteract(name);
    }

    handleChangeEditorField = field => {
        return (field.type === 'json')
            ? this.handleChangeJsonField(field.name)
            : this.handleChangeField(field.name);
    }


    handleSetValidation = name => value => {
        this.setState(prevState => ({
            validation : {
                ...prevState.validation,
                [name] : value
            }
        }));
    }

    handleValueDelete = (name) => ({ id }) => {
        this.setState(prevState => ({
            fields : {
                ...prevState.fields,
                [name] : prevState.fields[name].filter(field => field !== id)
            }
        }));
    }

    handleSubmit = async (e) => {
        const fields = { ...this.state.fields };
        const { onSave, configuration } = this.props;

        if (e) e.preventDefault();

        if (this.fields) {
            Object.keys(this.fields).forEach((fieldKey) => {
                const fieldComponent = this.fields[fieldKey];

                if (!fieldComponent || !fieldComponent?.getValueToSubmit) return;

                const data = fieldComponent.getValueToSubmit();

                fields[fieldKey] = data;
            });
        }

        try {
            await onSave({ ...fields, entityType: configuration.name });
        } catch (error) {
            this.onSubmitError(error);
        }
    }

    onSubmitError = (error) => {
        const { configuration: { fields = [] } } = this.props;
        const isErrorExist = Object.values(error || {}).filter(val => !!val)?.length;
        const hasAdvancedField  = fields?.find(field => !!field?.advanced);

        if (!hasAdvancedField || !isErrorExist) return;

        const generalFields  =  fields?.filter(field => !field?.advanced);
        const advancedFields = fields?.filter(field => !!field?.advanced);
        const tabsRef = this?.tabsRef?.current;

        if (!tabsRef) return;

        const activeTab = tabsRef.getActiveTab();
        const advancedKeys = advancedFields?.map(field => field?.name);
        const generalkeys  = generalFields?.map(field => field?.name);
        const advancedError = advancedKeys?.find(key => !!error[key]);
        const generalError  = generalkeys?.find(key => !!error[key]);

        if (activeTab === 0) {
            if (!generalError && advancedError) tabsRef.setActiveTab(1);
        } else if (activeTab === 1) {
            if (generalError) tabsRef.setActiveTab(0);
        }
    }

    handleOpenInfo = (description) => (event) => {
        if (!description) return;

        this.setState({
            info : {
                anchor : event.currentTarget,
                data   : {
                    description
                }
            }
        });
    }

    handleCloseInfo = () => {
        // prevent empty description onClose
        this.setState({
            info : { ...this.state.info, anchor: undefined }
        });
    }

    getError(code) {
        if (!code) return;

        if (Object.prototype.toString.call(code) === '[object Object]') return code;

        const text = VALIDATION_ERRORS_MAP[code];

        if (text) return text;
        const fallbackText = code?.toLowerCase()?.replace(/_/g, ' ');

        return `${fallbackText.charAt(0).toUpperCase()}${fallbackText.slice(1)}`;
    }

    setFocusOnFirstField() {
        if (isTouchDevice()) return;

        const name = this.props.configuration?.fields[0]?.name;
        const field = this.fields[name];
        const fieldNode = findDOMNode(field);  // eslint-disable-line react/no-find-dom-node
        const inputNode = fieldNode?.getElementsByTagName('input')[0];

        setTimeout(() => {
            inputNode?.focus();
        }, 0);
    }

    onChangeTitle = ({ value } = {}) => {
        const { localErrors } = this.state;
        const processValue = value?.trim() || '';
        const isEmpty = !processValue?.length;

        if (isEmpty) {
            const error = 'Title can\'t be empty';

            this.setState({
                localErrors : {
                    ...(localErrors || {}),
                    title : error
                }
            });
            throw new Error(error);
        } else {
            this.handleChangeField('title')(processValue);

            if (localErrors.title) {
                this.setState({
                    localErrors : {
                        ...(localErrors || {}),
                        title : ''
                    }
                });
            }
        }
    }

    checkIsValid() {
        const { validation } = this.state;

        return Object.values(validation).every(valid => valid);
    }

    renderInfoPopover = () => {
        const { info } = this.state;
        const open = !!info?.anchor && info?.data?.description;
        const id = open ? 'simple-popover' : undefined;

        return (
            <Popover
                id        = {id}
                open      = {open}
                anchorEl  = {info?.anchor}
                classes   = {{
                    paper : styles.infoPopover
                }}
                onClose      = {this.handleCloseInfo}
                anchorOrigin = {{
                    vertical   : 'bottom',
                    horizontal : 'center'
                }}
                transformOrigin={{
                    vertical   : 'top',
                    horizontal : 'center'
                }}
            >
                <div className={styles.popoverContent}>
                    <div className={styles.description}>
                        {info?.data?.description}
                    </div>
                </div>
            </Popover>
        );
    }

    renderField(field) {
        if (field?.name === 'title') return null;
        switch (field.type) {
            case 'string': // true
                return this.renderBaseField(field, StringInput);
            case 'number': // true
                return this.renderBaseField(field, FloatInput);
            case 'exposed-port':
            case 'integer': // true
                return this.renderBaseField(field, IntegerInput);
            case 'password':
                return this.renderBaseField(field, PasswordInput);
            case 'id':
                return this.renderCopyField(field);
            case 'enum':
                return this.renderEnumSelect(field); // true
            case 'enum-async':
                if (field.basePath === '/cities') return this.renderCitiesEnumAsyncSelect(field); // true

                return this.renderEnumAsyncSelect(field); // true
            case 'boolean':
                return this.renderToggle(field);
            case 'schedule': // true
                return this.renderBaseField(field, ScheduleControl);
            case 'topic': // true
                return this.renderTopicSelect(field);
            case 'topics': // true
                return this.renderTopicsMultiSelect(field);
            case 'javascript':
                return this.renderScenarioEditor(field);
            case 'json':
                return this.renderEditorField(field);
            case 'modbus-config':
                return this.renderModbusConfiguration(field);
            case 'schedule-config':
                return this.renderScheduleIntervalConfiguration(field);
            case 'action-topics-config':    // true
                return this.renderActionTopicsConfiguration(field);
            case 'notification-config': // true
                return this.renderNotificationConfiguration(field);
            default:
                return null;
        }
    }

    renderModbusConfiguration = (field) => {
        const { errors, onInteract } = this.props;
        const { fields } = this.state;
        const errorData = this.getError(errors?.[field.name]);

        return (
            <ModbusConfiguration
                key           = {field.name}
                ref           = {el => this.fields[field.name] = el}
                field         = {field}
                initialState  = {fields[field.name]}
                setValidation = {this.handleSetValidation(field.name)}
                errors        = {errorData}
                onInteract    = {onInteract}
            />
        );
    }

    renderScheduleIntervalConfiguration = (field) => {
        const { errors, onInteract } = this.props;
        const { fields } = this.state;
        const { name, description } = field || {};
        const errorData = errors?.[name];

        return (
            <ScheduleConfig
                onChange     = {this.handleChangeField(name)}
                initialState = {fields[name]}
                field        = {field}
                errors       = {errorData}
                onInteract   = {onInteract}
                description  = {description}
                onOpenInfo   = {this.handleOpenInfo}
            />
        );
    }

    renderActionTopicsConfiguration = (field) => {
        const { errors, onInteract, topics } = this.props;
        const { fields } = this.state;
        const { topicDataTypes, name, description } = field || {};
        const errorData = errors?.[name];

        const rawTopics = filterTopicsByDataType(topics, topicDataTypes);
        const sortedOptionsByTitle =  getSortedOptionsByTitle(rawTopics);

        return (
            <BaseConfiguration
                initialState = {fields[name]}
                field        = {field}
                topics       = {sortedOptionsByTitle}
                errors       = {errorData}
                onChange     = {this.handleChangeField(name)}
                onInteract   = {onInteract}
                description  = {description}
                onOpenInfo   = {this.handleOpenInfo}
            />
        );
    }

    renderNotificationConfiguration = (field) => {
        const { errors, onInteract } = this.props;
        const { fields } = this.state;
        const { name, description } = field ||  {};
        const errorText = this.getError(errors?.[name]);

        return (
            <NotificationConfiguration
                initialState = {fields[name]}
                description  = {description}
                field        = {field}
                errors       = {errorText}
                onChange     = {this.handleChangeField(name)}
                onOpenInfo   = {this.handleOpenInfo}
                onInteract   = {onInteract}
            />
        );
    }

    renderToggle(field) {
        const { errors } = this.props;
        const { fields } = this.state;
        const { name, options = {} } = field || {};
        const errorText = this.getError(errors?.[name]);

        return (
            <div
                key       = {field.name}
                className = {cx(styles.fieldInputWrapper, {
                    toggleWrapper             : true,
                    [options?.labelPlacement] : options?.labelPlacement
                })}
            >
                <h3 className={styles.fieldLabel}>
                    {field.label}
                </h3>
                <GenericToggle
                    ref       = {el => this.fields[name] = el}
                    value     = {fields[name]}
                    className = {styles.toggle}
                    onToggle  = {this.handleChangeToogle(name)}
                    isSettable
                />
                <div className={styles.errorMessage}>{errorText}</div>
            </div>
        );
    }

    renderTopicsMultiSelect(field) {
        const { errors, topics } = this.props;
        const { fields } = this.state;
        const values = fields[field.name];
        const errorText = this.getError(errors?.[field.name]);
        const filteredTopics = filterTopicsByDataType(topics, field.topicDataTypes);
        const topicsToSelect = filteredTopics.filter(topic => !values?.includes(topic.id));
        const sortedTopicsToSelect = getSortedOptionsByTitle(topicsToSelect);

        const valuesObjects = values?.map(value => getOptionByValue(value, filteredTopics));
        const sortedValues = getSortedOptionsByTitle(valuesObjects);
        const withDeletedValues = checkIsValueDeleted(sortedValues, filteredTopics);

        return (
            <div key={field.name} className={styles.selectWrapper}>
                <TopicConfiguration
                    label         = {field?.label}
                    description   = {field?.description}
                    options       = {sortedTopicsToSelect}
                    placeholder   = {field?.placeholder}
                    value         = {withDeletedValues}
                    errorText     = {errorText}
                    onOpenInfo    = {this.handleOpenInfo}
                    onValueSelect = {this.handleChangeMultipleSelect(field.name)}
                    onValueDelete = {this.handleValueDelete(field.name)}
                    multiple
                />
            </div>
        );
    }

    renderTopicSelect(field) {
        const { name, label, topicDataTypes, placeholder } = field;
        const { errors, topics } = this.props;
        const {  fields } = this.state;
        const selectedValue = fields[name];
        const errorText = this.getError(errors?.[name]);
        const rawTopics = filterTopicsByDataType(topics, topicDataTypes);

        const value = selectedValue ? getOptionByValue(selectedValue, rawTopics) : null;
        const sortedOptionsByTitle =  getSortedOptionsByTitle(rawTopics);
        // const topicsOptions = getOptions(value, sortedOptionsByTitle);

        return (
            <div key={field.name} className={styles.selectWrapper}>
                <TopicConfiguration
                    label            = {label}
                    description      = {field?.description}
                    options          = {sortedOptionsByTitle}
                    onChange         = {this.handleChangeSelect(name)}
                    onOpenInfo       = {this.handleOpenInfo}
                    placeholder      = {placeholder}
                    value            = {value}
                    errorText        = {errorText}
                />
            </div>
        );
    }

    renderCitiesEnumAsyncSelect(field) {
        const { name, label, placeholder, basePath, description } = field;
        const { errors, enumAsyncOptions, onChangeEnumAsync } = this.props;
        const { fields } = this.state;

        const errorText     = this.getError(errors?.[name]);
        const selectedValue = fields[name];

        const value = enumAsyncOptions.find(option => option.value === selectedValue);

        return (
            <div key={field.name} className={styles.selectWrapper}>
                <h3 className={styles.fieldLabel}>
                    {label}
                    { description
                        ? (
                            <div
                                className = {styles.infoButton}
                                onClick   = {this.handleOpenInfo(description)}
                            >
                                <InfoIcon  />
                            </div>
                        ) : null
                    }
                </h3>
                <CitiesSelect
                    mobileTitle     = {label}
                    options         = {enumAsyncOptions}
                    onChange        = {this.handleChangeSelect(name)}
                    onInputChange   = {onChangeEnumAsync}
                    placeholder     = {placeholder}
                    placeholderType = 'secondary'
                    maxSelectHeight = {206}
                    isInvalid       = {!!errorText}
                    settings        = {{
                        isSearchable : true,
                        value,
                        basePath
                    }}
                    styles = {{
                        placeholder : { 'textAlign': 'left' }
                    }}
                />
                <div className={styles.errorMessage}>{errorText}</div>
            </div>
        );
    }

    renderEnumAsyncSelect(field) {
        const { description, name, label, placeholder, basePath } = field;
        const { errors, enumAsyncOptions, onChangeEnumAsync } = this.props;
        const { fields } = this.state;

        const errorText     = this.getError(errors?.[name]);
        const selectedValue = fields[name];

        const value = enumAsyncOptions.find(option => option.value === selectedValue);

        return (
            <div key={field.name} className={styles.selectWrapper}>
                <h3 className={styles.fieldLabel}>
                    {label}
                    { description
                        ? (
                            <div
                                className = {styles.infoButton}
                                onClick   = {this.handleOpenInfo(description)}
                            >
                                <InfoIcon  />
                            </div>
                        ) : null
                    }
                </h3>
                <AsyncSelect
                    mobileTitle     = {label}
                    options         = {enumAsyncOptions}
                    onChange        = {this.handleChangeSelect(name)}
                    onInputChange   = {onChangeEnumAsync}
                    placeholder     = {placeholder}
                    placeholderType = 'secondary'
                    maxSelectHeight = {206}
                    isInvalid       = {!!errorText}
                    settings        = {{
                        isSearchable : true,
                        value,
                        basePath
                    }}
                    styles = {{
                        placeholder : { 'textAlign': 'left' }
                    }}
                />
                <div className={styles.errorMessage}>{errorText}</div>
            </div>
        );
    }

    renderEnumSelect(field) {
        const { description, name, label, placeholder, format } = field;
        const { errors } = this.props;
        const { fields } = this.state;

        const errorText     = this.getError(errors?.[name]);
        const selectedValue = fields[name];
        const value         = selectedValue ? getOptionByValue(selectedValue, format) : null;
        const options       = getOptions(value, format);

        return (
            <div key={field.name} className={styles.selectWrapper}>
                <h3 className={styles.fieldLabel}>
                    {label}
                    { description
                        ? (
                            <div
                                className = {styles.infoButton}
                                onClick   = {this.handleOpenInfo(description)}
                            >
                                <InfoIcon  />
                            </div>
                        ) : null
                    }
                </h3>
                <BaseSelect
                    mobileTitle     = {label}
                    options         = {options}
                    onChange        = {this.handleChangeSelect(name)}
                    placeholder     = {placeholder}
                    placeholderType = 'secondary'
                    maxSelectHeight = {206}
                    isInvalid       = {!!errorText}
                    settings        = {{
                        isSearchable : true,
                        defaultValue : value,
                        value
                    }}
                    styles = {{
                        placeholder : { 'textAlign': 'left' }
                    }}
                />
                <div className={styles.errorMessage}>{errorText}</div>
            </div>
        );
    }

    renderBaseField(field, Component) {
        const { errors } = this.props;
        const { fields } = this.state;
        const { description, name, label, disabled, placeholder } = field || {};
        const errorText = this.getError(errors?.[name]);

        return (
            <div key={name} className={styles.fieldInputWrapper}>
                <h3 className={styles.fieldLabel}>
                    {label}
                    { description
                        ? (
                            <div
                                className = {styles.infoButton}
                                onClick   = {this.handleOpenInfo(description)}
                            >
                                <InfoIcon  />
                            </div>
                        ) : null
                    }
                </h3>
                <Component
                    ref         = {el => this.fields[name] = el}
                    value       = {fields[name]}
                    placeholder = {placeholder}
                    onChange    = {this.handleChangeField(name)}
                    className   = 'form'
                    maxLength   = '255'
                    isInvalid   = {errorText}
                    isDisabled  = {disabled}
                    darkThemeSupport
                    maximumHarcodingIOS
                />
                <div className={styles.errorMessage}>{errorText}</div>
            </div>
        );
    }

    renderCopyField(field) {
        const { fields } = this.state;

        return (
            <div key={field.name} >
                <h3 className={styles.fieldLabel}>{field.label}</h3>
                <CopyField
                    className = {styles.copyField}
                    ref={el => this.fields[field.name] = el}
                    value={fields[field.name]}
                />
            </div>
        );
    }

    renderScenarioEditor(field) {
        const { initialState, errors, scenarioTemplates } = this.props;
        const { name } = field;
        const { fields } = this.state;

        const errorText = this.getError(errors?.[name]);
        const serializedInitialValue = initialState[name];
        const value = fields[name];

        // TODO: ? mv withTemplates into field configuration
        const withTemplates = !history?.location?.pathname?.includes('/service');

        return (
            <div key={name}>
                <ScenarioEditor
                    scenarioTemplates = {scenarioTemplates?.list || []}
                    initialValue      = {serializedInitialValue}
                    value             = {value}
                    field             = {field}
                    onChange          = {this.handleChangeEditorField(field)}
                    onValidate        = {this.handleSetValidation(name)}
                    errorText         = {errorText}
                    withTemplates     = {withTemplates}
                />
            </div>
        );
    }

    renderEditorField(field) {
        const { initialState, errors } = this.props;
        const { name, label, type } = field;

        const errorText = this.getError(errors?.[name]);
        const isJsonField = type === 'json';
        const serializedInitialValue = isJsonField
            ? JSON.stringify(initialState[name], undefined, 2)
            : initialState[name];

        return (
            <div key={name}>
                <h3 className={styles.fieldLabel}>{label}</h3>
                <div className={cx('editorWrapper', { invalid: errorText })}>
                    <Editor
                        mode={field.type || 'json'}
                        initialValue={serializedInitialValue}
                        options={{
                            enableBasicAutocompletion : true,
                            enableLiveAutocompletion  : true,
                            enableSnippets            : false,
                            showLineNumbers           : true,
                            tabSize                   : 2
                        }}
                        onChange={this.handleChangeEditorField(field)}
                        onValidate={this.handleSetValidation(name)}
                    />
                </div>
                <div className={styles.errorMessage}>{errorText}</div>
            </div>
        );
    }

    renderTitleField = (field, { withDescription = false } = {}) => {
        const { errors } = this.props;
        const { fields, localErrors } = this.state;
        const errorText = this.getError(errors?.[field.name]) || localErrors.title;

        return (
            <div
                className={cx(styles.titleFieldWrapper, {
                    withMargin : !withDescription
                })}
            >
                <StringControl
                    value                = {fields[field.name]}
                    propertyId           = {null}
                    setValue             = {this.onChangeTitle}
                    maxLength            = {255}
                    isError              = {!!errorText}
                    isSync
                    darkThemeSupport
                    isSettable
                />
            </div>
        );
    }

    renderDescription() {
        return null;
        // const { configuration } = this.props;

        // if (!configuration?.description) return null;

        // return (
        //     <div key={field.name} className={styles.descriptionWrapper}>
        //         {configuration?.description}
        //     </div>
        // );
    }

    renderFields = (fields) => {
        const hasAdvancedField  = fields?.find(field => !!field?.advanced);

        if (!hasAdvancedField) {
            return (
                <div className={styles.formWrapper}>
                    { fields?.map(field => this.renderField(field)) }
                </div>
            );
        }

        const generalFields  =  fields?.filter(field => !field?.advanced);
        const advancedFields = fields?.filter(field => !!field?.advanced);

        const tabs = [ {
            label   : 'General',
            id      : 'general',
            content : (
                <div>
                    { generalFields?.map(field => this.renderField(field)) }
                </div>
            )
        }, {
            label   : 'Advanced',
            id      : 'advanced',
            content : (
                <div>
                    { advancedFields?.map(field => this.renderField(field)) }
                </div>
            )
        } ];

        return (
            <div  className={cx(styles.formWrapper, { withTabs: true })}>
                <Tabs
                    tabs            = {tabs}
                    classes         = {{
                        tabsWrapper : styles.tabsWrapper,
                        content     : styles.tabsContent
                    }}
                    noDataMessage   = 'There are no fields to display'
                    centered        = {false}
                    forwardRef      = {this.tabsRef}
                />
            </div>
        );
    }

    render() {
        const { configuration: { fields }, isProcessing, onClickBack } = this.props;
        const isValid = this.checkIsValid();
        const descriptionField = fields?.find(field => field.type === 'description');
        const titleField = fields?.find(field => field.name === 'title');
        const { theme } = this.context;
        const customFormCN = cx(styles.CustomForm, {
            [theme] : theme
        });

        return (
            <div className={customFormCN}>
                <div className={styles.form}>
                    <div className={styles.container}>
                        { titleField
                            ? this.renderTitleField(titleField, { withDescription: false })
                            : null
                        }

                        { descriptionField
                            ? this.renderDescription(descriptionField)
                            : null
                        }
                        { this.renderFields(fields) }
                        <div className={styles.controls}>
                            <div className={styles.backButtonWrapper}>
                                <Button
                                    text       = 'Cancel'
                                    className  = {styles.button}
                                    type       = 'button'
                                    isDisabled = {isProcessing}
                                    onClick    = {onClickBack}
                                    color      = 'white'
                                >
                                    <>
                                        {/*
                                            <Icon type='go-back' className={styles.goBackIcon} />
                                        */}
                                        Cancel
                                    </>
                                </Button>
                            </div>
                            <div className={styles.saveButtonWrapper}>
                                <Button
                                    text       = 'Save'
                                    isDisabled = {!isValid}
                                    isFetching = {isProcessing}
                                    className  = {styles.saveButton}
                                    type       = 'submit'
                                    onClick    = {this.handleSubmit}
                                    color      = 'action'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderInfoPopover()}
            </div>
        );
    }
}

export default CustomForm;
