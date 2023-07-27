```js
const [value, setValue] = React.useState('');
const handleChangeValue = (value) => {
    setValue(value);
};
    

<div style={{maxWidth:'300px', height:'40px'}}>
    <IntegerInput
        value={value}
        onChange = {handleChangeValue}
        placeholder='Integer input '
        className='form'
        maxLength={30}
        darkThemeSupport
        maximumHarcodingIOS
    />
</div>
```