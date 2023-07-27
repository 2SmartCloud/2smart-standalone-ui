import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'rsg-components/Styled';
import DefaultPreview from 'react-styleguidist/lib/client/rsg-components/Preview/Preview';
import Theme  from '../../src/utils/theme';

function Preview({ classes, children, code, evalInContext }) {
    return (
        <div className={classes.wrapper}>
            <Theme.Provider >
                <DefaultPreview code={code}  evalInContext={evalInContext}>
                    {children}
                </DefaultPreview>
            </Theme.Provider>
        </div>
    );
}

Preview.propTypes = {
    classes  : PropTypes.object.isRequired,
    children : PropTypes.node
};

const styles = ({ fontFamily, space }) => ({
    wrapper : {
        backgroundColor : 'var(--secondary_background_color);)',
        padding         : '20px'
    }
});

export default Styled(styles)(Preview);
