import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';

import { SCENARIO }             from '../../../../assets/constants/routes';
import ProIcon                  from '../../../base/icons/Pro';
import Image                    from '../../../base/Image';
import ListRow                  from '../../../base/list/ListRow';
import SetpointValue            from './SetpointValue';

import styles                   from './ScenariosListRow.less';

class ScenariosListRow extends PureComponent {
    static propTypes = {
        scenario : PropTypes.shape({
            id            : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
            title         : PropTypes.string,
            status        : PropTypes.string,
            homieState    : PropTypes.string,
            mode          : PropTypes.string,
            rootTopic     : PropTypes.string,
            type          : PropTypes.string,
            setpoints     : PropTypes.array,
            icon          : PropTypes.string,
            isEditAllowed : PropTypes.bool,
            isProcessing  : PropTypes.bool
        }).isRequired,
        isSetpointsLoading                : PropTypes.bool,
        deleteScenario                    : PropTypes.func.isRequired,
        updateScenarioState               : PropTypes.func.isRequired,
        openSetpointsModal                : PropTypes.func.isRequired,
        callExtensionNotExistNotification : PropTypes.func.isRequired
    }

    static defaultProps = {
        isSetpointsLoading : false
    }

    handleSwitchChange = async () => {
        const { scenario: { homieState, rootTopic }, updateScenarioState } = this.props;

        if (!rootTopic) return;

        try {
            await updateScenarioState(rootTopic, homieState !== 'true');
        } catch (error) {
            console.log({ error });
            // pass
        }
    }

    handleDeleteScenario = () => {
        const { scenario, deleteScenario } = this.props;

        deleteScenario(scenario);
    }


    handleOpenSetpointModal=() => {
        const { openSetpointsModal, scenario: { id, title } } = this.props;

        openSetpointsModal({ title, id });
    }

    handleDisabledEditClick = () => {
        const { callExtensionNotExistNotification, scenario: { id, type } } = this.props;

        callExtensionNotExistNotification({ type, id });
    }

    renderScenarioType() {
        const { scenario: { mode, icon } } = this.props;

        return mode === 'SIMPLE'
            ? this.renderSimpleScenarioIcon({ src: icon })
            : <ProIcon className={styles.proIcon} />;
    }

    renderSimpleScenarioIcon = ({ src = '' } = {}) => {
        if (!src) return 'S';

        return (
            <Image
                className      = {styles.simpleScenarioIcon}
                src            = {src}
                renderFallback = {() => <div>S</div>}    // eslint-disable-line
            />
        );
    }

    renderSetpoints = () => {
        const { scenario: { setpoints }, isSetpointsLoading } = this.props;

        return (
                setpoints?.length || isSetpointsLoading
                    ? <SetpointValue
                        isLoading = {isSetpointsLoading}
                        onClick   = {this.handleOpenSetpointModal}
                        setpoints = {setpoints} />
                    : null
        );
    }


    render() {
        const { scenario: { id, title, homieState, setpoints, isEditAllowed, isProcessing },
            isSetpointsLoading } = this.props;
        const scenarioPath = `${SCENARIO}/${id}`;
        const scenarioType = this.renderScenarioType();

        const customClasses = (setpoints?.length  || isSetpointsLoading) ? {
            title   : styles.scenarioTitle,
            content : styles.scenarioContent
        } : {};

        const STATUS_BY_STATE = {
            'true'   : 'ACTIVE',
            'false'  : 'INACTIVE',
            DISABLED : 'DISABLED'
        };

        const status = STATUS_BY_STATE[homieState] || STATUS_BY_STATE.DISABLED;
        const statusHint = isProcessing ? 'processing' : status?.toLowerCase() || '';

        return (
            <ListRow
                classNames     = {customClasses}
                type           = {scenarioType}
                title          = {title}
                status         = {status}
                statusHint     = {statusHint}
                editPath       = {scenarioPath}
                isProcessing   = {isProcessing}
                isEditAllowed  = {isEditAllowed}
                onEditClick    = {this.handleDisabledEditClick}
                isDisabled     = {isProcessing || status === STATUS_BY_STATE.DISABLED}
                renderContent  = {this.renderSetpoints()}
                onSwitchToggle = {this.handleSwitchChange}
                onDeleteItem   = {this.handleDeleteScenario}
            />
        );
    }
}

export default ScenariosListRow;
