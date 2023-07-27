```js
const options = [
    {label: 'option 1', value:'option1'},
    {label: 'option 2', value:'option2'},
    {label: 'option 3', value:'option3'},
    {label: 'option 4', value:'option4'},
    {label: 'option 5', value:'option5'}
];
const [value, setValue] = React.useState(null);
const handleChangeValue = (value) => {
    setValue(value);
};


<div style={{ maxWidth: '300px'}}>
    <BaseSelect
        onChange={handleChangeValue}
        options={options}
        placeholder='Base select'
        settings={{
            isSearchable : false,
            value        : value
        }}
        darkThemeSupport
    />
</div>
```

### Searchable 
```js 
const options = [
    {label: 'option 1', value:'option1'},
    {label: 'option 2', value:'option2'},
    {label: 'option 3', value:'option3'},
    {label: 'option 4', value:'option4'},
    {label: 'option 5', value:'option5'}
];
const [value, setValue] = React.useState(null);
const handleChangeValue = (value) => {
    setValue(value);
};


<div style={{ maxWidth: '300px'}}>
    <BaseSelect
        onChange={handleChangeValue}
        options={options}
        placeholder='Base select'
        settings={{
            isSearchable : true,
            value        : value
        }}
        darkThemeSupport
    />
</div>
```
