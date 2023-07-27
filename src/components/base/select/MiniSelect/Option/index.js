import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ColorOption from './Color.js';
import LabelOption from './Label.js';
import TopicOption from './Topic';
import BackupOption from './Backup';

class Option extends PureComponent {
    render() {
        const { selectType } = this.props;

        switch (selectType) {
            case 'color':
                return <ColorOption {...this.props} />;
            case 'topic':
                return <TopicOption {...this.props} />;
            case 'backup':
                return <BackupOption {...this.props} />;
            default:
                return <LabelOption {...this.props}  />;
        }
    }
}

Option.propTypes = {
    selectType : PropTypes.string
};

Option.defaultProps = {
    selectType : undefined
};

export default Option;
