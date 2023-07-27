echo "
window.APP_CONF = {
    brokerUrl       : ${MQTT_BROKER_URI:=\"ws://localhost:8083/mqtt\"},
    apiUrl          : ${API_URI:=\"http://localhost:8000\"},
    apiPrefix       : ${API_PREFIX:=\"/api/v1/\"},
    backupApiUrl    : ${BACKUP_API_URI:=\"http://localhost:9000\"},
    backupApiPrefix : ${BACKUP_API_PREFIX:=\"/\"},
    mqttUsername    : \"${MQTT_USER}\",
    mqttPassword    : \"${MQTT_PASS}\",
    mqttCacheLimit  : ${MQTT_CACHE_LIMIT:=10000},
    env             : ${NODE_ENV:=\"local\"}
};
" > ${CONFIG_PATH:='./build/static/config.js'}
