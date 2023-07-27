/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import StringInput              from '../../../../base/inputs/String';
import BinIcon                  from '../../../../base/icons/Bin';
import InfoIcon                 from '../../../../base/icons/Info';
import EntityControl            from '../../../../base/controls/Entity';

import styles                   from './BaseConfiguration.less';

const cx = classnames.bind(styles);

const VALIDATION_ERRORS_MAP = {
    'REQUIRED'     : 'Value is required',
    'FORMAT_ERROR' : 'Format error'
};

class BaseConfiguration extends PureComponent {
    static propTypes = {
        initialState : PropTypes.array.isRequired,
        topics       : PropTypes.array,
        field        : PropTypes.shape({
            label   : PropTypes.string,
            name    : PropTypes.string,
            default : PropTypes.array
        }),
        errors      : PropTypes.object.isRequired,
        onInteract  : PropTypes.func,
        onChange    : PropTypes.func,
        description : PropTypes.string,
        onOpenInfo  : PropTypes.func
    }

    static defaultProps = {
        topics : [],
        field  : {
            label   : '',
            name    : '',
            default : [ { topic: '', messageOn: '', messageOff: '' } ]
        },
        onChange    : undefined,
        onInteract  : undefined,
        description : void 0,
        onOpenInfo  : void 0
    }

    state = {
        activeField : null,
        fields      : []
    }

    componentDidMount() {
        const { initialState, field } = this.props;

        if (!initialState) return this.setState({ fields: field.default });

        this.setState({ fields: initialState });
    }

    componentWillUnmount() {
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    }

    handleOpenInfo = (e) => {
        const { onOpenInfo, description } = this.props;

        if (!onOpenInfo || !description) return;

        onOpenInfo(description)(e);
    }

    handleChangeEntity = fieldId => ({ value }) => {
        const { onChange } = this.props;
        const { fields } = this.state;
        const fieldsToSet = [ ...fields ];

        const result = fieldsToSet.map((data, index) => {
            if (index === fieldId) {
                return {
                    topic      : value,
                    messageOn  : data.messageOn,
                    messageOff : data.messageOff
                };
            }

            return data;
        });

        this.setState({ fields: result });

        if (onChange) onChange(result);
    }

    handleChangeField = (name, fieldId) => value => {
        const { onChange } = this.props;
        const { fields } = this.state;
        const fieldsToSet = [ ...fields ];

        const result = fieldsToSet.map((data, index) => {
            if (index === fieldId) {
                return {
                    ...data,
                    topic  : data.topic,
                    [name] : value
                };
            }

            return data;
        });

        this.setState({ fields: result });

        if (onChange) onChange(result);
    }

    handleAddField = () => {
        const { onChange } = this.props;
        const { fields } = this.state;
        const dataToAdd = { topic: '', messageOn: '', messageOff: '' };
        const dataToSet = [ ...fields, dataToAdd ];

        this.setState({ fields: dataToSet }, () => {
            this.scrollTo();
            this.onInteract();
        });

        if (onChange) onChange(dataToSet);
    }

    handleRemoveField = fieldId => () => {
        const { onChange } = this.props;
        const { fields } = this.state;
        const prevFields = [ ...fields ];
        const dataToSet = prevFields.filter((item, index) => index !== fieldId);

        this.setState({
            fields : dataToSet
        });

        if (onChange) onChange(dataToSet);
        this.onInteract();
    };

    getError(code, index, key) {
        if (!code) return;
        if (typeof code === 'string') return VALIDATION_ERRORS_MAP[code];

        if (!code[index]) return;

        const text = code[index][key];

        return VALIDATION_ERRORS_MAP[text];
    }

    scrollTo = (direction = 'bottom') => {
        this.scrollTimeout = setTimeout(() => {
            const position = direction === 'bottom' ? 'end' : 'start';

            this.scheduleConfig.scrollIntoView({ block: position, behavior: 'smooth' });
        }, 0);
    }

    onInteract = () => {
        const { onInteract, errors, field } = this.props;

        if (onInteract && errors) onInteract(field.name);
    }

    renderField = () => {
        const { errors, topics } = this.props;
        const schemeField = this.props.field;
        const { fields = [] } = this.state;

        const selectedTopics = fields.map(field => field.topic);
        const options = topics.filter(field => !selectedTopics.includes(field.value));

        return (
            <div className={styles.formFieldWrapper}>
                {fields.map((data, index) => {
                    const topicError = this.getError(errors, index, 'topic');
                    const messageOnError = this.getError(errors, index, 'messageOn');
                    const messageOffError = this.getError(errors, index, 'messageOff');
                    const isInvisible = fields.length === 1;
                    const selectedValue = data.topic;
                    const value = selectedValue
                        ? topics.find(topic => topic.value === selectedValue) || { label: selectedValue }
                        : null;

                    return (
                        <div key={index} className={styles.fieldWrapper}>
                            <div className={styles.entityField}>
                                <EntityControl
                                    options     = {options}
                                    onChange    = {this.handleChangeEntity(index)}
                                    value       = {value}
                                    isInvalid   = {!!topicError}
                                    placeholder = {schemeField?.placeholder}
                                />
                                <div className={styles.errorMessage}>{topicError}</div>
                            </div>
                            <div className={styles.messageOnField}>
                                <StringInput
                                    value       = {data.messageOn}
                                    placeholder = 'Message on'
                                    onChange    = {this.handleChangeField('messageOn', index)}
                                    className   = 'form'
                                    isInvalid   = {!!messageOnError}
                                    darkThemeSupport
                                    maximumHarcodingIOS
                                />
                                <div className={styles.errorMessage}>{messageOnError}</div>
                            </div>
                            <div className={styles.messageOffField}>
                                <StringInput
                                    value       = {data.messageOff}
                                    placeholder = 'Message off'
                                    onChange    = {this.handleChangeField('messageOff', index)}
                                    className   = 'form'
                                    isInvalid   = {!!messageOffError}
                                    darkThemeSupport
                                    maximumHarcodingIOS
                                />
                                <div className={styles.errorMessage}>{messageOffError}</div>
                            </div>
                            <div
                                className={cx(styles.removeButton, { invisible: isInvisible })}
                                onClick={this.handleRemoveField(index)}
                            >
                                <BinIcon className={styles.deleteIcon} />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        const { field, description } = this.props;

        return (
            <div className={styles.BaseConfiguration} ref={node => this.scheduleConfig = node}>
                <div className={styles.header}>
                    <div className={styles.formInfo}>
                        <h3 className={styles.fieldLabel}>
                            {field.label}
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
                        <div
                            className={styles.addFieldButton}
                            onClick={this.handleAddField}
                        >
                            +
                        </div>
                    </div>
                </div>
                {this.renderField()}
            </div>
        );
    }
}

export default BaseConfiguration;
