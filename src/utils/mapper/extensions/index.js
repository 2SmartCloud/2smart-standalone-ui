import config from '../../../../config';

export function getExtensionTitle(name = '') {
    let title = name;

    if (title.search(/^@2smart\//g) !== -1) {
        title = title.replace(/^@2smart\//g, '').replace(/-/g, ' ');
        title = title.charAt(0).toUpperCase() + title.slice(1);
    }

    return title;
}

export function mapExtension(extension) {
    return {
        ...extension,
        title : getExtensionTitle(extension?.name || ''),
        state : extension.hasOwnProperty('state') ? extension.state : 'uninstalled'
    };
}

export function mapExtensionEntity({ iconFilename, scheme = [], name, ...rest }) {
    return {
        icon   : iconFilename ? `${config.apiUrl}/api/static/extension/icons/${iconFilename}` : undefined,
        title  : getExtensionTitle(name),
        name,
        fields : scheme,
        ...rest
    };
}


export function mapExtensionEntityUpdate({ iconFilename, scheme, ...rest }) {
    return {
        ...(iconFilename && { icon: `${config.apiUrl}/api/static/extension/icons/${iconFilename}` }),
        ...(scheme && { fields: JSON.parse(scheme) }),
        ...rest
    };
}
