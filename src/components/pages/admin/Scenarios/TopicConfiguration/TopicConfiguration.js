import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Theme                    from '../../../../../utils/theme';
import InfoIcon                 from '../../../../base/icons/Info';
import EntityControl            from '../../../../base/controls/Entity';
import EntitiesControl          from '../../../../base/controls/Entities';

import styles                   from './TopicConfiguration.less';

const cx = classnames.bind(styles);


class TopicConfiguration extends PureComponent {
    static contextType = Theme //eslint-disable-line

    static propTypes = {
        label         : PropTypes.string,
        options       : PropTypes.array,
        onChange      : PropTypes.func,
        onValueDelete : PropTypes.func,
        onValueSelect : PropTypes.func,
        onOpenInfo    : PropTypes.func,
        description   : PropTypes.string,
        errorText     : PropTypes.string,
        value         : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.arrayOf(PropTypes.object)
        ]),
        multiple    : PropTypes.bool,
        placeholder : PropTypes.string
    }

    static defaultProps = {
        label         : '',
        options       : [],
        onValueDelete : void 0,
        onValueSelect : void 0,
        errorText     : void 0,
        value         : void 0,
        onChange      : void 0,
        description   : void 0,
        onOpenInfo    : () => {},
        multiple      : false,
        placeholder   : ''
    }

    handleOpenInfo = (e) => {
        const { onOpenInfo, description } = this.props;

        if (!onOpenInfo || !description) return;

        onOpenInfo(description)(e);
    }

    renderEntity = () => {
        const {
            options,
            value,
            onChange,
            errorText,
            multiple,
            onValueDelete,
            onValueSelect,
            placeholder
        } = this.props;

        if (multiple) {
            return (
                <EntitiesControl
                    options       = {options}
                    onValueSelect = {onValueSelect}
                    onValueDelete = {onValueDelete}
                    value         = {value}
                    isInvalid     = {!!errorText}
                    isDraggable   = {false}
                    placeholder   = {placeholder}
                />
            );
        }

        return (
            <EntityControl
                options     = {options}
                onChange    = {onChange}
                value       = {value}
                isInvalid   = {!!errorText}
                placeholder = {placeholder}
            />
        );
    }

    render() {
        const { label, errorText, description } = this.props;
        const { theme } = this.context;

        const topicConfigurationCN = cx(styles.TopicConfiguration, {
            [theme] : theme
        });

        return (
            <div className={topicConfigurationCN} ref={ref => this.modbasConfig = ref}>
                <div className={styles.header}>
                    <div className={styles.formInfo}>
                        <h3 className={styles.fieldLabel}>
                            {label}
                            { description
                                ? (
                                    <div
                                        className = {styles.infoButton}
                                        onClick   = {this.handleOpenInfo}
                                    >
                                        <InfoIcon />
                                    </div>
                                ) : null
                            }
                        </h3>
                    </div>
                </div>

                <div className={styles.fieldWrapper}>
                    { this.renderEntity() }
                </div>

                <div className={styles.errorMessage}>{errorText}</div>
            </div>
        );
    }
}

export default TopicConfiguration;
