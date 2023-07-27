export function getDataFromSearch(devicesObj, searchQuery) {
    const allDevices = Object.values(devicesObj);

    return searchQuery
        ? search(allDevices, searchQuery)
        : allDevices;
}


function search(devices, searchQuery) {
    const devicesToRender = [];

    devices.forEach(device => {
        const { name, title, nodes } = device;
        const deviceName = name.toLowerCase();
        const deviceTitle = title.toLowerCase();
        const query = searchQuery.toLowerCase();
        const displayedTitle = deviceTitle || deviceName;

        if (displayedTitle.includes(query)) {
            devicesToRender.push(device);
        } else {
            const nodesToRender = [];

            nodes.forEach(node => {
                const { title:nodeTitle, name:nodeName, sensors } = node;
                const displayedNodeTitle = nodeTitle.toLowerCase() || nodeName.toLowerCase();

                if (displayedNodeTitle.includes(query)) {
                    nodesToRender.push(node);
                } else {
                    let isNodeSatisfySearch = false;

                    sensors.forEach(sensor => {
                        const { title:sensorTitle, name:sensorName, alias } = sensor;
                        const aliasName = alias?.name || '';


                        const displayedSensorTitle = sensorTitle.toLowerCase() || sensorName.toLowerCase();

                        if (displayedSensorTitle.includes(query) || aliasName.includes(query)) {
                            isNodeSatisfySearch = true;
                        }
                    });
                    if (isNodeSatisfySearch) {
                        nodesToRender.push(node);
                    }
                }
            });

            if (nodesToRender.length) {
                const deviceFromSearch = {
                    ...device,
                    nodes : nodesToRender
                };

                devicesToRender.push(deviceFromSearch);
            }
        }
    });

    return devicesToRender;
}
