import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import brace from 'brace'; //eslint-disable-line
import Theme from '../../utils/theme';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';


import styles from './Editor.less';

class Editor extends PureComponent {
    static contextType = Theme; //eslint-disable-line

    static propTypes = {
        mode         : PropTypes.string,
        initialValue : PropTypes.string,
        options      : PropTypes.object,
        onChange     : PropTypes.func.isRequired,
        onValidate   : PropTypes.func.isRequired
    }

    static defaultProps = {
        mode         : 'plain_text',
        initialValue : undefined,
        options      : undefined
    }

    state = {
        value : this.props.initialValue
    }
    componentDidMount() {
        this.editor.addEventListener('keydown', this.preventParent);
    }

    componentWillUnmount() {
        this.editor.removeEventListener('keydown', this.preventParent);
    }

    preventParent=(e) => {
        e.stopPropagation();
    }

    handleChange = (value) => {
        const { onChange } = this.props;

        this.setState({
            value
        });

        onChange(value);
    }

    handleEditorValidate = (value) => {
        const { onValidate } = this.props;
        const isValid = !value.filter(({ type }) => type === 'error').length;

        onValidate(isValid);
    }

    getEditorTheme = () => {
        const { theme: globalTheme } = this.context;

        if (globalTheme === 'DARK') return 'monokai';
        if (globalTheme === 'LIGHT') return 'xcode';
    }

    render() {
        const { value } = this.state;
        const { mode, initialValue, options  } = this.props;
        const editorTheme = this.getEditorTheme();

        return (
            <div
                className={styles.Editor}
                ref={ref => this.editor = ref}
            >
                <AceEditor
                    mode={mode}
                    theme={editorTheme}
                    name='editor'
                    defaultValue={initialValue}
                    fontSize='16px'
                    width='100%'
                    height='100%'
                    value={value}
                    onChange={this.handleChange}
                    onValidate={this.handleEditorValidate}
                    showPrintMargin={false}
                    showGutter
                    highlightActiveLine={false}
                    setOptions={options}
                />
            </div>
        );
    }
}

export default Editor;
