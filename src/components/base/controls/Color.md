
### Read only
 ``` js
import { Provider } from 'react-redux';
import store from '../../../store/index.js';

<Provider store={store}>
    <ColorControl
        value='0,0,0'
        options='rgb'
        deviceId='fat'
        nodeId='colors'
        propertyId='rgb-valid'
    />
</Provider>
```

### Settable
 ``` js
import { Provider } from 'react-redux';
import store from '../../../store/index.js';

const [isProcessing, setIsProcessing] = React.useState(false);

const [value, setValue] = React.useState('0,0,0');

const handleSetValue = ({value}) => {
    setIsProcessing(true);
    setValue(value);
    setTimeout(() => setIsProcessing(false), 1500);
};
    

<Provider store={store}>
    <ColorControl
        value={value || ''}
        isSettable
        options='rgb'
        deviceId='fat'
        nodeId='colors'
        propertyId='rgb-valid'
        setValue={handleSetValue}
        isProcessing={isProcessing}
    />
</Provider>
```
