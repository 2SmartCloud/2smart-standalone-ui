/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import MultiSelect              from '../../../../base/MultiSelect';
import InfoIcon                 from '../../../../base/icons/Info';
import NotificationOption       from '../../../../base/select/Option/NotificationOption';
import NotificationSingleValue  from '../../../../base/select/SingleValue/NotificationSingleValue';

import styles                   from './NotificationConfiguration.less';

const cx = classnames.bind(styles);

class NotificationConfiguration extends PureComponent {
    static propTypes = {
        initialState : PropTypes.array.isRequired,
        field        : PropTypes.shape({
            label   : PropTypes.string,
            name    : PropTypes.string,
            default : PropTypes.array
        }),
        errors           : PropTypes.object.isRequired,
        userChannelsList : PropTypes.array,
        onChange         : PropTypes.func,
        description      : PropTypes.string,
        onOpenInfo       : PropTypes.func
    }

    static defaultProps = {
        field : {
            label   : '',
            name    : '',
            default : [ ]
        },
        userChannelsList : [],
        onChange         : undefined,
        description      : void 0,
        onOpenInfo       : void 0
    }

    state = {
        activeField : null,
        fields      : [ ]
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

    handleAddChannel = ({ value } = {}) => {
        const { onChange } = this.props;
        const { fields } = this.state;
        const fieldsToSet = [ ...(fields || []), value ];

        this.setState({ fields: fieldsToSet });

        if (onChange) onChange(fieldsToSet);
    }

    handleDeleteChannel = ({ value }) => {
        const { onChange } = this.props;
        const { fields } = this.state;
        const fieldsToSet = (fields || []).filter(selected => selected !== value);

        this.setState({ fields: fieldsToSet });

        if (onChange) onChange(fieldsToSet);
    }

    getChannelsOptions = () => {
        const { userChannelsList } = this.props;
        const result = userChannelsList.map(data => ({
            id    : data.id,
            label : data.alias,
            value : data.alias,
            type  : data.type
        }));

        return [ {
            id    : '@system',
            label : 'System notifications',
            value : '@system',
            type  : ''
        }, ...result ];
    }

    renderFields = () => {
        const { errors } = this.props;
        const { fields = [] } = this.state;
        const channels = this.getChannelsOptions();
        const options = channels.filter(channel => !fields?.includes(channel.value));
        const values = fields?.length
            ? channels.filter(channel => fields?.includes(channel.value))
            : null;
        const customComponents = { SingleValue: NotificationSingleValue, Option: NotificationOption };

        return (
            <div className={styles.formFieldWrapper}>
                <div className={styles.fieldWrapper}>
                    <div className={cx(styles.selectField, { withValue: values?.length })}>
                        <MultiSelect
                            options         = {options}
                            classes         = {{
                                menuList : { maxHeight: '230px' }
                            }}
                            onValueSelect   = {this.handleAddChannel}
                            onValueDelete   = {this.handleDeleteChannel}
                            values          = {values}
                            placeholder     = 'Select channels'
                            placeholderType = 'secondary'
                            components      = {customComponents}
                            isInvalid       = {!!errors}
                            menuPlacement   = 'top'
                            styles          = {{
                                placeholder : { 'textAlign': 'left' }
                            }}
                        />
                        { !values?.length || errors
                            ? <div className={styles.errorMessage}>{errors}</div>
                            : null
                        }
                    </div>
                </div>
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
                    </div>
                </div>
                { this.renderFields() }
            </div>
        );
    }
}

export default NotificationConfiguration;
