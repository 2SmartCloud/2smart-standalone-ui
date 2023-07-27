### Settable
 ``` js
import { Provider } from 'react-redux';
import store from '../../../store/index.js';

const [isProcessing, setIsProcessing] = React.useState(false);

const [value, setValue] = React.useState(true);

const handleSetValue = ({value}) => {
    setIsProcessing(true);
    setValue(value);
    setTimeout(() => setIsProcessing(false), 1500);
};
    

<Provider store={store}>
    <Boolean
        value={value}
        unit='Unit'
        isSettable={true}
        isTransparent
        deviceId='fat'
        nodeId='thermometr'
        propertyId='boolean-unit'
        propertyType='sensors'
        isError={false}
        setValue={handleSetValue}
        hardwareType='node'
        isProcessing={isProcessing}
        darkThemeSupport
        baseControlClassName='NodeCard'
    />
</Provider>
```


### Without unit
 ``` js
import { Provider } from 'react-redux';
import store from '../../../store/index.js';

<Provider store={store}>
    <Boolean
        value={true}
        isSettable={true}
        isTransparent
        deviceId='fat'
        nodeId='thermometr'
        propertyId='boolean-unit'
        propertyType='sensors'
        isError={false}
        hardwareType='node'
        darkThemeSupport
        baseControlClassName='NodeCard'
    />
</Provider>
```

 ### Disabled
  ``` js
import { Provider } from 'react-redux';
import store from '../../../store/index.js';

<Provider store={store}>
    <Boolean
        value={true}
        unit='Unit'
        isTransparent
        deviceId='fat'
        nodeId='thermometr'
        propertyId='temp'
        darkThemeSupport
        baseControlClassName='NodeCard'
    />
</Provider>
```

