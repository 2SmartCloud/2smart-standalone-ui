import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import BaseSelect               from '../../../base/select/BaseSelect';
import IconOption               from '../../../base/select/Option/IconOption';
import FooterButtonMenu         from '../../../base/select/Menu/FooterButtonMenu';
import styles                   from './SetupScenarioSelect.less';

const selectStyles = {
    control : {
        '@media (max-width: 550px)' : {
            minWidth : '160px'
        }
    },
    placeholder : {
        width : 'auto'
    },
    indicatorSeparator : {
        display : 'none'
    },
    menuList : {
        maxHeight                   : '555px',
        '@media (max-width: 650px)' : {
            maxHeight : '540px'
        },
        '@media (min-width: 651px) and (max-height: 800px)' : {
            maxHeight : '400px'
        },
        '@media (min-width: 651px) and (max-height: 600px)' : {
            maxHeight : '200px'
        },
        '@media (min-width: 651px) and (max-height: 400px)' : {
            maxHeight : '120px'
        },
        '@media (min-width: 651px) and (max-height: 320px)' : {
            maxHeight : '80px'
        },
        '@media (max-width: 650px) and (max-height: 800px)' : {
            maxHeight : '340px'
        },
        '@media (max-width: 650px) and (max-height: 600px)' : {
            maxHeight : '140px'
        },
        '@media (max-width: 650px) and (max-height: 400px)' : {
            maxHeight : '60px'
        }
    },
    option : {
        '*' : {
            textTransform : 'none !important'
        }
    }
};

class SetupScenarioSelect extends PureComponent {
    static propTypes = {
        placeholder : PropTypes.string,
        options     : PropTypes.array.isRequired,
        onCreate    : PropTypes.func.isRequired
    }

    static defaultProps = {
        placeholder : undefined
    }

    handleSelect = ({ value }) => {
        const { onCreate } = this.props;

        onCreate({ mode: 'SIMPLE', type: value });
    }

    handleButtonClick = () => {
        const { onCreate } = this.props;

        onCreate({ mode: 'ADVANCED' });
    }

    getNoOptionsMessage(search) {
        return search?.inputValue.length
            ? 'Nothing found'
            : 'Add extensions from Market';
    }

    renderOption = option => {
        const { options } = this.props;

        const icon = options.find(item => item.value === option.value)?.icon;

        return <IconOption {...option} icon={icon} />;
    }

    renderMenu = innerProps => {
        const button = (
            <button className={styles.proButton} onClick={this.handleButtonClick}>Create Pro scenario</button>
        );

        return (
            <FooterButtonMenu {...innerProps} footerButton={button} />
        );
    }

    renderFooter=() => {
        return (
            <button className={styles.proButton} onClick={this.handleButtonClick}>Create Pro scenario</button>
        );
    }

    render() {
        const { placeholder, options } = this.props;

        const components = {
            Option : this.renderOption,
            Menu   : this.renderMenu
        };

        return (
            <BaseSelect
                placeholder={placeholder}
                placeholderType='secondary'
                renderFooter={this.renderFooter}
                options={options}
                components={components}
                styles={selectStyles}
                settings={{
                    isSearchable : true,
                    value        : null
                }}
                noOptionsMessage={this.getNoOptionsMessage}
                onChange={this.handleSelect}
                darkThemeSupport
            />
        );
    }
}

export default SetupScenarioSelect;
