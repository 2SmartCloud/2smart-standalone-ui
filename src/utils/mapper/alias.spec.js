import moment from 'moment';
import * as aliases from './alias';
import {ALIASES} from '../../__mocks__/aliasesMock';

describe('aliases mappers', () => {
  
    it('mapAliasEntityToAlias', () => {
        const entity = {
            id:'id1',
            entityTopic:'topics-aliases/id1',
            topic:'sweet-home/fat/$telemetry/supply',
            name:'name1',
            parsedTopic:{}
        }
        const result = aliases.mapAliasEntityToAlias(entity);
        expect(result).toEqual(ALIASES[0]);
    });
      
    it('mapAliasEntityUpdateToAlias', () => {
        const expectedRootTopic = {
            rootTopic: 'topics-aliases/idNew'
        }
        const expectedConnectedTopic = {
            connectedTopic: 'topics-aliases/conected'
        }
        const resultRootTopic = aliases.mapAliasEntityUpdateToAlias({entityTopic:'topics-aliases/idNew'});
        const resultConnectedTopic  = aliases.mapAliasEntityUpdateToAlias({topic:'topics-aliases/conected'});
        
        expect(resultRootTopic).toEqual(expectedRootTopic);
        expect(resultConnectedTopic).toEqual(expectedConnectedTopic);

    });
      
});
