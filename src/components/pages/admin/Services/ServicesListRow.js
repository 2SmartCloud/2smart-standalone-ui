import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SERVICE } from '../../../../assets/constants/routes';
import ListRow from '../../../base/list/ListRow';

class ServicesListRow extends PureComponent {
    static propTypes = {
        service : PropTypes.shape({
            id            : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
            title         : PropTypes.string,
            state         : PropTypes.string,
            status        : PropTypes.string,
            interfaceLink : PropTypes.string,
            icon          : PropTypes.node
        }).isRequired,
        deleteService     : PropTypes.func.isRequired,
        activateService   : PropTypes.func.isRequired,
        deactivateService : PropTypes.func.isRequired
    }

    state = {
        isProcessing : false
    }

    handleSwitchChange = async () => {
        const { service, activateService, deactivateService } = this.props;

        const handler = service.status === 'ACTIVE'
            ? deactivateService
            : activateService;

        this.setState({
            isProcessing : true
        });

        try {
            await handler(service.id);
        } catch {
            // pass
        }

        this.setState({
            isProcessing : false
        });
    }

    handleDeleteService  = () => {
        const { service, deleteService } = this.props;

        deleteService(service);
    }

    checkIsProcessing() {
        const { service: { state } } = this.props;
        const { isProcessing } = this.state;

        return isProcessing || [ 'starting', 'stopping' ].includes(state);
    }

    render() {
        const { service: { id, title, state, status, icon, interfaceLink } } = this.props;

        const isProcessing = this.checkIsProcessing();
        const servicePath = `${SERVICE}/${id}`;

        return (
            <ListRow
                type           = {icon}
                title          = {title}
                status         = {status}
                statusHint     = {state}
                editPath       = {servicePath}
                externalLink   = {interfaceLink}
                isProcessing   = {isProcessing}
                isDisabled     = {isProcessing}
                onSwitchToggle = {this.handleSwitchChange}
                onDeleteItem   = {this.handleDeleteService}
            />
        );
    }
}

export default ServicesListRow;
