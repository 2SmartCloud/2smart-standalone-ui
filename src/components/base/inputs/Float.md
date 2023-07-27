```js

const [value, setValue] = React.useState('');
const handleChangeValue = (value) => {
    setValue(value);
};

<div style={{maxWidth:'300px', height:'40px'}}>
    <FloatInput
        value={value}
        onChange = {handleChangeValue}
        placeholder='Float'
        className='form'
        maxLength={8}
        darkThemeSupport
        maximumHarcodingIOS
    />
</div>
```