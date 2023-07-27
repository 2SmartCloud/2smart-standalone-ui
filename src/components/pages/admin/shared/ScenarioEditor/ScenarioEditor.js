import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import AceEditor                from 'react-ace';
import BaseSelect               from '../../../../base/select/BaseSelect';
import ConfirmationModal        from '../../shared/ConfirmationModal';
import Theme                    from '../../../../../utils/theme';
import styles                   from './ScenarioEditor.less';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const cx = classnames.bind(styles);

class ScenarioEditor extends PureComponent {
    static contextType = Theme; //eslint-disable-line

    static propTypes = {
        errorText         : PropTypes.string,
        onValidate        : PropTypes.func.isRequired,
        onChange          : PropTypes.func.isRequired,
        value             : PropTypes.string,
        field             : PropTypes.object.isRequired,
        scenarioTemplates : PropTypes.object.isRequired,
        initialValue      : PropTypes.string,
        withTemplates     : PropTypes.bool
    }

    static defaultProps = {
        errorText     : '',
        value         : '',
        initialValue  : '',
        withTemplates : true
    }

    state = {
        template : null,
        value    : this.props.initialValue,
        modal    : {
            isModalOpen     : false,
            templateToApply : null
        }
    }
    componentDidMount() {
        this.editor.addEventListener('keydown', this.preventParent);
    }

    componentWillUnmount() {
        this.editor.removeEventListener('keydown', this.preventParent);
    }

    preventParent = (e) => {
        e.stopPropagation();
    }

    handleSelectTemplate = (template) => {
        const { value } = this.props;

        if (!!value?.length) {
            this.handleOpenConfirmModal(template);
        } else {
            this.applyTemplate(template);
        }
    }

    handleOpenConfirmModal = (template) => {
        this.setState({
            modal : {
                isModalOpen     : true,
                templateToApply : template
            }
        });
    }

    handleSubmitEditorClear = () => {
        const { templateToApply } = this.state.modal;

        this.applyTemplate(templateToApply);

        this.setState({
            modal : {
                isModalOpen     : false,
                templateToApply : null
            }
        });
    }

    handleCancelEditorClear = () => {
        this.setState({
            modal : {
                isModalOpen     : false,
                templateToApply : null
            }
        });
    }


    applyTemplate = (template) => {
        this.setState({
            template,
            value : template.value
        });

        this.props.onChange(template.value);
    }

    handleChange = (value) => {
        const { onChange } = this.props;

        this.setState({
            value
        });

        onChange(value);
    }

    getEditorTheme = () => {
        const { theme: globalTheme } = this.context;

        if (globalTheme === 'DARK') return 'monokai';
        if (globalTheme === 'LIGHT') return 'xcode';
    }

    handleEditorValidate = (value) => {
        const { onValidate } = this.props;
        const isValid = !value.filter(({ type }) => type === 'error').length;

        onValidate(isValid);
    }

    render() {
        const { field, errorText, initialValue, scenarioTemplates, withTemplates } = this.props;
        const { label, type } = field;
        const { template, modal:{ isModalOpen }, value } = this.state;
        const placeholder = 'Select template';
        const editorTheme = this.getEditorTheme();
        const scenarioEditorCN = cx(styles.ScenarioEditor, {
            withTemplates
        });

        return (
            <div className={scenarioEditorCN}>
                <div className={styles.labelContainer}>
                    <h3 className={styles.fieldLabel}>{label}</h3>
                    { withTemplates
                        ? (
                            <div className={styles.selectWrapper}>
                                <BaseSelect
                                    mobileTitle     = {placeholder}
                                    options         = {scenarioTemplates}
                                    onChange        = {this.handleSelectTemplate}
                                    placeholder     = {placeholder}
                                    placeholderType = 'secondary'
                                    maxSelectHeight = {206}
                                    isInvalid       = {!!errorText}
                                    settings        = {{
                                        isSearchable : true,
                                        value        : template
                                    }}
                                    styles = {{
                                        placeholder : { 'textAlign': 'left' }
                                    }}
                                />
                            </div>
                        ) : null
                    }
                </div>
                <div
                    className={cx('editorWrapper', { invalid: errorText })}
                    ref={ref => this.editor = ref}
                >
                    <AceEditor
                        mode                = {type}
                        theme               = {editorTheme}
                        name                = 'editor'
                        defaultValue        = {initialValue}
                        fontSize            = '16px'
                        width               = '100%'
                        height              = '100%'
                        value               = {value}
                        onChange            = {this.handleChange}
                        onValidate          = {this.handleEditorValidate}
                        showPrintMargin     = {false}
                        showGutter
                        highlightActiveLine = {false}
                        options             = {{
                            enableBasicAutocompletion : true,
                            enableLiveAutocompletion  : true,
                            enableSnippets            : false,
                            showLineNumbers           : true,
                            tabSize                   : 2
                        }}
                    />
                </div>
                <div className={styles.errorMessage}>{errorText}</div>

                <ConfirmationModal
                    title    = 'Replace script'
                    text     = 'Are you sure you want to replace script?'
                    labels   = {{ submit: 'Yes, replace', cancel: 'Cancel' }}
                    isOpen   = {isModalOpen}
                    onSubmit = {this.handleSubmitEditorClear}
                    onClose  = {this.handleCancelEditorClear}
                />

            </div>
        );
    }
}

export default ScenarioEditor;
