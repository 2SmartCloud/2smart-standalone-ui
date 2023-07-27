import store from '../store';
import tsStorage from './Storage';

class Manager {
    constructor({ storage }) {
        this.storage = storage;
        this.fetchers = {};
    }

    run(widgets) {
        widgets.forEach(({ id, interval, topic }) => {
            if (!this.fetchers[id] && interval) {
                this.startFetchingData(id, topic, interval);
            }
        });
    }

    runWidgetFetcher(widget) {
        const { id, interval, topic } = widget;

        if (widget.interval) {
            this.startFetchingData(id, topic, interval);
        }
    }

    startFetchingData(id, topic, interval) {
        const msInterval = interval * 1000;

        this.pushChunk(id, topic);

        const fetcher = setInterval(() => {
            this.pushChunk(id, topic);
        }, msInterval);

        this.fetchers[id] = fetcher;
    }

    pushChunk(id, topic) {
        const  value = this.getValueByTopic(topic);
        const chunk = this.generateTsChunk(value);

        this.storage.pushTs(id, chunk);
    }

    generateTsChunk(value) {
        const time = Date.now();

        return {
            value,
            time
        };
    }

    getValueByTopic(topic) {
        const state = store.getState();
        const { deviceId, nodeId, hardwareType, propertyId, propertyType } = topic;
        const device = state.homie.devices[deviceId];
        const threshold = state.homie.thresholds[nodeId]?.find(thr => thr.id === propertyId);
        let value;

        if (device) {
            if (hardwareType === 'node') {
                const node = device.nodes.find(item => item.id === nodeId);

                if (!node) return;

                const nodeProperties = node[propertyType];

                if (!nodeProperties.length) return;

                value = nodeProperties.find(property => property.id === propertyId).value;
            } else if (hardwareType === 'device') {
                const deviceProperties = device[propertyType];

                if (!deviceProperties.length) return;

                value = deviceProperties.find(property => property.id === propertyId).value;
            }
        } else if (threshold) {
            value = threshold.value;
        } else if (hardwareType === 'group') {
            const group = state.groups.list.find(groupItem => groupItem.id === deviceId);
            const groupValue = group?.value;

            value = groupValue;
        }

        return value;
    }

    stopWidgetFetcher(id) {
        const fetcher = this.fetchers[id];

        clearInterval(fetcher);
    }

    stopFetchingData() {
        for (const key in this.fetchers) {
            if (this.fetchers.hasOwnProperty(key)) {
                const fetcher = this.fetchers[key];

                clearInterval(fetcher);
            }
        }
    }
}

const tsManager = new Manager({ storage: tsStorage });

export default tsManager;
