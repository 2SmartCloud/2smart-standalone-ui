export function mapNotificationEntityToNotification(entity) {
    if (!entity) return entity;

    const processEntity = {
        ...entity
    };

    if ('isRead' in entity) {
        const { isRead } = entity;

        processEntity.isRead = !(isRead === 'false' || !isRead);
    }

    return processEntity;
}
