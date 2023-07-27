import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ColorDefaultValue from './Color';
import LabelDefaultValue from './Label';
import TopicDefaultValue from './Topic';
import BackupDefaultValue from './Backup';

class DefaultValue extends PureComponent {
    render() {
        const { selectType } = this.props;

        switch (selectType) {
            case 'color':
                return <ColorDefaultValue {...this.props} />;
            case 'topic':
                return <TopicDefaultValue {...this.props} />;
            case 'backup':
                return <BackupDefaultValue {...this.props} />;
            default:
                return <LabelDefaultValue {...this.props} />;
        }
    }
}

DefaultValue.propTypes = {
    selectType : PropTypes.string
};

DefaultValue.defaultProps = {
    selectType : undefined
};

export default DefaultValue;
