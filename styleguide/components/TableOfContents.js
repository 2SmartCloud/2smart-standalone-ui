import React, { useContext }  from 'react';
import PropTypes from 'prop-types';
import Styled from 'rsg-components/Styled';
import DefaultTableOfContentsRenderer from 'react-styleguidist/lib/client/rsg-components/TableOfContents/TableOfContentsRenderer';
import Switch  from '../../src/components/base/Switch';
import Theme from '../../src/utils/theme';

const styles = () => ({
    control : {
        display        : 'flex',
        justifyContent : 'space-between',
        alignItems     : 'center',
        padding        : '15px'
    }
});

function TableOfContentsRenderer({ classes, children, searchTerm, onSearchTermChange }) {
    const value =  useContext(Theme);

    const handleToogleTheme = e => {
        const newTheme =  e.target.checked ? 'DARK' : 'LIGHT';

        value.onToogleTheme(newTheme);
    };


    return (
        <div>
            <div className={classes.control}>
                Night mode
                <Switch
                    checked={value.theme === 'DARK'}
                    onChange={handleToogleTheme}
                />
            </div>

            <div>
                <DefaultTableOfContentsRenderer
                    searchTerm={searchTerm}
                    onSearchTermChange={onSearchTermChange}
                >
                    {children}
                </DefaultTableOfContentsRenderer>

            </div>
        </div>
    );
}

TableOfContentsRenderer.propTypes = {
    classes  : PropTypes.object.isRequired,
    children : PropTypes.node
};


export default Styled(styles)(TableOfContentsRenderer);
