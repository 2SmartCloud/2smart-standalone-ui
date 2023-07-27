### Common
```js
const [value, setValue] = React.useState(true);
const handleToogle = ({value}) => {
    setValue(value)
};

 <GenericToggle
    value={value}
    unit={'unit'}
    isSettable={true}
    onToggle={handleToogle}
/>
```

### Processing
```js
const [value, setValue] = React.useState(true);
const [processing, setProcessing] = React.useState(false);
const handleToogle = ({value}) => {
    setValue(value);
    setProcessing(true);
    setTimeout(() => setProcessing(false), 2500);
};

 <GenericToggle
    value={value}
    unit={'unit'}
    isSettable={true}
    isProcessing={processing}
    onToggle={handleToogle}
/>

``` 

### Disabled
```js

 <GenericToggle
    value={true}
    unit={'unit'}
/>
```
