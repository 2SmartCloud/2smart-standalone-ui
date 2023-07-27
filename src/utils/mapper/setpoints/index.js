import getPropertyUnit from '../../getPropertyUnit';

export function mapSetpoint(setpoint) {
    return {
        ...setpoint,
        unit         : getPropertyUnit(setpoint.unit),
        name         : setpoint.id,
        deviceId     : 'threshold',
        hardwareType : 'threshold',
        propertyType : 'threshold',
        nodeId       : setpoint.scenarioId,
        propertyId   : setpoint.id
    };
}
