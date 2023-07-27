 ### Read only
  ``` js
import { Provider } from 'react-redux';
import store from '../../../store/index.js';

<Provider store={store}>
    <FloatControl
        value='1.123132'
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



 ### Settable
 ``` js
import { Provider } from 'react-redux';
import store from '../../../store/index.js';

const [isProcessing, setIsProcessing] = React.useState(false);
const [value, setValue] = React.useState('1.123132');
const handleSetValue = ({value}) => {
    setIsProcessing(true);
    setValue(value);
    setTimeout(() => setIsProcessing(false), 1500);
};
    

<Provider store={store}>
    <div style={{ maxWidth: '300px'}}>
        <FloatControl
            value={value}
            unit='Unit'
            isSettable={true}
            isTransparent
            deviceId='fat'
            nodeId='thermometr'
            propertyId='temp'
            isError={false}
            setValue={handleSetValue}
            isProcessing={isProcessing}
            darkThemeSupport
            baseControlClassName='NodeCard'
        />
    </div>
</Provider>
```