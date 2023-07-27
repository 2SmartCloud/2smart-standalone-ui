import Observable from './observable';

describe('Observable', () => {
    let observable;

    beforeEach(() => {
        observable = new Observable();
    });

    it('subscribe() should add new observer', () => {
        observable.subscribe('test', mockFn1);

        const observers = observable.observers.get('test');

        expect(observers).toHaveLength(1);
        expect(observers[0]).toEqual(mockFn1);
    });

    it('unsubscribe() should remove observer', () => {
        observable.subscribe('test', mockFn1);
        observable.subscribe('test', mockFn2);

        observable.unsubscribe('test', mockFn1);
        const observers = observable.observers.get('test');

        expect(observers).toHaveLength(1);
        expect(observers[0]).toEqual(mockFn2);
    });

    it('emit() should call each observer with given event', () => {
        const topics = [ 'topic1', 'topic2' ];
        const mockEvents = [ { data: 'test1' }, { data: 'test2' } ];

        observable.subscribe(topics[0], mockFn1);
        observable.subscribe(topics[0], mockFn2);
        observable.subscribe(topics[1], mockFn3);

        observable.emit(topics[0], mockEvents[0]);
        observable.emit(topics[1], mockEvents[1]);

        expect(mockFn1).toHaveBeenCalledWith(mockEvents[0]);
        expect(mockFn2).toHaveBeenCalledWith(mockEvents[0]);
        expect(mockFn3).toHaveBeenCalledWith(mockEvents[1]);
    });

    it('buildTopicKey() should combine topic for observable from given fields', () => {
        const result = observable.buildTopicKey({
            type     : 'NODE',
            deviceId : 'device-1',
            nodeId   : 'node-1'
        });
        const expected = JSON.stringify({
            type       : 'NODE',
            deviceId   : 'device-1',
            nodeId     : 'node-1',
            propertyId : null,
            entityId   : null
        });

        expect(result).toBe(expected);
    });
});

const mockFn1 = jest.fn();
const mockFn2 = jest.fn();
const mockFn3 = jest.fn();
