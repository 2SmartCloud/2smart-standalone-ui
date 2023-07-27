import React, { PureComponent } from 'react';
import Markdown                 from 'markdown-to-jsx';
import hljs                     from 'highlight.js/lib/highlight';
import javascript               from 'highlight.js/lib/languages/javascript';
import scenarioPage             from '../../../docs/scenario.md';

import styles                   from './DocumentationPage.less';
import './HighlightStyles.less';

class DocumentationPage extends PureComponent {
    componentDidMount() {
        hljs.registerLanguage('javascript', javascript);
        hljs.initHighlightingOnLoad();
    }

    render() {
        return (
            <div className={styles.DocumentationPage}>
                <div className={styles.container}>
                    <Markdown>{scenarioPage}</Markdown>
                </div>
            </div>
        );
    }
}

export default DocumentationPage;
