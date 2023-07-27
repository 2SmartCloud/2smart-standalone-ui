import { safeParseJSON } from '../json';

export function mapNotificationChannelEntityToNotificationChannel(channel) {
    const { configuration } = channel;

    return {
        ...channel,
        ...(configuration && { fields: safeParseJSON(configuration)?.fields })
    };
}
