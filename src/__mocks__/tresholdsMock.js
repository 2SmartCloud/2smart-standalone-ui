export const tresholds ={
    multi: [
        {
			id: 'test',
			name: 'multi',
			value: 'value',
			settable: 'true',
			retained: 'true',
			dataType: 'string',
			unit: '#',
			format: '',
			rootTopic: 'scenarios/multi/test',
			scenarioId: 'multi'
        },
        {
			id: 'float',
			name: 'multi',
			value: '12.2',
			settable: 'true',
			retained: 'true',
			dataType: 'float',
			unit: '#',
			format: '',
			rootTopic: 'scenarios/multi/float',
			scenarioId: 'multi'
        }
      ],
    therm: [{
            id: 'test',
            name: 'therm',
            value: '123',
            settable: 'true',
            retained: 'true',
            dataType: 'string',
            unit: '#',
            format: '',
            rootTopic: 'scenarios/therm/test',
            scenarioId: 'therm'
        }
    ]
}

export const mappedMultiScenarioSetpoints=[
  	{
		id: 'test',
		name: 'test',
		value: 'value',
		settable: 'true',
		retained: 'true',
		dataType: 'string',
		unit: '',
		format: '',
		rootTopic: 'scenarios/multi/test',
		scenarioId: 'multi',
		deviceId     : 'threshold',
		hardwareType : 'threshold',
		propertyType : 'threshold',
		nodeId:'multi',
		propertyId:'test'
	},
	{
		id: 'float',
		name: 'float',
		value: '12.2',
		settable: 'true',
		retained: 'true',
		dataType: 'float',
		unit: '',
		format: '',
		rootTopic: 'scenarios/multi/float',
		scenarioId: 'multi',
		deviceId     : 'threshold',
		hardwareType : 'threshold',
		propertyType : 'threshold',
		nodeId:'multi',
		propertyId:'float'
	}
]


export const mappedSortedMultiScenarioSetpoints=[
  {
	  id: 'float',
	  name: 'float',
	  value: '12.2',
	  settable: 'true',
	  retained: 'true',
	  dataType: 'float',
	  unit: '',
	  format: '',
	  rootTopic: 'scenarios/multi/float',
	  scenarioId: 'multi',
	  deviceId     : 'threshold',
	  hardwareType : 'threshold',
	  propertyType : 'threshold',
	  nodeId:'multi',
	  propertyId:'float'
  },
  {
	id: 'test',
	name: 'test',
	value: 'value',
	settable: 'true',
	retained: 'true',
	dataType: 'string',
	unit: '',
	format: '',
	rootTopic: 'scenarios/multi/test',
	scenarioId: 'multi',
	deviceId     : 'threshold',
	hardwareType : 'threshold',
	propertyType : 'threshold',
	nodeId:'multi',
	propertyId:'test'
},
]