export function getSettingsSuccessMessage(payload) {
    if (payload.username && payload.oldPassword) return 'Your settings successfully updated';
    else if (payload.username) return 'Your login successfully updated';
    else if (payload.oldPassword) return 'Your password successfully updated';
}
