import React, { PureComponent } from 'react';
import { connect }              from 'react-redux';
import PropTypes                from 'prop-types';
import { getIDsByTopic }        from '../../../../actions/homie';
import * as WidgetActions       from '../../../../actions/client/widget/index';
import SelectInput              from './tab/SelectInput';
import ColorSelect              from './tab/ColorSelect';
import BaseTab                  from './tab/Base';
import Row                      from './tab/Row';
import Label                    from './tab/Label';
import StringInput              from './tab/StringInput';
import IntegerInput             from './tab/IntegerInput';
import FloatInput               from './tab/FloatInput';
import BooleanInput             from './tab/BooleanInput';
import styles                   from './AdvancedTab.less';

const FIELDS_MAP = {
    'string'  : StringInput,
    'integer' : IntegerInput,
    'float'   : FloatInput,
    'boolean' : BooleanInput,
    'select'  : SelectInput,
    'color'   : ColorSelect
};

class AdvancedTab extends PureComponent {
    static propTypes = {
        advancedSettings     : PropTypes.object.isRequired,
        activeValue          : PropTypes.object.isRequired,
        isFirstStepCompleted : PropTypes.bool.isRequired,
        params               : PropTypes.object.isRequired,
        advanced             : PropTypes.object.isRequired,
        errors               : PropTypes.object.isRequired,
        setWidgetOption      : PropTypes.func.isRequired,
        setErrors            : PropTypes.func.isRequired,
        getIDsByTopic        : PropTypes.func.isRequired
    }

    handleFieldChange = name => value => {
        const { setWidgetOption, setErrors, advanced } = this.props;

        advanced[name] !== value && setErrors({});
        setWidgetOption({ key: name, value, isAdvanced: true });
    }


    renderField = ({ type, component, label, name, fieldOptions, validationMessages }) => {
        const { advanced, errors, activeValue } = this.props;
        const inputType = typeof type === 'function' ? type(activeValue.dataType) : type;
        const Input = component || FIELDS_MAP[inputType];

        const errorCode = errors[name];
        const errorMessage = validationMessages?.[errorCode] || errorCode;

        if (!Input) {
            console.error(`Component not found! Params: inputType - ${inputType}, type - ${type}`);

            return null;
        }

        return (
            <Row key={name}>
                <Label label={label} />
                <Input
                    {...fieldOptions}
                    // name={name}
                    value        = {advanced[name]}
                    onChange     = {this.handleFieldChange(name)}
                    errorMessage = {errorMessage}
                />
            </Row>
        );
    }

    render() {
        const { isFirstStepCompleted, advancedSettings } = this.props;

        if (!isFirstStepCompleted) {
            return (
                <div className={styles.noTopicMessage}>
                    {'Please choose an entity'}
                </div>
            );
        }

        const fields = advancedSettings?.fields || [];

        return (
            <BaseTab>
                {fields.map(field => this.renderField(field))}
            </BaseTab>
        );
    }
}

function mapStateToProps(state) {
    const {  params, advanced, error, activeValue } = state.client.widget;

    return {
        params,
        advanced,
        activeValue,
        errors : error
    };
}

export default  connect(mapStateToProps, { ...WidgetActions, getIDsByTopic })(AdvancedTab);
