import moment from 'moment';
import * as systemUpdates from './systemUpdates';
import {SYSTEM_UPDATE} from '../../__mocks__/systemUpdatesMock';

describe('systemUpdates mappers', () => {
    it('mapSystemUpdatesEntityToSystemUpdate()', () => {
        const result = systemUpdates.mapSystemUpdatesEntityToSystemUpdate({
            id: "services",
            status: "update-available",
            'last-update': 1598227556657,
            'available-update': 1598227556657,
            entityTopic: "system-updates/services"
        });

        expect(result).toEqual(SYSTEM_UPDATE[0]);
    });

    it('updateField()', () => {
        expect(systemUpdates.updateField({ field: 'last-update', value: '1598227556657' })).toEqual({ lastUpdate: '24.08.2020' });
        expect(systemUpdates.updateField({ field: 'available-update', value: '1598227556657' })).toEqual({ availableUpdate: '24.08.2020' });
        expect(systemUpdates.updateField({ field: 'status', value: 'update-available' })).toEqual({ status: 'update-available' });
    });
});
