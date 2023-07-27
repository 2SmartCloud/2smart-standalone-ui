export const EXTENSIONS_ENTITIES_NOT_SERIALIZED_MOCK_LIST = [
  {
    name: '@2smart/test-module',
    scheme: [],
    id: 'b31fbd8f7f2d835d613c5be963301f0e',
    entityTopic: 'extensions/b31fbd8f7f2d835d613c5be963301f0e',
    version: '0.4.0',
    description: '2smart test package',
    link: 'https://www.npmjs.com/package/2smart-test-module',
    state: 'installed',
    type: 'simple-scenario'
  }
]

export const EXTENSIONS_ENTITIES_MOCK_LIST= [
      {
        title: 'Test module',
        name: '@2smart/test-module',
        fields: [],
        id: 'b31fbd8f7f2d835d613c5be963301f0e',
        entityTopic: 'extensions/b31fbd8f7f2d835d613c5be963301f0e',
        version: '0.4.0',
        description: '2smart test package',
        link: 'https://www.npmjs.com/package/2smart-test-module',
        state: 'installed',
        type: 'simple-scenario'
      },
      {
        icon: 'http://192.168.1.156:8000/api/static/extension/icons/2PUR1KCnqAvGguSP6yMnR.svg',
        title: 'Time relay',
        name: '@2smart/time-relay',
        fields: [
          {
            label: 'Schedule*',
            name: 'SCHEDULE',
            type: 'schedule',
            validation: [
              'required',
              'string'
            ],
            placeholder: 'Set schedule'
          },
          {
            label: 'Switch topics*',
            name: 'SWITCH_TOPIC',
            type: 'topics',
            topicDataTypes: [
              'string',
              'integer',
              'float',
              'boolean',
              'enum',
              'color'
            ],
            validation: [
              'required',
              'not_empty_list',
              {
                list_of: 'string'
              }
            ],
            placeholder: 'Select topics'
          },
            {
                label: 'Message*',
                name: 'MESSAGE',
                type: 'string',
                validation: [
                'required',
                'string'
                ],
                placeholder: 'Set value'
            }
            ],
        id: '31d16cc59236fd3f3dfa7741022a1316',
        entityTopic: 'extensions/31d16cc59236fd3f3dfa7741022a1316',
        version: '1.9.0',
        description: '2smart time relay simple scenario',
        link: 'https://www.npmjs.com/package/2smart-time-relay',
        state: 'installed',
        type: 'simple-scenario'
      }
]


export const EXTENSIONS_MOCK_LIST = [
   {"name":"@2smart/another-module","title":"Another module","version":"1.7.0","description":"2smart another module","link":"https://www.npmjs.com/package/2smart-another-module","type":"simple-scenario","language":"JS"},
   {"name":"@2smart/time-relay","title":"Time relay","version":"1.9.0","description":"2smart time relay simple scenario","link":"https://www.npmjs.com/package/2smart-time-relay","type":"simple-scenario","language":"JS"},
   {"name":"@2smart/test-module","title":"Test module","version":"0.4.0","description":"2smart test package","link":"https://www.npmjs.com/package/2smart-test-module","type":"simple-scenario","language":"JS"}
]