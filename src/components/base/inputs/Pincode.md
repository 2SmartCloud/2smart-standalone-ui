```js
const [value, setValue] = React.useState('');
const handleChangeValue = (value) => {
    setValue(value);
};
    

<div style={{maxWidth:'300px', height:'40px'}}>
    <PincodeInput
        value={value}
        onChange = {handleChangeValue}
        darkThemeSupport
        placeholder='Enter new PIN'
        maximumHarcodingIOS
    />
</div>
```