import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as InterfaceActions from '../../actions/interface';
import * as GroupsActions from '../../actions/groups';

import * as HomieActions from '../../actions/homie';

import { getGroupByHardwareType } from '../../utils/homie/getPropertyByType';
import MultiSelect from './MultiSelect';

class TagContainer extends PureComponent {
    static propTypes = {
        attachGroup   : PropTypes.func.isRequired,
        unAttachGroup : PropTypes.func.isRequired,
        devices       : PropTypes.object.isRequired,
        groupsList    : PropTypes.array.isRequired,
        deviceId      : PropTypes.string.isRequired,
        thresholds    : PropTypes.array.isRequired,
        nodeId        : PropTypes.string,
        propertyId    : PropTypes.string.isRequired,
        propertyType  : PropTypes.string.isRequired,
        hardwareType  : PropTypes.string.isRequired

    }
    static defaultProps = {
        nodeId : ''
    }

    handleGroupAttach =  async group => {
        const { attachGroup, deviceId, nodeId, propertyId, propertyType, hardwareType } = this.props;
        const groupId = group.id;

        await attachGroup(deviceId, nodeId, propertyId, groupId, propertyType, hardwareType);
    };

    handleGroupUnattach = async group => {
        const { unAttachGroup, deviceId, nodeId, propertyId, propertyType, hardwareType } = this.props;
        const groupId = group.id;

        await  unAttachGroup(deviceId, nodeId, propertyId, groupId, propertyType, hardwareType);
    }

    getSelectedGroupsList =(sensorGroupsId) => {
        const { groupsList } = this.props;
        const sensorGroups = groupsList.filter(group => sensorGroupsId.includes(group.id));

        return sensorGroups;
    }


    getSensorGroupsArrayOfId =() => {
        const { devices, deviceId, propertyId, nodeId, propertyType, thresholds, hardwareType } = this.props;
        const   sensorGroupsArrayOfId = getGroupByHardwareType({
            hardwareType,
            devices,
            deviceId,
            thresholds,
            propertyId,
            nodeId,
            propertyType });

        return sensorGroupsArrayOfId;
    }

    render = () => {
        const { groupsList } = this.props;
        const selectedGroupsId = this.getSensorGroupsArrayOfId();
        const groupsToSelect = groupsList.filter(group => !selectedGroupsId?.includes(group.id));
        const selectedGroups = this.getSelectedGroupsList(selectedGroupsId);

        return (
            <MultiSelect
                options={groupsToSelect}
                classes={{
                    menuList : { maxHeight: '150px' }
                }}
                onValueSelect={this.handleGroupAttach}
                onValueDelete={this.handleGroupUnattach}
                values={selectedGroups}
                placeholder='Attach new group...'
                placeholderType='secondary'
                emptyMessages={[
                    'There is no selected groups yet',
                    ' You can attach them above'
                ]}

            />
        );
    };
}

function mapStateToProps(state)  {
    return {
        groupsList   : state.groups.list,
        devices      : state.homie.devices,
        thresholds   : state.homie.thresholds,
        openedPopups : state.applicationInterface.openedPopups,
        propertyType : state.applicationInterface.popupParams.propertyType,
        deviceId     : state.applicationInterface.popupParams.deviceId,
        nodeId       : state.applicationInterface.popupParams.nodeId,
        propertyId   : state.applicationInterface.popupParams.propertyId,
        hardwareType : state.applicationInterface.popupParams.hardwareType

    };
}


export default connect(mapStateToProps, { ...InterfaceActions, ...GroupsActions, ...HomieActions })(TagContainer);

