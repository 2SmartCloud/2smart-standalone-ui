import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import BaseSelect               from '../BaseSelect';
import BackupOption             from '../Option/BackupOption/';
import BackupSingleValue             from '../SingleValue/BackupSingleValue/';

const styles = {
    container : {
        height : '44px'
    },
    control : {
        height : '44px'
    },
    menu : {
        left : 0
    },
    menuList : {
        margin : '12px 10px'
    },
    placeholder : {
        textAlign : 'left'
    },
    singleValue : {
        width : '100%'
    }
};

class BackupSelect extends PureComponent {
    static propTypes = {
        placeholder : PropTypes.string,
        style       : PropTypes.object,
        onChange    : PropTypes.func.isRequired,
        settings    : PropTypes.object
    }

    static defaultProps = {
        placeholder : undefined,
        style       : undefined,
        settings    : undefined

    }

    handleSelect = (item) => {
        const { onChange } = this.props;

        onChange(item);
    }

    render() {
        const components = {
            Option      : BackupOption,
            SingleValue : BackupSingleValue
        };

        const settings = {
            ...this.props.settings,
            isSearchable : true
        };

        return (
            <BaseSelect
                {...this.props}
                components={components}
                styles={styles}
                settings={settings}
                onChange={this.handleSelect}
                placeholderType='secondary'
                selectType='backup'
                darkThemeSupport
            />
        );
    }
}

export default BackupSelect;
