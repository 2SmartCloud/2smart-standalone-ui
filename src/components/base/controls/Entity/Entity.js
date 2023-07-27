import React, { PureComponent }  from 'react';
import PropTypes                 from 'prop-types';
import classnames                from 'classnames/bind';
import Tooltip                   from '@material-ui/core/Tooltip';
import { Close }                 from '@material-ui/icons';

import globalEnterHandler        from '../../../../utils/globalEnterHandler';
import { getEntityLabelByTopic } from '../../../../utils/homie/getEntities';
import EntityModal               from '../../../base/modals/EntityModal';
import PlusIcon                  from '../../icons/Plus';

import styles                    from './Entity.less';

const cx = classnames.bind(styles);

class EntityControl extends PureComponent {
    state = {
        isOpen : false
    }

    componentWillUnmount() {
        globalEnterHandler.unregister(this.handleEnterPressed);
    }

    handleEnterPressed = () => {
        this.handleOpenModal();
    }

    handleInputFocus = () => {
        globalEnterHandler.register(this.handleEnterPressed);
    }

    handleInputBlur = () => {
        globalEnterHandler.unregister(this.handleEnterPressed);
    }

    handleOpenModal = () => {
        this.setState({ isOpen: true });
    }

    handleClearValue = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { onChange, onDelete, value } = this.props;

        if (onDelete) onDelete(value);
        else  onChange('');
    }

    handleCloseModal = () => {
        this.setState({ isOpen: false });
    }

    handleSubmit = (selectedTopic) => {
        const { onChange } = this.props;

        this.setState({ isOpen: false });
        onChange(selectedTopic);
    }

    getTolltipData = (processValue) => {
        const { multiple, value } = this.props;

        if (multiple) return '';

        return (
            <div>
                <div>{processValue}</div>
                { value?.topic
                    ? <div>({value?.topic})</div>
                    : null
                }
            </div>
        );
    }

    render() {
        const {
            value,
            isInvalid,
            placeholder,
            darkThemeSupport,
            options,
            multiple
        } = this.props;

        const processValue = !value || multiple ? '' : getEntityLabelByTopic(value);
        const { isOpen } = this.state;
        const entityControlCN = cx('EntityControl', {
            invalid : isInvalid,
            dark    : darkThemeSupport
        });

        const modalTopics = multiple
            ? options?.filter(option => {
                return !value?.find(entity => entity?.topic === option?.topic);
            }) : options;

        const isSelectedValueDeleted = multiple
            ? false
            : value && (!value?.topic || value.isDeleted);
        const withClearButton = !(multiple || !value);
        const withTooltip = !multiple ? !!processValue : false;
        const inputCN = cx('input', { deleted: isSelectedValueDeleted });
        const defaultPlaceholder = multiple ? 'Select entities' : 'Select entity';

        const entityInput = (
            <div
                className={cx(styles.inputWrapper, { withClearButton })}>
                <input
                    className   = {inputCN}
                    value       = {processValue}
                    placeholder = {placeholder ? placeholder : defaultPlaceholder}
                    onClick     = {this.handleOpenModal}
                    onFocus     = {this.handleInputFocus}
                    onBlur      = {this.handleInputBlur}
                    readOnly
                />
                { withClearButton
                    ? (
                        <div
                            className = {styles.clearButton}
                            onClick   = {this.handleClearValue}
                        >
                            <Close />
                        </div>
                    ) : null
                }
            </div>
        );

        const tooltipLabel = isSelectedValueDeleted
            ? 'Topic has been deleted'
            : this.getTolltipData(processValue);

        return (
            <>
                <div className={entityControlCN}>
                    { withTooltip
                        ? (
                            <Tooltip
                                title                = {tooltipLabel}
                                placement            = 'bottom-start'
                            >
                                { entityInput }
                            </Tooltip>
                        ) : entityInput
                    }
                    <div
                        className = {styles.buttonWrapper}
                        onClick   = {this.handleOpenModal}
                    >
                        <PlusIcon />
                    </div>
                </div>
                { isOpen
                    ? (
                        <EntityModal
                            isOpen   = {isOpen}
                            onClose  = {this.handleCloseModal}
                            topics   = {modalTopics}
                            selected = {value}
                            onSubmit = {this.handleSubmit}
                            multiple = {multiple}
                        />
                    ) : null
                }
            </>
        );
    }
}


EntityControl.propTypes = {
    value : PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    isInvalid        : PropTypes.bool,
    placeholder      : PropTypes.string,
    onChange         : PropTypes.func.isRequired,
    onDelete         : PropTypes.func,
    darkThemeSupport : PropTypes.bool,
    options          : PropTypes.array,
    devices          : PropTypes.shape({}),
    multiple         : PropTypes.bool
};

EntityControl.defaultProps = {
    value            : void 0,
    isInvalid        : false,
    darkThemeSupport : false,
    placeholder      : '',
    multiple         : false,
    onDelete         : undefined,
    options          : [],
    devices          : {}
};

export default EntityControl;

