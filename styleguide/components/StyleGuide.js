import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DefaultStyleGuideRenderer from 'react-styleguidist/lib/client/rsg-components/StyleGuide/StyleGuideRenderer';
import Theme, { THEMES } from '../../src/utils/theme';

export function StyleGuideRenderer({ classes, title, version, homepageUrl, children,	toc,	hasSidebar }) {
    const [ state, setState ] = useState('LIGHT');

    useEffect(() => {
        Object.keys(THEMES.LIGHT).forEach(key => {
            document.documentElement.style.setProperty(key, THEMES.LIGHT[key]);
        });
    }, []);

    const handleToogleTheme = newTheme => {
        setState({ theme: newTheme });
        Object.keys(THEMES[newTheme]).forEach(key => {
            document.documentElement.style.setProperty(key, THEMES[newTheme][key]);
        });
    };


    return (
        <div>
            <Theme.Provider
                value={{
                    theme         : state.theme,
                    onToogleTheme : handleToogleTheme
                }}
            >
                <DefaultStyleGuideRenderer
                    title={title} version={version} homepageUrl={homepageUrl}
                    toc={toc} hasSidebar={hasSidebar}
                >

                    {children}
                </DefaultStyleGuideRenderer>
            </Theme.Provider>
        </div>
    );
}

StyleGuideRenderer.propTypes = {
    classes  : PropTypes.object.isRequired,
    children : PropTypes.node
};


export default (StyleGuideRenderer);
