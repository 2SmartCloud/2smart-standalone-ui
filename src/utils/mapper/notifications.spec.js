import * as notifications from './notifications';

describe('notifications mappers', () => {
    describe('mapSystemUpdatesEntityToSystemUpdate()', () => {
        it('should convert bool', () => {
            const result = notifications.mapNotificationEntityToNotification({
                id     : "services",
                status : "update-available",
                isRead : 'true',
            });

            expect(result).toEqual({
                id     : "services",
                status : "update-available",
                isRead : true,
            });
        });

        it('should convert bool "true" -> true', () => {
            const result = notifications.mapNotificationEntityToNotification({
                id     : "services",
                status : "update-available",
                isRead : 'false',
            });

            expect(result).toEqual({
                id     : "services",
                status : "update-available",
                isRead : false,
            });
        });

        it('should convert bool "false" -> false', () => {
            const result = notifications.mapNotificationEntityToNotification({
                id     : "services",
                status : "update-available",
                isRead : 'false',
            });

            expect(result).toEqual({
                id     : "services",
                status : "update-available",
                isRead : false,
            });
        });

        it('should convert bool false -> false', () => {
            const result = notifications.mapNotificationEntityToNotification({
                id     : "services",
                status : "update-available",
                isRead : false,
            });

            expect(result).toEqual({
                id     : "services",
                status : "update-available",
                isRead : false,
            });
        });

        it('should convert bool true -> true', () => {
            const result = notifications.mapNotificationEntityToNotification({
                id     : "services",
                status : "update-available",
                isRead : true,
            });

            expect(result).toEqual({
                id     : "services",
                status : "update-available",
                isRead : true,
            });
        });
    });
});
