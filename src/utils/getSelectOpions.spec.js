import { getOptions,checkIsValueDeleted,getSortedOptionsByTitle } from './getSelectOpions';

const topics = [{
    deviceId: "fat",
    propertyId: "enum-proc",
    topic: "sweet-home/fat/enum-unit/enum-proc",
    value: "sweet-home/fat/enum-unit/enum-proc"

},{
    deviceId: "fat",
    propertyId: "int-proc",
    topic: "sweet-home/fat/enum-unit/int-proc",
    value: "sweet-home/fat/enum-unit/int-proc",

}];

describe('getOptions', () => {
    it('getOptions() - get topics option ', () => {
        const topicsOption=getOptions({
            deviceId: "fat",
            propertyId: "enum-proc",
            topic: "sweet-home/fat/enum-unit/enum-proc",
            value: "sweet-home/fat/enum-unit/enum-proc"
        
        },topics);

        expect(topicsOption).toEqual(topics);
    });


    it('getOptions() - get topics option after  selected topic has been deleted', () => {
        const deletedTopic= { 
            deviceId: "fat",        
            propertyId: "deleted",
            topic: "sweet-home/fat/enum-unit/deleted",
            value: "sweet-home/fat/enum-unit/deleted"
        };
        const topicsOption=getOptions(deletedTopic,topics);

        expect(topicsOption).toEqual([{...deletedTopic, disabled:true},...topics]);
    });

    it('checkIsValueDeleted() - check if values has deleted value', () => {
        const options = [
            { id:'1', value: 'value1', topic: 'value1' },
            { id:'2', value: 'value2', topic: 'value5' }
        ]
        const values = [
            'value3',
            'value2'
        ]
        const withDeleted = checkIsValueDeleted(values, options);
        const expectedResult = [
            { id: 'value3', label: 'value3', topic: 'value3', order: 0, deleted: true },
            { id: 'value2', label: 'value2', topic: 'value2', order: 1, deleted: true }
        ]

        expect(withDeleted).toEqual(expectedResult);
    });

    it('checkIsValueDeleted() - check if values has deleted value by property name', () => {
        const options = [
            { id:'1', topic: 'topic1' },
            { id:'2', topic: 'topic2' }
        ]
        const values = [
            'topic3',
            'topic2'
        ]
        const withDeleted = checkIsValueDeleted(values, options, 'topic');
        const expectedResult = [
            { id: 'topic3', label: 'topic3', topic: 'topic3', order: 0, deleted: true },
            { id: '2', topic: 'topic2', label: 'topic2', order: 1 }
        ]

        expect(withDeleted).toEqual(expectedResult);
    });

    it('getSortedOptionsByTitle() - sort options depend on title exist or not ', () => {
        const options = [
            { id: '4', label: 'label 1', value: 'value4', withTitle: false  },
            { id: '5', label: 'label 2', value: 'value5', withTitle: false  },
            { id: '1', label: 'ba', value: 'value1', withTitle: true },
            { id: '2', label: 'Bb', value: 'value2', withTitle: true  },
            { id: '3', label: 'a', value: 'value3', withTitle: true  },
        ]

        const withDeleted=getSortedOptionsByTitle(options);
        const expectedResult = [
            { id:'3', label:'a',  value:'value3', withTitle: true  },
            { id:'1', label:'ba', value:'value1', withTitle: true },
            { id:'2', label:'Bb', value:'value2', withTitle: true  },
            { id:'4', label:'label 1', value:'value4', withTitle: false  },
            { id:'5', label:'label 2', value:'value5', withTitle: false  },
        ]

        expect(withDeleted).toEqual(expectedResult);
    });
})
