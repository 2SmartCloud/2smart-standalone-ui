export default class Observable {
    observers = new Map();

    subscribe(topic, observer) {
        const observers = this.observers.get(topic);

        if (!observers) this.observers.set(topic, []);

        this.observers.get(topic).push(observer);
    }

    unsubscribe(topic, observer) {
        const observers = this.observers.get(topic);

        if (!observers) return;

        this.observers.set(topic, observers.filter(obs => obs !== observer));
    }

    emit(topic, event) {
        const observers = this.observers.get(topic);

        if (!(observers && observers.length)) return;

        // console.group('Emit');
        // console.log(topic);
        // console.log(event);
        // console.groupEnd();

        for (const observer of observers) {
            observer(event);
        }
    }

    buildTopicKey({ type, deviceId = null, nodeId = null, propertyId = null, entityId = null }) {
        return JSON.stringify({
            type,
            deviceId,
            nodeId,
            propertyId,
            entityId
        });
    }
}
