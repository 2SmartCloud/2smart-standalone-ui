import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import uuidv4                   from 'uuid/v4';

import StringInput              from '../../../../base/inputs/String';
import Editor                   from '../../../../base/Editor';
import BaseSelect               from '../../../../base/select/BaseSelect';
import BinIcon                  from '../../../../base/icons/Bin';
import Theme                    from '../../../../../utils/theme';
import ViewModeControls         from '../../shared/ViewModeControls';

import styles                   from './ModbusConfiguration.less';

const cx = classnames.bind(styles);

export const MODBUS_DATA_PATH = 'nodes';
export const MODBUS_FORM_FIELDS = [ {
    name        : 'id',
    type        : 'integer',
    placeholder : 'ID'
},
{
    name        : 'hardware',
    type        : 'select',
    placeholder : 'Hardware'
} ];

const AVAILABLE_VIEW_MODES = [ 'form', 'json' ];

const FORMAT_UTILS = {
    isObject : (value) => {
        return Object.prototype.toString.call(value) === '[object Object]';
    },
    isArray : (value) => {
        return Object.prototype.toString.call(value) === '[object Array]';
    },
    isString : (value) => {
        return Object.prototype.toString.call(value) === '[object String]';
    },
    isNumber : (value) => {
        return typeof value === 'number' && isFinite(value);
    }
};

const HARDWARE_STYLES = {
    placeholder : { 'textAlign': 'left' }
};

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
    'UNIQUE_ERROR'         : 'Field must be unique'
};

class ModbusConfiguration extends PureComponent {
    static contextType = Theme //eslint-disable-line

    static propTypes = {
        initialState  : PropTypes.object.isRequired,
        field         : PropTypes.object.isRequired,
        onInteract    : PropTypes.func,
        setValidation : PropTypes.func,
        errors        : PropTypes.shape({
            nodes : PropTypes.arrayOf(PropTypes.shape({
                id       : PropTypes.string,
                hardware : PropTypes.string
            }))
        })
    }

    static defaultProps = {
        onInteract    : null,
        setValidation : null,
        errors        : null
    }

    constructor(props) {
        super(props);

        this.state = {
            formData    : this.getStateForFormMode(props.initialState),
            isJsonValid : true,
            viewMode    : 'form'
        };
    }

    componentWillUnmount() {
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    }

    handleChangeJsonField = value => {
        try {
            const data = value ? JSON.parse(value) : void 0;

            this.setState({
                formData : data
            });
        } catch {
            // pass
        }

        this.onInteract();
    }

    handleSetValidation = isJsonValid => {
        const { setValidation } = this.props;

        if (this.state.isJsonValid === isJsonValid) return;

        if (setValidation) setValidation(isJsonValid);

        this.setState({
            isJsonValid
        });
    }

    handleChangeViewMode = (mode) => {
        const { viewMode, formData } = this.state;

        if (mode === viewMode) return;
        if (!AVAILABLE_VIEW_MODES.includes(mode)) return;

        const formattedState = mode === 'form'
            ? this.getStateForFormMode(formData)
            : this.getStateForJsonMode(formData);

        this.setState({
            viewMode : mode,
            formData : formattedState
        }, () => {
            const scrollDirection = mode === 'json' ? 'top' : 'bottom';

            this.scrollTo(scrollDirection);
        });
    }

    handleAddFormField = () => {
        const newFormField = {
            formId   : uuidv4(),
            id       : '',
            hardware : void 0
        };
        const { formData } = this.state;
        const isObject = FORMAT_UTILS.isObject(formData);
        const processFormData = isObject
            ? formData
            : this.getStateForFormMode(formData, true);
        const prevFieldValue = processFormData || { [MODBUS_DATA_PATH]: [] };

        this.setState({
            formData : {
                ...prevFieldValue,
                [MODBUS_DATA_PATH] : [
                    ...prevFieldValue[MODBUS_DATA_PATH] || [],
                    newFormField
                ]
            }
        }, () => {
            this.scrollTo('bottom');
            this.onInteract();
        });
    }

    handleChangeField = (formInfo = {}, fieldData = {}) => (value) => {
        const { formData } = this.state;
        const isObject = FORMAT_UTILS.isObject(formData);
        const isIdField = fieldData.name === 'id';
        const processFormData = isObject
            ? formData
            : this.getStateForFormMode(formData, true);

        const { formId } = formInfo;
        const prevFieldValue = processFormData || { [MODBUS_DATA_PATH]: [] };


        const trimedValue = isIdField && value ? value.trim() : value;
        const formattedValue = isIdField
            ? trimedValue.replace(/\D/g, '')
            : trimedValue;

        this.setState({
            formData : {
                ...prevFieldValue,
                [MODBUS_DATA_PATH] : prevFieldValue[MODBUS_DATA_PATH]
                    .map(form => form.formId !== formId
                        ? form
                        : { ...form, [fieldData.name]: formattedValue }
                    )
            }
        });

        this.onInteract();
    };

    handleRemoveFormField = (formId) => () => {
        const prevFieldValue = this.state?.formData || { [MODBUS_DATA_PATH]: [] };

        this.setState({
            formData : {
                ...prevFieldValue,
                [MODBUS_DATA_PATH] : prevFieldValue[MODBUS_DATA_PATH].filter(fieldData => fieldData.formId !== formId)
            }
        });

        this.onInteract();
    };

    getValueToSubmit = () => {
        const { formData } = this.state;
        const isDatObject = FORMAT_UTILS.isObject(formData);

        if (!formData || !isDatObject) return formData;

        const processValue = {};
        const { nodes } = formData;

        if (nodes) {
            processValue.nodes = nodes.map(node => {
                let hardware = '';

                const isHardwareString = FORMAT_UTILS.isString(node.hardware);
                const isHardwareObject = FORMAT_UTILS.isObject(node.hardware);

                if (isHardwareString) {
                    hardware = node.hardware;
                } else if (isHardwareObject) {
                    hardware = node.hardware.value;
                }

                return ({
                    id       : node.id,
                    hardware,
                    override : node?.override
                });
            });
        }

        return processValue;
    }

    getStateForJsonMode = (formData) => {
        if (!formData) return formData;

        const isFormDataObject = FORMAT_UTILS.isObject(formData);

        if (!isFormDataObject) return formData;

        const formattedNodes = formData.nodes && formData.nodes.length
            ? formData.nodes.map(({ formId, ...node }) => {  // eslint-disable-line
                return ({ id: '',  ...node, hardware: node.hardware?.value || '' });
            })
            : formData.nodes;

        const result = { ...formData };

        result.nodes = formattedNodes;

        return result;
    }

    getStateForFormMode = (formData, convertInvalidStateShape) => {
        const isFormDataObject = FORMAT_UTILS.isObject(formData);

        if (!convertInvalidStateShape && !isFormDataObject) return formData;

        const formatted = isFormDataObject
            ? { ...formData }
            : { 'invalid_prev_data': formData };

        if (isFormDataObject && formData.nodes) {
            const isNodesArray = FORMAT_UTILS.isArray(formData.nodes);

            if (!isNodesArray) {
                formatted.invalid_prev_nodes =  formData.nodes;    // eslint-disable-line
            } else {
                const formattedNodes = formData.nodes && formData.nodes.length
                    ? formData.nodes.map(({ formId, ...node }) => {    // eslint-disable-line
                        const isHardwareString = FORMAT_UTILS.isString(node.hardware);
                        const isIdString = FORMAT_UTILS.isString(node.id);
                        const isIdNumber = FORMAT_UTILS.isNumber(node.id);

                        const nodeData = {
                            ...node,
                            id       : isIdString || isIdNumber ? `${node.id}` : '',
                            hardware : isHardwareString && !!node.hardware ? ({
                                label : node.hardware,
                                value : node.hardware
                            }) : void 0,
                            formId : uuidv4()
                        };

                        if (!isIdString && !isIdNumber && node.id) {
                            nodeData.invalid_prev_id = node.id;    // eslint-disable-line
                        }

                        if (!isHardwareString) {
                            nodeData.invalid_prev_hardware = node.hardware;    // eslint-disable-line
                            nodeData.hardware = void 0;
                        }

                        return nodeData;
                    })
                    : formData.nodes;

                formatted.nodes =  formattedNodes;
            }
        }

        return formatted;
    }

    getSortedOptions = (selected, options) => {
        if (!options || !selected) return options;
        const isSelectedObject = FORMAT_UTILS.isObject(selected);

        if (!isSelectedObject) return options;

        const optionsWithoutSelected = options.filter(option => option.value !== selected.value);
        const isSelectedExist = optionsWithoutSelected.length < options.length;

        return isSelectedExist ? [ selected, ...optionsWithoutSelected ] : options;
    }

    scrollTo = (direction = 'bottom') => {
        this.scrollTimeout = setTimeout(() => {
            const position = direction === 'bottom' ? 'end' : 'start';

            this.modbasConfig.scrollIntoView({ block: position, behavior: 'smooth' });
        }, 0);
    }

    onInteract = () => {
        const { onInteract, field, errors } = this.props;

        if (onInteract && errors) onInteract(field.name);
    }


    getError(code) {
        if (!code) return;

        const text = VALIDATION_ERRORS_MAP[code];

        if (text) return text;
        const fallbackText = code.toLowerCase().replace('_', ' ');

        return `${fallbackText.charAt(0).toUpperCase()}${fallbackText.slice(1)}`;
    }

    renderForm = (formFields) => {
        const { errors } = this.props;
        const value = this.state.formData?.[MODBUS_DATA_PATH] || [];
        const nodesErrors = errors?.nodes || [];
        const errorText = errors && value && value.length < 1 ? 'Please create at least 1 node' : '';

        return (
            <div className={styles.formFieldWrapper}>
                <div>
                    { value && value.length
                        ? value.map((formData, index) => {
                            const idField       = formFields.find(field => field.name === 'id');
                            const hardwareField = formFields.find(field => field.name === 'hardware');

                            const idError       = this.getError(nodesErrors[index]?.id);
                            const hardwareError = this.getError(nodesErrors[index]?.hardware);

                            return (
                                <div key={formData.formId} className={styles.fieldWrapper} ref={node => this[`form-${formData.formId}`] = node}>
                                    <div className={styles.idField}>
                                        <StringInput
                                            value={formData.id}
                                            placeholder={idField.placeholder}
                                            onChange={this.handleChangeField(formData, idField)}
                                            className='form'
                                            isInvalid={!!idError}
                                            darkThemeSupport
                                            maximumHarcodingIOS
                                        />
                                        <div className={styles.errorMessage}>{idError}</div>
                                    </div>
                                    <div className={styles.hardwareField}>
                                        <BaseSelect
                                            settings={{
                                                value        : formData.hardware,
                                                isSearchable : true
                                            }}
                                            placeholder={hardwareField.placeholder}
                                            placeholderType='secondary'
                                            onChange={this.handleChangeField(formData, hardwareField)}
                                            className='form'
                                            options={this.getSortedOptions(formData.hardware, hardwareField.options)}
                                            styles={HARDWARE_STYLES}
                                            darkThemeSupport
                                            maxSelectHeight={206}
                                            maximumHarcodingIOS
                                            noPortalTarget
                                            isInvalid={!!hardwareError}
                                        />
                                        <div className={styles.errorMessage}>{hardwareError}</div>
                                    </div>
                                    <div
                                        className={cx(styles.removeButton, { invisible: value.length === 1 })}
                                        onClick={this.handleRemoveFormField(formData.formId)}
                                    >
                                        <BinIcon className={styles.deleteIcon} />
                                    </div>
                                </div>
                            );
                        }) : null
                    }
                </div>
                <div className={styles.errorMessage}>{errorText}</div>
            </div>
        );
    }

    renderEditor = () => {
        const { errors } = this.props;
        const { formData } = this.state;
        const errorText = errors ? 'Invalid JSON format' : '';

        const serializedValue = JSON.stringify(formData, undefined, 2);

        return (
            <>
                <div className={cx('editorWrapper', { invalid: errorText })}>
                    <Editor
                        mode={'json'}
                        initialValue={serializedValue}
                        options={{
                            enableBasicAutocompletion : false,
                            enableLiveAutocompletion  : false,
                            enableSnippets            : false,
                            showLineNumbers           : true,
                            tabSize                   : 2
                        }}
                        onChange={this.handleChangeJsonField}
                        onValidate={this.handleSetValidation}
                    />
                </div>
                <div className={styles.errorMessage}>{errorText}</div>
            </>
        );
    }


    render() {
        const { field } = this.props;
        const { viewMode, isJsonValid } = this.state;
        const { theme } = this.context;

        const formFields = MODBUS_FORM_FIELDS.map(fieldData => {
            return fieldData.name === 'hardware'
                ? { ...fieldData, options: field.hardwares.map(hardware => ({ label: hardware, value: hardware })) }
                : fieldData;
        });

        const modbusConfigurationCN = cx(styles.ModbusConfiguration, {
            [theme] : theme
        });

        return (
            <div className={modbusConfigurationCN} ref={ref => this.modbasConfig = ref}>
                <div className={styles.header}>
                    <div className={styles.formInfo}>
                        <h3 className={styles.fieldLabel}>
                            {field.label}
                        </h3>
                        { viewMode === 'form'
                            ? (
                                <div
                                    className={styles.addFieldButton}
                                    onClick={this.handleAddFormField}  // eslint-disable-line
                                >
                                    +
                                </div>
                            ) : null
                        }
                    </div>
                    <ViewModeControls
                        viewMode         = {viewMode}
                        onChangeViewMode = {this.handleChangeViewMode}
                        controls         = {[ {
                            id         : 'form',
                            label      : 'Form',
                            isDisabled : !isJsonValid
                        }, {
                            id         : 'json',
                            label      : 'Json',
                            isDisabled : !isJsonValid
                        } ]}
                    />
                </div>

                { viewMode === 'form'
                    ? this.renderForm(formFields)
                    : this.renderEditor(field)
                }
            </div>
        );
    }
}

export default ModbusConfiguration;
