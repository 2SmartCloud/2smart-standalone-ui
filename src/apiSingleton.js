import config     from './../config';
import apiFactory from './api';

const api = apiFactory({
    apiUrl          : config.apiUrl,
    apiPrefix       : config.apiPrefix,
    backupApiUrl    : config.backupApiUrl,
    backupApiPrefix : config.backupApiPrefix
});

export default api;
