export const REST_ADAPTER_FIELDS=  [
    {
        name: 'DEVICE_NAME',
        type: 'string',
        label: 'Service name'
    },
    {
        name: 'BASIC_AUTH_LOGIN',
        type: 'string',
        label: 'Basic auth login',
    },
    {
        name: 'BASIC_AUTH_PASSWORD',
        type: 'string',
        label: 'Basic auth password'
    },
    {
        name: 'DEBUG',
        type: 'string',
        label: 'Debug'
    }
];

export const MARKET_SERVICES_MOCK_LIST = [
    {
        name   : 'knx',
        label  : 'KNX Bridge',
        icon   : 'foo/bar/icon.svg',
        fields : [
            {
                name    : 'KNX_CONNECTION_IP_ADDR',
                type    : 'string',
                label   : 'Connection IP',
                default : '192.168.1.1'
            },
            {
                name    : 'KNX_CONNECTION_IP_PORT',
                type    : 'integer',
                label   : 'Connection port',
                default : 502
            },
            {
                name  : 'KNX_CONNECTION_PHYS_ADDR',
                type  : 'string',
                label : 'Physical address of the ip interface'
            }
        ],
        status : 'installed'
    },
    {
        name   : 'xiaomi',
        label  : 'Xiaomi Bridge',
        fields : [],
        status : 'has-update'
    },
    {
        name   : 'modbus',
        label  : 'Modbus Bridge',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name: 'rest-adapter',
        label: 'REST Adapter',
        icon: 'icons/rest-adapter.svg',
        status: 'not-installed',
        state: 'pulled',
        fields: [ ...REST_ADAPTER_FIELDS],
        processingLabel: '',
        isProcessing: false
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    },
    {
        name   : 'test',
        label  : 'Test',
        fields : [],
        status : 'not-installed'
    }
];


