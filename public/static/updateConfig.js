

function updateConfig() {
    document.removeEventListener('DOMContentLoaded', updateConfig);
    const { hostname, protocol, port } = window.location;
    const brokerUrlProtocol = protocol === 'http:' ? 'ws:' : 'wss:';

    const host = `${hostname}${port ? `:${port}` : ''}`;

    const apiUrl = `${protocol}//${host}`;
    const brokerUrl = `${brokerUrlProtocol}//${host}/mqtt`;

    const backupApiUrl = `${protocol}//${host}`;

    window.APP_CONF = {
        ...window.APP_CONF,
        apiUrl,
        brokerUrl,
        backupApiUrl
    };
}

document.addEventListener('DOMContentLoaded', updateConfig);
