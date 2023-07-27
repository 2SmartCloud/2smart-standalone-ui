 ### Read only
  ``` js
import { Provider } from 'react-redux';
import store from '../../../store/index.js';

<Provider store={store}>
    <EnumControl
        value={'ON'}
        unit='Unit'
        options={'ON,OFF,BOOL,NUM,STR'}
        nodeCard
        darkThemeSupport
    />
</Provider>
```

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
    <div style={{ maxWidth: '300px'}}>
        <EnumControl
            value={value}
            unit='Unit'
            options={'ON,OFF,BOOL,NUM,STR'}
            isSettable={true}
            setValue={handleSetValue}
            nodeCard
            isProcessing={isProcessing}
            darkThemeSupport
        />
    </div>
</Provider>
```